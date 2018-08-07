"use strict";

const GrObject = function(name, transform, update) {
  
  let shaderProgram = null;
  let vertexLoc = null;
  let colorLoc = null;
  let normalLoc = null;
  let vertexBuffer = null;
  let colorBuffer = null;
  let normalBuffer = null;
  let indexBuffer = null;
  let sunDirectionLoc = null;
  let past = null;
  let deltaTime = null;
  
  return {
    name: name,
    modelViewMatrixLoc: null,
    projectionMatrixLoc: null,
    normalMatrixLoc: null,
    vertexCount: undefined,
    vertices: undefined,
    normals: undefined,
    colors: undefined,
    indices: undefined,
    vertexSource: undefined,
    fragmentSource: undefined,
    init(drawingState) {
      let gl = drawingState.gl;
      past = drawingState.realtime;
      if (!shaderProgram) {
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, this.vertexSource);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(vertexShader));
          return null;
        }
        
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, this.fragmentSource);
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
      
      if (!sunDirectionLoc) {
        sunDirectionLoc = gl.getUniformLocation(
            shaderProgram,
            "sunDirection",
        );
      }
      
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
            new Float32Array(this.vertices),
            gl.STATIC_DRAW,
        );
      }
      
      if (!colorBuffer) {
        colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.colors),
            gl.STATIC_DRAW,
        );
      }
      
      if (!normalBuffer) {
        normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.normals),
            gl.STATIC_DRAW,
        );
      }
      
      if (!indexBuffer) {
        indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices),
            gl.STATIC_DRAW,
        );
      }
      
      past = drawingState.realtime;
    },
    draw(drawingState) {
      let present = drawingState.realtime;
      deltaTime = present - past;
      past = present;
      
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
      
      if (update) {
        modelViewMatrix = update(modelViewMatrix, deltaTime);
      }
      
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
      gl.uniform3fv(
          sunDirectionLoc,
          drawingState.sunDirection,
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
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, this.vertexCount, type, offset);
      }
      
    },
    center() {
      return (!transform.translate) ? [0, 0, 0] : transform.translate;
    },
  };
}