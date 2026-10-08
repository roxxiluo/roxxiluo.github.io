---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Profile
======
Research engineer working on embodied intelligence, reinforcement learning, and
vision-language-action models, with a focus on translating research into
deployable robotic systems.

Education
======
* **MSc Robotics with Distinction**, [University of Bristol](https://www.bristol.ac.uk/study/postgraduate/taught/msc-robotics/) and University of the West of England, 2025–2026
  * Jointly awarded degree with research conducted at the [Bristol Robotics Laboratory](https://www.bristolroboticslab.com/).

Work experience
======
* **Research Engineer**, [Beijing Innovation Center of Humanoid Robotics Co., Ltd.](https://www.x-humanoid.com/en/), February 2026–Present
  * Exploring reinforcement learning and vision-language-action methods for real-world embodied intelligence systems.

Publications
======
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Talks
======
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>
