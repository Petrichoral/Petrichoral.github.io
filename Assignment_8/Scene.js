"use strict";
var grobjects = grobjects || [];

const octoupdate = (function() {
  const r_velocity = 1.0 / 2000.0; 
  let angle = 0;
  return (function(modelViewMatrix, deltaTime) {
    angle += deltaTime * r_velocity;
    
    if (angle > 2 * Math.PI) {
      angle -= 2 * Math.PI;
    }
    
    return twgl.m4.scale(
      modelViewMatrix,
      [Math.cos(angle), Math.cos(angle), Math.cos(angle)],
      modelViewMatrix,
    );
  });
})();

grobjects.push(Octahedron(
    "octahedron1",
    {
      translate: [0, 2, 2],
      rotate: [Math.PI/6, 0, Math.PI/6],
      scale: [0.5, 0.5, 0.5],
    },
    octoupdate,
));
grobjects.push(Octahedron(
    "octahedron2",
    {
      translate: [0, 2, -2],
      rotate: [Math.PI / 8, 0, Math.PI/4],
      scale: [0.5, 0.5, 0.5],
    },
    octoupdate,
));
grobjects.push(Octahedron(
    "octahedron3",
    {
      translate: [-2, 2, 0],
      rotate: [Math.PI, 0, Math.PI/4],
      scale: [0.5, 0.5, 0.5],
    },
    octoupdate,
));
grobjects.push(Octahedron(
    "octahedron4",
    {
      translate: [2, 2, 0],
      rotate: [Math.PI / 2, 0, Math.PI/2],
      scale: [0.5, 0.5, 0.5],
    },
    octoupdate,
));
grobjects.push(Octahedron(
    "octahedron5",
    {
      translate: [0, 4, 0],
      rotate: [0, 0, 0],
      scale: [0.5, 0.5, 0.5],
    },
    octoupdate,
));
grobjects.push(Octahedron(
    "octahedron6",
    {
      translate: [0, 0, 0],
      rotate: [Math.PI, 0, Math.PI],
      scale: [0.5, 0.5, 0.5],
    },
    octoupdate,
));



const icoupdate = (function() {
  const r_velocity = 1.0 / 500.0; 
  let angle = 0;
  return (function(modelViewMatrix, deltaTime) {
    angle += deltaTime * r_velocity;
    
    if (angle > 2 * Math.PI) {
      angle -= 2 * Math.PI;
    }
    
    return twgl.m4.rotateX(modelViewMatrix, angle, modelViewMatrix);
  });
})();


grobjects.push(Icosahedron(
  "icosahedron",
  {
    translate: [0, 2, 0],
    scale: [0.618034,0.618034,0.618034],
  },
  icoupdate,
));

grobjects.push(Grass("grass-plane", null, null));