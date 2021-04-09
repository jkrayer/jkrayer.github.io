---
pagination:
  data: collections
  size: 1
  alias: tag
  filter:
    - posts
    - tagList
  addAllPagesToCollections: true
layout: base.njk
eleventyComputed:
  title: Tagged "{{ tag }}"
permalink: /tags/{{ tag }}/
---

{% set postslist = collections[ tag ] %}

<ol reversed class="postlist">
{% for post in postslist | reverse %}
  <li class="postlist-item{% if post.url == url %} postlist-item-active{% endif %}">
    <a href="{{ post.url | url }}" class="postlist-link">{% if post.data.title %}{{ post.data.title }}{% else %}<code>{{ post.url }}</code>{% endif %}</a>
    <time class="postlist-date" datetime="{{ post.date | htmlDateString }}">{{ post.date | readableDate }}</time>
  </li>
{% endfor %}
</ol>

<p>See <a href="{{ '/tags/' | url }}">all tags</a>.</p>
