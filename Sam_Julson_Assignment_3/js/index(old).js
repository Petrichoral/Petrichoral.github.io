/* Global app */
var app = {};

/* Global m4 */
var m4 = twgl.m4;

/* Global v3 */
var v3 = twgl.v3;

app.prim = {};

app.prim.Axes = function() {
  var vertex = [0, 0, 0];

  var segments = [[ 1,  0,  0],
                  [ 0,  1,  0],
                  [ 0,  0,  1]];

  var that = {
    draw : function() {
      for (var s in segments) {
        app.moveToTx(vertex, app.Tstack[0]);
        app.lineToTx(s, app.Tstack[0]);
      }
    }
  };
  return that;
};

app.prim.Camera = function(eye, target, up) {
  eye = eye || [100, 0, 0];
  target = target || [0, 0, 0];
  up = up || [0, 1, 0];

  var that = {
    setEye : function(v) {
      eye = v;
    },

    getEye : function() {
      return eye;
    },

    setTarget : function(v) {
      target = v;
    },

    getTarget : function() {
      return target;
    },

    setUp : function(v) {
      up = v;
    },

    getUp : function() {
      return up;
    },

    lookAtTx : function() {
      return m4.inverse(m4.lookAt(eye, target, up));
    }
  };
  return that;
};

app.MSEC_IN_SEC = 1000;
app.FRAME_RATE = 1000.0 / 120.0;
app.CANVAS_WIDTH = 640;
app.CANVAS_HEIGHT = 480;

app.Tstack = (function() {
  var stack = [];

  var that = {
    push : function(mat4) {
      stack.push(mat4);
    },

    pop : function() {
      return stack.pop();
    }
  };
  return that;
})();


app.loop = (function() {
  app.canvas = document.getElementById("2dcanvas");
  app.ctx = app.canvas.getContext("2d");

  var axes1 = app.prim.Axes();
  var camera1 = app.prim.Camera([100,  0,  0],
                                [  0,  0,  0],
                                [  0,  1,  0]);

  var angle1;

  var update = (function() {
    var past = Date.now();
    return (function() {
      // Get deltaTime
      var present = Date.now();
      var deltaTime = present - past;
      past = present;


    });
  })();

  var draw = (function() {
    return (function() {
      app.Tstack.push(camera1.lookAtTx);
      axes1.draw();
    }); 
  })();

  return (function() {
    update();
    draw();
  });
})();

app.moveToTx = function(v, Tx) {
  m4.transformPoint(Tx, v, v);
  app.ctx.moveTo(v[0], -v[1]);
}

app.lineToTx = function(v, Tx) {
  m4.transformPoint(Tx, v, v);
  app.ctx.moveTo(v[0], -v[1]);
}

app.onload = function() {
  setInterval(app.loop, app.FRAME_RATE)
}