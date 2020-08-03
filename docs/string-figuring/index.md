# String Figure Sensor
- Designed by Jolie Klefeker and [Laura Devendorf](https://github.com/devendork) 

## Summary 
We used a knitted i-cord structure and integrated resistive wiritng into the sheath and core in order to create a sort of pipe-cleaner type object whose shape could be sensed through resistive sensing. 


## Equipment Specifics
hands and knitting needles or an embellishment i-cord knitter

## Yarns
- wool yarn
- statex resistive thread (we believe, its quite old so we don't know exactly which)
- cotton covered wire sourced from wires.co.uk
- copper tape
- enamel covered magnet wire (roughly 26 AWG)


## How To

1. If possible (this depends on the hairiness of your yarns), feed your wool and resistive yarn into the embellish-knit machine at the same time. Otherwise, simply hand knit the cord, feeding the structure with both materials. Congratulations, you just made a strain sensor that acutally works pretty good for sensing breath, but that's another project. 

 
2. Prepare your core. I did this by cutting out the cotton covered wire to the length I required. It was important (and serindipitous) that I had this wire because it gave the structure shape without exposing the wire, which would have interfered in the circuit. I prepared the cord by cutting 4 lengths of copper wire, each one a bit longer than the other (these compose the different "sections" within which you can sense. I then sanded the end of the copper wire to remove the enamel and taped it to the cotton covered wire with the copper tape. Thus, resistance readings from the outer sheath are intercepted by the copper and can be read on their end. 

3. Then, I carefully fed the core through the sheath and fastened the end. 

## Why It Works

One end of the resistive sheath is connected to power and the other end to ground (and we make sure they don't touch by knitting a spacer between the ends. The five copper wires act as an analog output, with their resistance value indicating the total resistance the electricity has encountered until the point it was measured (at least I think this is what we think is happening based on what we observed). Because electricity will follow the path of least resistance, looping the cord at any point gives the electricity a short cut (because the resistive wires touch, creating a shorter path to ground). If we had just one output (e.g. the sheath and nothing in the center) it would tell us that the string is crossed somewhere along its length. We add in the additional measuring points to get finer granded feedback about where the looping is taking place. This allows us to capture a "signature" across all the resistance values that tells us something. If it is close to zero, it is usually bundled up in a really tight ball. If it is close to its maximum, there are no crosses in the string. 


## Diagrams

![Diagram of the yarn-based system.](http://unstable.design/wp-content/uploads/2020/08/2018-01-03-14.43.49.jpg)

![Measuring setup. A power and ground connection at the beginning and end of string. A non-conductive section in between these regions makes resistance is measured across the entire length of the yarn.](http://unstable.design/wp-content/uploads/2020/08/2018-01-03-14.47.43.jpg)

![Resistance reading with no crossings in the yellow region](http://unstable.design/wp-content/uploads/2020/08/2018-01-03-14.47.43.jpg)

![Resistance reading with a crossing in the yellow region (note lower resistence value given that there is a shorter path)](http://unstable.design/wp-content/uploads/2020/08/2018-01-03-14.43.49.jpg)


## Publication

You can read more about the project in our work in progress paper: [String Figuring: A Story of Reflection, Material Inquiry, and a Novel Sensor] (https://dl.acm.org/doi/10.1145/3170427.3188570) 

