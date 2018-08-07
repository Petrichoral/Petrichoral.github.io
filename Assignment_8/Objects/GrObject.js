"use strict";

const GrObject = function(name, transform, update) {
  
  let shaderProgram = null;
  let vertexLoc = null;
  let colorLoc = null;
  let normalLoc = null;
  let texCoordLoc = null;
  let texSamplerLoc = null;
  let vertexBuffer = null;
  let colorBuffer = null;
  let normalBuffer = null;
  let texCoordBuffer = null;
  let texture = null;
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
    texCoords: undefined,
    indices: undefined,
    textureSource: undefined,
    vertexSource: undefined,
    fragmentSource: undefined,
    
    init(drawingState) {
      let gl = drawingState.gl;
      past = drawingState.realtime;
      // Create the shader program
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
      
      //Get the uniform locations
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
      if (!texSamplerLoc) {
        texSamplerLoc = gl.getUniformLocation(shaderProgram, "texSampler");
      }
      
      // create the texture
      if (!texture) {
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        {
          const target = gl.TEXTURE_2D;
          const level = 0;
          const width = 1;
          const height = 1;
          const border = 0;
          const internalFormat = gl.RGBA;
          const format = gl.RGBA;
          const type = gl.UNSIGNED_BYTE;
          const pixels = new Uint8Array([255, 0, 0, 255]);
          gl.texImage2D(
              target,
              level,
              internalFormat,
              width,
              height,
              border,
              format,
              type,
              pixels,
          );
        }
      }
      
      if (this.textureSource) {
        let textureImage = new Image();
        textureImage.crossOrigin = "anonymous";
        textureImage.src = this.textureSource;
        textureImage.onload = function() {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          {
            const target = gl.TEXTURE_2D;
            const level = 0;
            const internalFormat = gl.RGBA;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            const pixels = textureImage;
            gl.texImage2D(
                target,
                level,
                internalFormat,
                format,
                type,
                pixels,
            );
          }
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
          gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);    
          gl.uniform1i(texSamplerLoc, 0);
        }
      }
      
      if (!texCoordLoc) {
        texCoordLoc = gl.getAttribLocation(shaderProgram, "texCoord");
      }
      
      if (!vertexLoc) {
        vertexLoc = gl.getAttribLocation(shaderProgram, "position");
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
      
      if (!normalBuffer) {
        normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.normals),
            gl.STATIC_DRAW,
        );
      }
      
      if (!texCoordBuffer) {
        texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.texCoords),
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
      //gl.enableVertexAttribArray(colorLoc);
      gl.enableVertexAttribArray(normalLoc);
      gl.enableVertexAttribArray(texCoordLoc);
      
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
      
      {
        const size = 2;
        const type = gl.FLOAT;
        const normalized = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.vertexAttribPointer(
            texCoordLoc,
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