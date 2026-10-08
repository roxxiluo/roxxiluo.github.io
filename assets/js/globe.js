/*
 * Sidebar globe, rendered with globe.gl.
 *
 * The library and its Earth textures add up to a few megabytes, so they are
 * requested only after the page has loaded and only once the globe is actually
 * on screen -- it is hidden on narrow layouts, where the sidebar has no room
 * for it. A failed CDN request drops the globe instead of breaking the sidebar.
 */
(function () {
  'use strict';

  var GLOBE_LIB = 'https://cdn.jsdelivr.net/npm/globe.gl@2.46.1/dist/globe.gl.min.js';
  var EARTH_IMAGE = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg';
  var EARTH_BUMP = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png';
  var DEFAULT_COLOR = '#ff9f43';
  var MIN_SIZE = 160;

  function readConfig() {
    var node = document.getElementById('globe-data');
    if (!node) {
      return null;
    }
    try {
      return JSON.parse(node.textContent);
    } catch (error) {
      console.warn('[globe] could not read globe data:', error);
      return null;
    }
  }

  function loadLibrary() {
    return new Promise(function (resolve, reject) {
      if (typeof Globe !== 'undefined') {
        resolve();
        return;
      }
      var script = document.createElement('script');
      script.src = GLOBE_LIB;
      script.async = true;
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error('globe.gl did not load'));
      };
      document.head.appendChild(script);
    });
  }

  function measure(container) {
    return Math.round(container.getBoundingClientRect().width);
  }

  function whenVisible(container, callback) {
    if (measure(container) > 0) {
      callback();
      return;
    }
    var observer = new ResizeObserver(function () {
      if (measure(container) > 0) {
        observer.disconnect();
        callback();
      }
    });
    observer.observe(container);
  }

  function toRgbChannels(color) {
    var value = String(color).replace('#', '');
    if (value.length === 3) {
      value = value.charAt(0) + value.charAt(0) + value.charAt(1) + value.charAt(1) + value.charAt(2) + value.charAt(2);
    }
    var parsed = parseInt(value, 16);
    if (value.length !== 6 || isNaN(parsed)) {
      return '255, 159, 67';
    }
    return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255].join(', ');
  }

  function fadingRing(place) {
    var channels = toRgbChannels(place.color || DEFAULT_COLOR);
    return function (progress) {
      return 'rgba(' + channels + ', ' + (1 - progress).toFixed(3) + ')';
    };
  }

  function fullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement;
  }

  function setFullscreen(wrapper, expand) {
    var action;
    if (expand) {
      action = wrapper.requestFullscreen || wrapper.webkitRequestFullscreen;
      if (action) {
        action.call(wrapper);
      }
    } else {
      action = document.exitFullscreen || document.webkitExitFullscreen;
      if (action) {
        action.call(document);
      }
    }
  }

  function connectFullscreen(wrapper, container, button, onChange) {
    var pointerStart = null;

    function updateButton() {
      var expanded = fullscreenElement() === wrapper;
      wrapper.classList.toggle('is-expanded', expanded);
      button.setAttribute('aria-label', expanded ? 'Close fullscreen globe' : 'Open globe in fullscreen');
      button.title = expanded ? 'Close fullscreen' : 'View fullscreen';
      onChange(expanded);
    }

    button.addEventListener('click', function (event) {
      event.stopPropagation();
      setFullscreen(wrapper, fullscreenElement() !== wrapper);
    });

    // A click opens the globe; dragging still rotates it normally.
    container.addEventListener('pointerdown', function (event) {
      pointerStart = { x: event.clientX, y: event.clientY, time: Date.now() };
    });
    container.addEventListener('pointerup', function (event) {
      if (!pointerStart || fullscreenElement() === wrapper) {
        pointerStart = null;
        return;
      }
      var distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
      var elapsed = Date.now() - pointerStart.time;
      pointerStart = null;
      if (distance < 6 && elapsed < 500) {
        setFullscreen(wrapper, true);
      }
    });

    document.addEventListener('fullscreenchange', updateButton);
    document.addEventListener('webkitfullscreenchange', updateButton);
    updateButton();
  }

  function createCityLabel(place) {
    var anchor = document.createElement('div');
    anchor.className = 'globe-city-label-anchor';

    var label = document.createElement('span');
    label.className = 'globe-city-label';
    label.textContent = place.name || '';
    label.style.setProperty('--city-color', place.color || DEFAULT_COLOR);

    anchor.appendChild(label);
    return anchor;
  }

  function build(container, config) {
    var places = (config.places || []).filter(function (place) {
      return typeof place.lat === 'number' && typeof place.lng === 'number';
    });
    var focus = config.focus || {};
    var wrapper = container.closest('.sidebar-globe');
    var expandButton = wrapper && wrapper.querySelector('.globe-expand');
    var size = Math.max(measure(container), MIN_SIZE);

    var globe = new Globe(container, { animateIn: false })
      .width(size)
      .height(size)
      .backgroundColor('rgba(0,0,0,0)')
      .globeImageUrl(EARTH_IMAGE)
      .bumpImageUrl(EARTH_BUMP)
      .showAtmosphere(true)
      .atmosphereColor('lightskyblue')
      .atmosphereAltitude(0.18)
      .pointsData(places)
      .pointColor(function (place) {
        return place.color || DEFAULT_COLOR;
      })
      .pointAltitude(0.012)
      .pointRadius(0.24)
      .pointLabel('name')
      .htmlElementsData(places)
      .htmlLat('lat')
      .htmlLng('lng')
      .htmlAltitude(0.018)
      .htmlElement(createCityLabel)
      .htmlTransitionDuration(0)
      .ringsData(places.filter(function (place) {
        return place.highlight;
      }))
      .ringColor(fadingRing)
      .ringMaxRadius(3)
      .ringPropagationSpeed(1.2)
      .ringRepeatPeriod(1400);

    var controls = globe.controls();
    controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotateSpeed = 0.4;
    // The globe lives in a scrolling sidebar, so leave the wheel to the page.
    controls.enableZoom = false;

    // Explicit wheel handling makes fullscreen zoom reliable across browser
    // versions even when the underlying Three.js controls miss the first
    // fullscreen state change.
    container.addEventListener('wheel', function (event) {
      if (!wrapper || fullscreenElement() !== wrapper) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      var view = globe.pointOfView();
      var nextAltitude = Math.max(0.28, Math.min(4, view.altitude * Math.exp(event.deltaY * 0.0015)));
      globe.pointOfView({
        lat: view.lat,
        lng: view.lng,
        altitude: nextAltitude
      }, 0);
    }, { passive: false });

    globe.pointOfView({
      lat: typeof focus.lat === 'number' ? focus.lat : 25,
      lng: typeof focus.lng === 'number' ? focus.lng : 110,
      altitude: 2.4
    }, 0);

    new ResizeObserver(function () {
      var next = Math.max(measure(container), MIN_SIZE);
      globe.width(next).height(next);
    }).observe(container);

    container.classList.add('is-ready');
    if (wrapper && expandButton) {
      wrapper.classList.add('is-ready');
      connectFullscreen(wrapper, container, expandButton, function (expanded) {
        // Avoid trapping normal page scrolling in the compact sidebar globe.
        // Fullscreen mode enables wheel zoom and touch pinch zoom.
        controls.enableZoom = expanded;
        controls.enablePan = expanded;
      });
    }
  }

  function boot() {
    var container = document.getElementById('globe-root');
    var config = container && readConfig();
    if (!config) {
      return;
    }

    whenVisible(container, function () {
      loadLibrary()
        .then(function () {
          build(container, config);
        })
        .catch(function (error) {
          console.warn('[globe] skipped:', error);
          var wrapper = container.parentNode;
          if (wrapper && wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
          }
        });
    });
  }

  if (document.readyState === 'complete') {
    boot();
  } else {
    window.addEventListener('load', boot);
  }
})();
