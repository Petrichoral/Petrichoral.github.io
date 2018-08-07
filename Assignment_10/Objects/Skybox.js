"use strict";

const Skybox = function(name, transform, update) {
  
  let shaderProgram = null;
  let vertexLoc = null;
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
    vertexCount: undefined,
    vertices: undefined,
    normals: undefined,
    texCoords: undefined,
    indices: undefined,
    coeff: undefined,
    textureSources: undefined,
    vertexSource: undefined,
    fragmentSource: undefined,
    modelViewMatrixLoc: null,
    projectionMatrixLoc: null,
    normalMatrixLoc: null,
    coeffLoc: null,

    
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

      this.coeffLoc = gl.getUniformLocation(
          shaderProgram,
          "coeff",
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
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        {
          const targets = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
          ];
          const level = 0;
          const internalFormat = gl.RGBA;
          const width = 1;
          const height = 1;
          const border = 0;
          const format = gl.RGBA;
          const type = gl.UNSIGNED_BYTE;
          const pixels = new Uint8Array([255, 0, 0, 255]);
          for (let i = 0; i < targets.size; i++) {
            gl.texImage2D(
                targets[i],
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
          if (this.textureSources) {
            let textureImages = [];
            for (let i = 0; i < targets.size; i++) {
              textureImages[i] = new Image();
              textureImages[i].crossOrigin = "anonymous";
              textureImages[i].src = this.textureSources[i];
              textureImages[i].loaded = false;
              textureImages[i].onload = function() {
                textureImages[i].loaded = true;
                let allLoaded = true;
                for (let j = 0; j < targets.size; j++) {
                  if (!textureImages[i].loaded) {
                    allLoaded = false;
                  }
                }
                if (allLoaded) {
                  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                  for (let j = 0; j < targets.size; j++) {
                    gl.texImage2D(
                        targets[j],
                        level,
                        internalFormat,
                        format,
                        type,
                        textureImages[j],
                    );
                    gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                    gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT); 
                  }
                  gl.generateMipmap(gl.TEXTURE_CUBE_MAP, texture);
                }
              }
            }
          }
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

      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.uniform1i(texSamplerLoc, 0);
      gl.uniform1f(this.ambientCoeffLoc, this.ambientCoeff);
      gl.uniform1f(this.diffuseCoeffLoc, this.diffuseCoeff);
      gl.uniform1f(this.specularCoeffLoc, this.specularCoeff);
      gl.uniform1f(this.ambientExpLoc, this.ambientExp);
      
      gl.enableVertexAttribArray(vertexLoc);
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