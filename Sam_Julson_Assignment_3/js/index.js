"use strict";

Math.lerp = function(x1, x2, t) {
  return (1-t)*x1 + x2*t;
}

var app = {};
app.canvas = document.getElementById("2dcanvas");
app.ctx = app.canvas.getContext("2d");
app.slider1 = document.getElementById("slider1");
app.slider2 = document.getElementById("slider2");
app.slider3 = document.getElementById("slider3");
app.checkbox1 = document.getElementById("checkbox1");
app.can_move = false;

app.onload = function() {
  setInterval(app.loop, 1000 / 60);
}


app.onmouse

app.loop = (function() {

  var ctx = app.canvas.getContext("2d");
  var tstack = [twgl.m4.identity()];
  var angle1;
  var angle2;
  var radius;
  var isPerspective;

  //TODO: Make sure that points not in view do not get drawn

  var moveToTx = function(ctx, Tx, v) {
    twgl.m4.transformPoint(Tx, v, v);
    ctx.moveTo(v[0] + app.canvas.width / 2, -v[1] + app.canvas.height / 2);
  }

  var lineToTx = function(ctx, Tx, v) {
    twgl.m4.transformPoint(Tx, v, v);
    ctx.lineTo(v[0] + app.canvas.width / 2, -v[1] + app.canvas.height / 2);
  }

  var update = (function() {

    var past = Date.now();
    angle1 = app.slider1.value*0.01*2*Math.PI;
    angle2 = app.slider2.value*0.01*Math.PI;
    radius = app.slider3.value*0.01;

    return (function() {
      var present = Date.now();
      var deltaTime = present - past;
      past = present;

      angle1 = app.slider1.value*0.01*2*Math.PI;
      angle2 = app.slider2.value*0.01*Math.PI;
      radius = app.slider3.value*0.01;
      isPerspective = app.checkbox1.checked;
    });
  })();

  var draw = function() {
    //Hack to clear screen faster
    app.canvas.width = app.canvas.width;

    //TODO: Convert to quaternion rotation.
    /* World to Camera */
    var eye = [1000 * radius * Math.cos(angle1) * Math.sin(angle2),
               1000 * radius * Math.cos(angle2),
               1000 * radius * Math.sin(angle1) * Math.sin(angle2)];

    //eye = [1, 1, 1];
    tstack.unshift(twgl.m4.multiply(tstack[0],
        twgl.m4.inverse(twgl.m4.lookAt(eye, [0, 0, 0], [0, 1, 0]))));
    /**/

    /* Scaling */
    tstack.unshift(twgl.m4.scale(tstack[0], [100, 100, 100]));
    /**/

    /* Perspective or Orthogonal */
    if (isPerspective) {
      tstack.unshift(twgl.m4.multiply(tstack[0], twgl.m4.scale(twgl.m4.perspective(Math.PI / 360, 1, 1, 1), [-1, -1, -1])));
    } else {
      tstack.unshift(twgl.m4.multiply(tstack[0], twgl.m4.ortho(-1, 1, -1, 1, -1, 1)));
    }
    /**/

    //Draw axis
    app.ctx.strokeStyle = "#FF0000";
    app.ctx.beginPath();
    moveToTx(app.ctx, tstack[0], [0, 0, 0]);
    lineToTx(app.ctx, tstack[0], [1, 0, 0]);
    app.ctx.stroke();
    app.ctx.closePath();

    app.ctx.strokeStyle = "#00FF00";
    app.ctx.beginPath();
    moveToTx(app.ctx, tstack[0], [0, 0, 0]);
    lineToTx(app.ctx, tstack[0], [0, 1, 0]);
    app.ctx.stroke();
    app.ctx.closePath();

    app.ctx.strokeStyle = "#0000FF";
    app.ctx.beginPath();
    moveToTx(app.ctx, tstack[0], [0, 0, 0]);
    lineToTx(app.ctx, tstack[0], [0, 0, 1]);
    app.ctx.stroke();
    app.ctx.closePath();

    app.ctx.strokeStyle = "black";

    /* Axis to cube */
    tstack.unshift(twgl.m4.translate(tstack[0], [1, 1, 1]));
    /**/

    //Draw cube
    app.ctx.beginPath();
    moveToTx(app.ctx, tstack[0], [0, 0, 0]);

    lineToTx(app.ctx, tstack[0], [1, 0, 0]);
    lineToTx(app.ctx, tstack[0], [1, 1, 0]);
    lineToTx(app.ctx, tstack[0], [0, 1, 0]);
    lineToTx(app.ctx, tstack[0], [0, 0, 0]);

    lineToTx(app.ctx, tstack[0], [0, 0, 1]);

    lineToTx(app.ctx, tstack[0], [0, 1, 1]);
    lineToTx(app.ctx, tstack[0], [0, 1, 0]);
    moveToTx(app.ctx, tstack[0], [0, 1, 1]);

    lineToTx(app.ctx, tstack[0], [1, 1, 1]);
    lineToTx(app.ctx, tstack[0], [1, 1, 0]);
    moveToTx(app.ctx, tstack[0], [1, 1, 1]);

    lineToTx(app.ctx, tstack[0], [1, 0, 1]);
    lineToTx(app.ctx, tstack[0], [1, 0, 0]);
    moveToTx(app.ctx, tstack[0], [1, 0, 1]);

    lineToTx(app.ctx, tstack[0], [0, 0, 1]);

    app.ctx.stroke();
    app.ctx.closePath();

    tstack.shift();
    tstack.shift();
    tstack.shift();
    tstack.shift();
  }

  return (function() {
    update();
    draw();
  });
})();