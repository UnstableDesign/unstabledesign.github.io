---
layout: page
title: Learn AdaCAD
permalink: /learn
comments: false
---

<div class="row justify-content-between">
<div class="col-md-8 pr-5">

<p>We have created a collection of resources to help you get started with AdaCAD. As a work in progress, you may not want to use it for more most important and critical projects (yet!) but feel free to play and see how it works for you. </p>

<a class="btn btn-warning" target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLScXyadsMt2Fsks2ajskkz9cxYH9Ev8D9CfiTOBmiA-yKMMtKA/viewform">Report Bugs, Request Features, Provide Feedback</a>

<div class="row listrecent">
	
{% for category in site.categories %}
{% if category[0] == 'how to' %}

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

<h6>Prototyping Smart Textiles E-Book</h6>
<p>A textbook in progress that describes textile structures to engineers, and engineering concepts to non-engnieers</p>
<a class="btn" target="_blank" href="https://unstable.design/prototyping-smart-textiles/_book/">Read the Book</a>

<br>
<h6>Soft Object Course</h6>
<p>You can follow our course curriculum and view student projects on our course webpage</p>
<a class="btn" target="_blank" href="https://unstable.design/soft-object/_book/">Check out Curriculum</a>
<br>

<h6>How to Get What you Want</h6>
<p>If it were not for Kobakant, we would have never been able to do this project. They offer an incredible set of resources for those interested in experimental weaving, sewing, felting, and fibering of all kinds</p>
<a class="btn" target="_blank" href="https://www.kobakant.at/DIY/">Check out Kobakant</a>
<br>

<h6>E-Textiles Lounge</h6>
<p>The e-textiles lounge youtube channel offers several great tutorials for soft circuit projects, including great details on working with conductive yarns and multimeters.</p>
<a class="btn" target="_blank" href="https://www.youtube.com/channel/UCRfYpxm10B2plhkC5g597Iw">Check out E-Textiles Lounge</a>
<br>

</div>
</div>
</div>
