---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<!--
  TODO: 这是你的简历页。Publications / Talks / Teaching 会自动从对应目录生成，
  你只需要填写 Education / Work experience / Skills / Service 等静态段落。
-->

Education
======
* **Ph.D. in <Field>**, [Your University](https://example.edu), <Year> (expected)
  * Advisor: [Prof. Advisor Name](https://example.edu)
* **M.S. in <Field>**, [Your University](https://example.edu), <Year>
* **B.S. in <Field>**, [Your University](https://example.edu), <Year>

Work experience
======
* **<Position>**, <Institution>, <Year>–present
  * <One line about your role and responsibilities>

* **<Internship / Research Assistant>**, <Institution>, <Year>
  * <One line about your role and responsibilities>

Skills
======
* **Programming**: Python, <C++ / CUDA / ...>
* **Frameworks / Tools**: PyTorch, <ROS / MuJoCo / ...>
* **Languages**: <Chinese (native), English (fluent)>

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
  
Teaching
======
  <ul>{% for post in site.teaching reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Service and leadership
======
* Reviewer for <Conference / Journal, Year>.
* <Any committee / mentoring / organizing role>.
