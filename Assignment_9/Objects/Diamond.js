"use strict";
// Check if array is defined
var grobjects = grobjects || [];

let Diamond = (function() {
  const vertexSource = document.getElementById("diamond-vshader").text;
  const fragmentSource = document.getElementById("diamond-fshader").text;
  
  const vertices = [
    // Face 1
     0.000000,  1.000000,  0.000000,
     1.000000,  0.000000,  0.000000,
     0.000000,  0.000000,  1.000000,
    // Face 2
     0.000000,  1.000000,  0.000000,
     1.000000,  0.000000,  0.000000,
     0.000000,  0.000000, -1.000000,
    // Face 3
     0.000000,  1.000000,  0.000000,
    -1.000000,  0.000000,  0.000000,
     0.000000,  0.000000,  1.000000,
    // Face 4
     0.000000,  1.000000,  0.000000,
    -1.000000,  0.000000,  0.000000,
     0.000000,  0.000000, -1.000000,
    // Face 5
     0.000000, -1.000000,  0.000000,
     1.000000,  0.000000,  0.000000,
     0.000000,  0.000000,  1.000000,
    // Face 6
     0.000000, -1.000000,  0.000000,
     1.000000,  0.000000,  0.000000,
     0.000000,  0.000000, -1.000000,
    // Face 7
     0.000000, -1.000000,  0.000000,
    -1.000000,  0.000000,  0.000000,
     0.000000,  0.000000,  1.000000,
    // Face 8
     0.000000, -1.000000,  0.000000,
    -1.000000,  0.000000,  0.000000,
     0.000000,  0.000000, -1.000000,
  ];
  
  const normals = [
    // Face 1
    -0.707107,  0.000000, -0.707107,
    -0.707107,  0.000000, -0.707107,
    -0.707107,  0.000000, -0.707107,
    // Face 2
     0.707107,  0.000000, -0.707107,
     0.707107,  0.000000, -0.707107,
     0.707107,  0.000000, -0.707107,
    // Face 3
    -0.707107,  0.000000,  0.707107,
    -0.707107,  0.000000,  0.707107,
    -0.707107,  0.000000,  0.707107,
    // Face 4
     0.707107,  0.000000,  0.707107,
     0.707107,  0.000000,  0.707107,
     0.707107,  0.000000,  0.707107,
    // Face 5
     0.707107,  0.000000,  0.707107,
     0.707107,  0.000000,  0.707107,
     0.707107,  0.000000,  0.707107,
    // Face 6
    -0.707107,  0.000000,  0.707107,
    -0.707107,  0.000000,  0.707107,
    -0.707107,  0.000000,  0.707107,
    // Face 7
     0.707107,  0.000000, -0.707107,
     0.707107,  0.000000, -0.707107,
     0.707107,  0.000000, -0.707107,
    // Face 8
    -0.707107,  0.000000, -0.707107,
    -0.707107,  0.000000, -0.707107,
    -0.707107,  0.000000, -0.707107,
  ];
  
  const colors = [
    // Face 1
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    // Face 2
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    // Face 3
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    // Face 4
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    // Face 5
    0.0, 1.0, 1.0, 1.0,
    0.0, 1.0, 1.0, 1.0,
    0.0, 1.0, 1.0, 1.0,
    // Face 6
    1.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,
    // Face 7
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    // Face 8
    0.1, 0.1, 0.1, 1.0,
    0.1, 0.1, 0.1, 1.0,
    0.1, 0.1, 0.1, 1.0,
  ];
  
  const indices = [
    // Face 1
    0, 1, 2,
    // Face 2
    3, 4, 5,
    // Face 3
    6, 7, 8,
    // Face 4
    9, 10, 11,
    // Face 5
    12, 13, 14,
    // Face 6
    15, 16, 17,
    // Face 7
    18, 19, 20,
    // Face 8
    21, 22, 23,
  ];
  
  let shaderProgram = null;
  let vertexLoc = null;
  let colorLoc = null;
  let normalLoc = null;
  let vertexBuffer = null;
  let colorBuffer = null;
  let normalBuffer = null;
  let indexBuffer = null;
  
  return (function(name, transform) {
    return {
      name: name,
      modelViewMatrixLoc: null,
      projectionMatrixLoc: null,
      normalMatrixLoc: null,
      init(drawingState) {
        let gl = drawingState.gl;
        
        if (!shaderProgram) {
          let vertexShader = gl.createShader(gl.VERTEX_SHADER);
          gl.shaderSource(vertexShader, vertexSource);
          gl.compileShader(vertexShader);
          if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(vertexShader));
            return null;
          }
          
          let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
          gl.shaderSource(fragmentShader, fragmentSource);
          gl.compileShader(fragmentShader);
          if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(fragmentShader));
            return null;
          }
          
          shaderProgram = gl.createProgram();
          gl.attachShader(shaderProgram, vertexShader);
          gl.attachShader(shaderProgram, fragmentShader);
          gl.linkProgram(shaderProgram);
          if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
              alert("Could not initialize shaders");
          }
        };
          
        this.modelViewMatrixLoc = gl.getUniformLocation(
            shaderProgram,
            "modelViewMatrix",
        );
        this.projectionMatrixLoc = gl.getUniformLocation(
            shaderProgram,
            "projectionMatrix",
        );
        this.normalMatrixLoc = gl.getUniformLocation(
            shaderProgram,
            "normalMatrix",
        );
        
        if (!vertexLoc) {
          vertexLoc = gl.getAttribLocation(shaderProgram, "position");
        }
        if (!colorLoc) {
          colorLoc = gl.getAttribLocation(shaderProgram, "color");
        }
        if (!normalLoc) {
          normalLoc = gl.getAttribLocation(shaderProgram, "normal");
        }
        
        if (!vertexBuffer) {
          vertexBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array(vertices),
              gl.STATIC_DRAW,
          );
        }
        
        if (!colorBuffer) {
          colorBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
          gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array(colors),
              gl.STATIC_DRAW,
          );
        }
        
        if (!normalBuffer) {
          normalBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
          gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array(normals),
              gl.STATIC_DRAW,
          );
        }
        
        if (!indexBuffer) {
          indexBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
          gl.bufferData(
              gl.ELEMENT_ARRAY_BUFFER,
              new Uint16Array(indices),
              gl.STATIC_DRAW,
          );
        }
      },
      draw(drawingState) {
        let gl = drawingState.gl;
        gl.useProgram(shaderProgram);
        
        if (!transform) {
          transform = {};
        }
        if (!transform.translate) {
          transform.translate = [0, 0, 0];
        }
        if (!transform.rotate) {
          transform.rotate = [0, 0, 0];
        }
        if (!transform.scale) {
          transform.scale = transform.scale || [1, 1, 1];
        }
        
        let modelViewMatrix = twgl.m4.identity();
        
        twgl.m4.translate(
            modelViewMatrix, 
            transform.translate, 
            modelViewMatrix,
        );
        
        twgl.m4.rotateX(
            modelViewMatrix,
            transform.rotate[0],
            modelViewMatrix,
        );
        
        twgl.m4.rotateY(
            modelViewMatrix,
            transform.rotate[1],
            modelViewMatrix,
        );
        
        twgl.m4.rotateZ(
            modelViewMatrix,
            transform.rotate[2],
            modelViewMatrix,
        );
        
        twgl.m4.scale(
            modelViewMatrix,
            transform.scale,
            modelViewMatrix,
        );
        
        twgl.m4.multiply(modelViewMatrix, drawingState.view, modelViewMatrix);
        
        gl.uniformMatrix4fv(
            this.modelViewMatrixLoc,
            false,
            modelViewMatrix,
        );
        gl.uniformMatrix4fv(
            this.projectionMatrixLoc,
            false,
            drawingState.proj,
        );
        gl.uniformMatrix4fv(
            this.normalMatrixLoc,
            false,
            twgl.m4.transpose(twgl.m4.inverse(modelViewMatrix)),
        );
        gl.enableVertexAttribArray(vertexLoc);
        gl.enableVertexAttribArray(colorLoc);
        gl.enableVertexAttribArray(normalLoc);
        
        {
          const size = 3;
          const type = gl.FLOAT;
          const normalized = false;
          const stride = 0;
          const offset = 0;
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.vertexAttribPointer(
              vertexLoc,
              size,
              type,
              normalized,
              stride,
              offset
          );
        }
        
        {
          const size = 4;
          const type = gl.FLOAT;
          const normalized = false;
          const stride = 0;
          const offset = 0;
          gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
          gl.vertexAttribPointer(
              colorLoc,
              size,
              type,
              normalized,
              stride,
              offset
          );
        }
        
        {
          const size = 3;
          const type = gl.FLOAT;
          const normalized = false;
          const stride = 0;
          const offset = 0;
          gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
          gl.vertexAttribPointer(
              normalLoc,
              size,
              type,
              normalized,
              stride,
              offset
          );
        }
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        
        {
          const vertexCount = 24;
          const type = gl.UNSIGNED_SHORT;
          const offset = 0;
          gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
        
      },
      center() {
        return (!transform.translate) ? [0, 0, 0] : transform.translate;
      },
    };
  });
})();

grobjects.push(Diamond(
    "diamond1",
    {
      translate: [0, 0, 2],
      rotate: [Math.PI, 0, Math.PI/2],
      scale: [0.5, 0.5, 0.5],
    },
));
grobjects.push(Diamond(
    "diamond2",
    {
      translate: [0, 0, -2],
      rotate: [Math.PI, 0, Math.PI/2],
      scale: [0.5, 0.5, 0.5],
    },
));
grobjects.push(Diamond(
    "diamond3",
    {
      translate: [-2, 0, 0],
      rotate: [Math.PI, 0, Math.PI/2],
      scale: [0.5, 0.5, 0.5],
    },
));
grobjects.push(Diamond(
    "diamond4",
    {
      translate: [2, 0, 0],
      rotate: [Math.PI, 0, Math.PI/2],
      scale: [0.5, 0.5, 0.5],
    },
));
grobjects.push(Diamond(
    "diamond5",
    {
      translate: [0, 2, 0],
      rotate: [Math.PI, 0, Math.PI/2],
      scale: [0.5, 0.5, 0.5],
    },
));
grobjects.push(Diamond(
    "diamond6",
    {
      translate: [0, -2, 0],
      rotate: [Math.PI, 0, Math.PI/2],
      scale: [0.5, 0.5, 0.5],
    },
));
grobjects.push(Diamond("diamond7", null));