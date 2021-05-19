---
layout: post
title:  "Multi-Component Weave"
author: shanel
categories: [ideas]
image: /assets/images/multicomponent.png
tags: [thermochromics, double weaving, force sensing, circuitry]
comments: true

---
Designed By: Shanel Wu; Warps: 230; Shuttles: 6

![Overview of Multi-Component Weave and different press states][final]

## Loom: Schacht Baby Wolf (8-shaft)

## Warp Yarns
- 10/2 Pearl cotton in black and white

## Weft Yarns
- (10P) 10/2 Pearl cotton in black (-B) and white (-W)
- (SS) stainless steel conductive yarn
- (CC) dyed thermochromic cotton-covered copper conductive yarn

## Shuttles
1. Ground fabric (10P-B)
2. Pressure sensor (10P-W + SS)
3. Ground fabric when split (10P-B)
4. Thermochromic (CC)
5. Pocket (10P-W)
6. Pocket when split (10P-W)

## Function
This Multi-Component Weave design shows how a woven smart textile can be a complete embedded system, handling real-time inputs and outputs to achieve a specific function. The weaving integrates a sensor input (pressure) and an output (color change) into the fabric structure, while creating a pocket for an external PCB (e.g. an Arduino microprocessor) to integrate processing. This mixture of techniques and materials demonstrates how the weaving process can be used to develop complex, multi-functional smart textiles. The color-changing region has been documented in other projects, but I describe the pressure sensor and pocket in more detail below.

### Pressure Sensor

The pressure sensor was created with a woven structure (stitch) called waffle weave. Waffle weave is a textured structure often used in towels because its airiness makes it highly absorbent. When woven using a conductive yarn along with a non-conductive yarn (I used stainless steel with 10/2 Pearl cotton yarn), the structure is highly resistive when uncompressed, and then decreases significantly in resistance when compressed. This pressure-sensing fabric references the work on this [Kobakant page](https://www.kobakant.at/DIY/?p=6005).

![A comparison of the waffle weave draft to the woven fabric.]({{site.baseurl}}/assets/images/multicomponent_stitch.png)

### Double Woven Pocket

The pocket was created using double weave. Double weaving is a class of woven structure that allows two layers of fabric to be woven simultaneously, making pockets, tunnels, and other topologies possible. During weaving, the pocket was also separated into two shuttles to create a slit for easy access to the microcontroller's power switch.

## Draft Notes

Currently, there is no large, "master" draft for this piece. Because I was using a non-digital loom, I found it more helpful to use small unit drafts to represent certain sections as instructions for myself. The files are bitmaps of these unit drafts.

## Files
- [Draft Bitmap](/drafts/multicomponent_weave/multiComponent.bmp)
- [Waffle Unit Bitmap](/drafts/multicomponent_weave/waffleUnit.bmp)

[final]: {{site.baseurl}}/assets/images/multicomponent.png "Figure for Multi-Component Weave"


