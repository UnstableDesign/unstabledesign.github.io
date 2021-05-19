---
layout: page
title: Projects and Ideas
permalink: /ideas
comments: false
---

<div class="row justify-content-between">
<div class="col-md-8 pr-5">

<p>
	The ideas page shows some of the prototypes and how tos that we have made to document our projects in the Unstable Design Lab. 

</p>

<div class="row listrecent">
	
{% for category in site.categories %}
{% if category[0] == 'ideas' %}

<div class="section-title col-md-12 mt-4">

<h2 id="{{ category[0] | replace: " ","-" }}"><span class="text-capitalize">{{ category[0] }}</span></h2>
</div>

{% assign pages_list = category[1] %}
{% for post in pages_list %}
{% if post.title != null %}
{% if group == null or group == post.group %}
{% include postbox.html %}
{% endif %}
{% endif %}
{% endfor %}
{% assign pages_list = nil %}
{% assign group = nil %}

{% endif %}

{% endfor %}
</div>

</div>

<div class="col-md-4">

<div class="sticky-top sticky-top-80">
<h5>Related Resources</h5>
<!-- 
<h6>Prototyping Smart Textiles E-Book</h6>
<p>A textbook in progress that describes textile structures to engineers, and engineering concepts to non-engnieers
	<a href="https://unstable.design/prototyping-smart-textiles/_book/">https://unstable.design/prototyping-smart-textiles/_book/</a></p>

<h6>Soft Object Course</h6>
<p>Talk about the book here</p>

<h6>Kobakant</h6>
<p>Talk about the book here</p>


<h6>E-Textiles Lounge</h6>
<p>Talk about the book here</p> -->


</div>
</div>
</div>
