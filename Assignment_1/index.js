var app = {};
app.FRAME_RATE = 1000.0 / 60.0;

app.loop = function() {
  app.update();
  app.draw();
}

app.update = function() {
  // Update deltatime
  var present = Date.now();
  app.deltaTime = present - app.past;
  app.past = present;
  
  app.arcAngle += Math.PI / 4 * app.deltaTime / 1000;
  
  // Value fix arcAngle
  if (app.arcAngle > 2 * Math.PI) {
    app.arcAngle -= 2 * Math.PI;
  }
}

app.draw = function() {
  app.ctx.clearRect(0, 0, app.canvas.width, app.canvas.height);
  app.ctx.strokeText("Hello Canvas!", 0, app.canvas.height / 5);
  
  app.ctx.strokeStyle = "black";
  app.ctx.beginPath();
  app.ctx.arc(app.canvas.width / 2, app.canvas.height / 2, Math.abs(Math.sin(app.arcAngle / 4)) * 100,
      0, app.arcAngle);
  app.ctx.stroke();
  app.ctx.closePath();
  
  app.ctx.strokeStyle = "black";
  app.ctx.beginPath();
  app.ctx.arc(app.canvas.width / 2, app.canvas.height / 2, Math.abs(Math.cos(app.arcAngle / 4)) * 100,
      0, app.arcAngle, true);
  app.ctx.stroke();
  app.ctx.closePath();
  
  app.ctx.strokeStyle = "black";
  app.ctx.beginPath();
  app.ctx.arc(app.canvas.width / 2, app.canvas.height / 2, Math.abs(Math.sin(app.arcAngle / 4)) * 66,
      -Math.PI / 2, app.arcAngle - ( 3 * Math.PI / 2), true);
  app.ctx.stroke();
  app.ctx.closePath();
  
  app.ctx.strokeStyle = "black";
  app.ctx.beginPath();
  app.ctx.arc(app.canvas.width / 2, app.canvas.height / 2, Math.abs(Math.cos(app.arcAngle / 4)) * 66,
      Math.PI / 2, app.arcAngle - (3 * Math.PI / 2), true);
  app.ctx.stroke();
  app.ctx.closePath();
}

app.init = function() {
  app.canvas = document.getElementById("2dcanvas");
  app.ctx = app.canvas.getContext("2d");
  app.ctx.font = "Courier New";
  app.past = Date.now();
  app.arcAngle = 0.0;
  console.log("Initialized!");
}

app.onload = function() {
  console.log("Loaded!");
  app.init();
  setInterval(app.loop, app.FRAME_RATE);
}