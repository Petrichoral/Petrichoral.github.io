"use strict";

const GrObject = function(name, transform, update) {

  const initShaderProgram = function(gl, vertexSource, fragmentSource) {
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
    
    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialize shaders");
    }
    return shaderProgram;
  };

  const initUniformLoc = function(gl, shaderProgram, identifier) {
    return gl.getUniformLocation(
        shaderProgram,
        identifier,
    );
  };

  const initAttributeLoc = function(gl, shaderProgram, identifier) {
    return gl.getAttribLocation(
        shaderProgram,
        identifier,
    );
  };

  const initBuffer = function(gl, array, type) {
    newBuffer = gl.createBuffer();
    gl.bindBuffer(type, newBuffer);
    gl.bufferData(
        type,
        new Float32Array(array),
        gl.STATIC_DRAW,
    );
    return newBuffer;
  };

  const initTexture = function(gl, level, textureSource) {
    textureLoc = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureLoc);
    {
      const target = gl.TEXTURE_2D;
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
    let textureImage = new Image();
    textureImage.src = imageSource;
    textureImage.onload = function() {
      textureLoc = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, textureLoc);
      {
        const target = gl.TEXTURE_2D;
        const internalFormat = gl.RGBA;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        gl.texImage2D(
          target,
          level,
          internalFormat,
          format,
          type,
          textureImage,
        );
      }
    }
  };

  const createPointer = function(size, buffer, loc) {
    const type = gl.FLOAT;
    const normalized = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(
        loc,
        size,
        type,
        normalized,
        stride,
        offset,
    );
  };

  const createModelViewMatrix = function(drawingState, deltaTime) {
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

    return twgl.m4.multiply(modelViewMatrix, drawingState.view);
  };

  return {
    name: name,
    vertexSource: undefined,
    fragmentSource: undefined,
    uniforms: undefined,
    attributes: undefined,
    shaderProgram: undefined,
    textureSources: undefined,
    vertexCount: undefined,
    attributeArrays: undefined,
    indices: undefined,
    uniformLocs: [],
    attributeLocs: [],
    attributeBuffers: [],
    textures: [],
    indexBuffer: null,
    deltaTime: null,

  	init(drawingState) {
  		past = drawingState.realtime;
  		let gl = drawingState.gl;

  		this.shaderProgram = initShaderProgram(
  				gl, 
  				this.vertexSource, 
  				this.fragmentSource,
  		);

      for (let i = 0; i < this.uniforms.size; i++) {
        this.uniformLocs[i] = initUniformLoc(
            gl,
            this.shaderProgram,
            this.attributes[i],
        );
      }

      for (let i = 0; i < this.attributes.size; i++) {
        this.attributeLocs[i] = initAttributeLoc(
            gl,
            this.shaderProgram,
            this.attributes[i],
        );
        this.attributeBuffers[i] = initBuffer(
            gl,
            this.attributeArrays[i],
            gl.ARRAY_BUFFER,
        );
      }

      for (let i = 0; i < this.textureSources.size; i++) {
        this.texture[i] = initTexture(
            gl,
            i,
            this.textureSources[i],
        );
      }

      indexBuffer = gl.initBuffer(gl, this.indices, gl.ELEMENT_ARRAY_BUFFER);
  	},

  	draw(drawingState) {
      let deltaTime = getDeltaTime(drawingState);
      let gl = drawingState.gl;



      {
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, this.vertexCount, type, offset);
      }
  	},

  	center(){
      return (!transform.translate) ? [0, 0, 0] : transform.translate;
  	},
  };
}

