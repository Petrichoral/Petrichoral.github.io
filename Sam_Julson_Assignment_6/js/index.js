"use strict";

window.app = {
  // HTML DOM objects
  canvas: document.getElementById("glcanvas"),
  vertexSource: document.getElementById("vshdr").text,
  fragmentSource: document.getElementById("fshdr").text,
  
  // Camera Movement values
  lastMouseX: null,
  lastMouseY: null,
  camera_angle_x_z: Math.PI / 2,
  camera_angle_y: Math.PI / 2,
  camera_zoom: 3,
  
  // Cube primitive
  cube: {
    verts: [
      // Front face
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,
      
      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,
      
      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,
      
      // Bottom face
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,
      
      // Right face
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,
      
      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0,
    ],
    normals: [
      // Front
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,

      // Back
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,

      // Top
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,

      // Bottom
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,

      // Right
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,

      // Left
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
    ],
    colors: [
      // Front, White
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      // Back, Red
      1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.0, 1.0,
      // Top, Green
      0.0, 1.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      // Bottom, Blue
      0.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      // Right, Yellow
      1.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 0.0, 1.0,
      // Left, Purple
      1.0, 0.0, 1.0, 1.0,
      1.0, 0.0, 1.0, 1.0,
      1.0, 0.0, 1.0, 1.0,
      1.0, 0.0, 1.0, 1.0,
    ],
    indices: [
       0,  1,  2,
       0,  2,  3,
       4,  5,  6,
       4,  6,  7,
       8,  9, 10,
       8, 10, 11,
      12, 13, 14,
      12, 14, 15,
      16, 17, 18,
      16, 18, 19,
      20, 21, 22,
      20, 22, 23,
    ],                   
  },
  
  main() {
    const gl = app.initGL();
    let past = undefined;
    let render = undefined;
    
    if (gl === null) {
      return;
    }
    
    const shaderProgram = app.initShaderProgram(
        gl, 
        app.vertexSource, 
        app.fragmentSource,
    );
    
    if (shaderProgram === null) {
      return;
    }
    
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        position: gl.getAttribLocation(shaderProgram, "position"),
        normal: gl.getAttribLocation(shaderProgram, "normal"),
        color: gl.getAttribLocation(shaderProgram, "color"),
      },
      uniformLocations: {
        normalMatrix: gl.getUniformLocation(
            shaderProgram, 
            "normalMatrix"
        ),
        modelViewMatrix: gl.getUniformLocation(
            shaderProgram,
            "modelViewMatrix"
        ),
        projectionMatrix: gl.getUniformLocation(
            shaderProgram, 
            "projectionMatrix"
        ),
      },
    }
    
    const buffers = app.initBuffers(gl);
    
    past = 0;
    render = function(present) {
      let deltaTime = undefined;

      present /= 1000.0;
      deltaTime = present - past;
      past = present;
      
      app.draw(gl, programInfo, buffers, deltaTime);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  },
  
  initGL(canvas) {
    const gl = app.canvas.getContext("webgl");
    
    if (!gl) {
      alert("Error: WebGL was not initialized.");
      return null;
    }
    return gl;
  },
  
  initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = app.createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = app.createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert(
        "Unable to initialize shader program: " + 
        gl.getShaderInfoLog(shaderProgram)
      );
      return null;
    }
    return shaderProgram;
  },
  
  createShader(gl, type, source) {
    const newShader = gl.createShader(type);
    gl.shaderSource(newShader, source);
    gl.compileShader(newShader);
    
    if (!gl.getShaderParameter(newShader, gl.COMPILE_STATUS)) {
        alert(
          "An error occured compiling a shader: " +
          gl.getShaderInfoLog(newShader)
        );
        return null;
    }
    return newShader;
  },
  
  initBuffers(gl) {
    const positionBuffer = gl.createBuffer();
    const normalBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, 
        new Float32Array(app.cube.verts),
        gl.STATIC_DRAW
    );
    
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, 
        new Float32Array(app.cube.normals),
        gl.STATIC_DRAW
    );
    
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, 
        new Float32Array(app.cube.colors),
        gl.STATIC_DRAW
    );
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER, 
        new Uint16Array(app.cube.indices),
        gl.STATIC_DRAW
    );
    
    return {
      position: positionBuffer,
      normal: normalBuffer,
      color: colorBuffer,
      index: indexBuffer
    };
  },
  
  draw(gl, programInfo, buffers, deltaTime) {
    // Clear variables
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
          programInfo.attribLocations.position,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.position);
    }
    
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = true;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
      gl.vertexAttribPointer(
          programInfo.attribLocations.normal,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.normal);
    }
    
    {
      const numComponents = 4;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
      gl.vertexAttribPointer(
          programInfo.attribLocations.color,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.color);
    }
    
    {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);
    }
    

    // Tell WebGL to use our program when drawing

    gl.useProgram(programInfo.program);

    // Setup transforms
    const t_model = twgl.m4.identity();
    
    const eye = [
      app.camera_zoom * Math.cos(app.camera_angle_x_z) * Math.sin(app.camera_angle_y), 
      app.camera_zoom * Math.cos(app.camera_angle_y),
      app.camera_zoom * Math.sin(app.camera_angle_x_z) * Math.sin(app.camera_angle_y),
    ];
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const t_camera = twgl.m4.inverse(twgl.m4.lookAt(eye, target, up));
    const t_normal = twgl.m4.transpose(twgl.m4.inverse(t_camera));
    
    const fieldOfView = Math.PI / 180 * 120;
    const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    
    const t_projection = twgl.m4.perspective(
        fieldOfView, 
        aspectRatio,
        zNear,
        zFar,
    );
    
    // Set the shader uniforms
    
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        t_normal,
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        t_projection,
    );
        
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        t_camera,
    );
    

    {
      const offset = 0;
      const type = gl.UNSIGNED_SHORT;
      const vertexCount = 36;
      gl.drawElements(
        gl.TRIANGLES,
        vertexCount,
        type,
        offset,
      );
    }
  },
  
  onMouseDown(e) {
    app.mouse_movement = true;
    app.lastMouseX = e.clientX;
    app.lastMouseY = e.clientY;
  },
  
  onMouseUp(e) {
    app.mouse_movement = false;
  },
  
  onMouseMove(e) {
    if (app.mouse_movement) {
      let mouseX = e.clientX;
      let mouseY = e.clientY;
      app.camera_angle_x_z += (mouseX - app.lastMouseX) / 128.0;
      if (app.camera_angle_x_z > Math.PI * 2) {
        app.camera_angle_x_z -= Math.PI * 2;
      } else if (app.camera_angle_x_z < Math.PI * 2) {
        app.camera_angle_x_z += Math.PI * 2;
      }
      app.camera_angle_y -= (mouseY - app.lastMouseY) / 128.0;
      if (app.camera_angle_y >= Math.PI) {
        app.camera_angle_y = Math.PI;
      } else if (app.camera_angle_y < 0) {
        app.camera_angle_y = 0
      }
      app.lastMouseX = mouseX;
      app.lastMouseY = mouseY;
    }
  },
}

if (
    !window.app ||
    !window.app.canvas
) {
  alert("Error: Canvas element does not exist.");
} else {
  app.canvas.addEventListener("mousedown", app.onMouseDown);
  document.addEventListener("mouseup", app.onMouseUp);
  document.addEventListener("mousemove", app.onMouseMove);
  app.main();
}