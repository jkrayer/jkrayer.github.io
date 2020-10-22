---
title: "Tags"
layout: "base.njk"
---

<ul>
{% for tag in collections.tagList %}
  {% set tagUrl %}/tags/{{ tag }}/{% endset %}
  <li><a href="{{ tagUrl }}">{{tag}}</a></li>
{% endfor %}
</ul>

<p>See <a href="{{ '/tags/' }}">all tags</a>.</p>
