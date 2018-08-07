var app = {};

app.MSEC_IN_SEC = 1000;
app.FRAME_RATE = 1000.0 / 120.0;

app.NUM_BLADES = 640;
app.MAX_SEGMENTS = 7;
app.MAX_LENGTH = 100;

app.SLIDER_WEIGHT = 10000;
app.SLIDER1_MAX = 1000;
app.SLIDER1_MIN = -1000;

app.CANVAS_WIDTH = 640;
app.CANVAS_HEIGHT = 480;

app.SKY_IMAGEFP = "./img/sky.png";

app.CLOUD_SPRITEFP = "./img/cloud.png";
app.CLOUD_SPRITE_SIZE = 128;
app.NUM_CLOUDS = 20;

app.MOON_SPRITEFP = "./img/moon.png";
app.MOON_SPRITE_SIZE = 128;

app.loop = function() {
  app.update();
  app.draw();
}

app.update = function() {
  // Update deltatime
  var present = Date.now();
  app.deltaTime = present - app.past;
  app.past = present;
  
  // Update Slider
  app.input.slider1 = app.slider1.value;

  // Update "wind"
  app.windInt = Math.lerp(app.windInt, app.input.slider1 / (Math.PI * app.SLIDER_WEIGHT), app.deltaTime / app.MSEC_IN_SEC);

  //Update cloud
  for (var i = 0; i < app.NUM_CLOUDS; i++) {
    app.clouds[i].update();
  }

}

app.draw = function() {
  // Draw sky
  app.sky.draw();

  // Draw Moon
  app.moon.draw();

  // Draw Clouds

  for (var i = 0; i < app.NUM_CLOUDS; i++) {
    app.clouds[i].draw();
  }

  //Draw ground
  app.ground.draw();
}

app.init = function() {
  //Initialize canvas
  app.canvas = document.getElementById("2dcanvas");
  app.canvas.setAttribute("width", app.CANVAS_WIDTH);
  app.canvas.setAttribute("height", app.CANVAS_HEIGHT);
  app.ctx = app.canvas.getContext("2d");
  app.ctx.lineWidth = 1;
  
  //Initialize sliders
  app.slider1 = document.getElementById("slider1");
  app.slider1.max = app.SLIDER1_MAX;
  app.slider1.min = app.SLIDER1_MIN;
  app.input = {};
  
  //Initialize time
  app.past = Date.now();

  //Initialize "wind"
  app.windInt = 0;

  //Initialize drawables
  app.moon = app.Moon();
  app.clouds = [];
  for (var i = 0; i < app.NUM_CLOUDS; i++) {
    app.clouds[i] = app.Cloud();
  }
  app.sky = app.Sky();
  app.ground = app.Ground();
}

app.onload = function() {
  console.log("Loaded!");
  app.init();
  setInterval(app.loop, app.FRAME_RATE);
}

app.Sky = function() {
  var image = document.createElement("img");
  image.setAttribute("src", app.SKY_IMAGEFP);
  var that = {
    draw : function() {
      app.ctx.drawImage(image, 0, 0);
    }
  }
  return that;
}

/**/
app.Moon = function() {
  var image = document.createElement("img");
  image.setAttribute("src", app.MOON_SPRITEFP);
  var that = {
    draw : function() {
      app.ctx.drawImage(image, app.CANVAS_WIDTH - app.MOON_SPRITE_SIZE, 0);
    }
  }
  return that;
}
/**/

app.Cloud = function() {
  var y = Math.abs(Math.random() * app.CANVAS_HEIGHT / 4);
  var dx = Math.abs(Math.random() * app.CANVAS_WIDTH);
  var image = document.createElement("img");
  image.setAttribute("src", app.CLOUD_SPRITEFP);
  var that = {
    draw : function() {
      app.ctx.drawImage(image, dx, y);
    },

    update : function() {
      dx = Math.lerp(dx, dx + app.windInt, app.deltaTime);
      if (dx > app.CANVAS_WIDTH) {
        y = Math.abs(Math.random() * app.CANVAS_HEIGHT / 4);
        dx = 0 - app.CLOUD_SPRITE_SIZE;
      }
      if (dx < 0 - app.CLOUD_SPRITE_SIZE) {
        y = Math.abs(Math.random() * app.CANVAS_HEIGHT / 4);
        dx = app.CANVAS_WIDTH;
      }
    }
  }
  return that;
}

app.Ground = function() {
  var Blade = function (x, y, l, n) {
    var that = {
      draw : function(windInt) {
        app.ctx.save();
        app.ctx.translate(x, y);
        var dx = 0;
        var dy = 0;
        for (var i = 0; i < n; i++) {
          dx += Math.sin(i * windInt * l * Math.PI / (2 * n^2) + Math.random() * n * windInt);   // Function taken from paper in html
          dy -= Math.cos(i * windInt * l * Math.PI / (2 * n^2) + Math.random() * n * windInt);   // Function taken from paper in html
          app.ctx.beginPath();
          app.ctx.moveTo(0,0);
          app.ctx.lineTo(dx, dy);
          app.ctx.closePath();
          app.ctx.stroke();
          app.ctx.save();
          app.ctx.translate(dx, dy);
        }
        for (var i = 0; i < n; i++) {
          app.ctx.restore();
        }
        app.ctx.restore();
      }
    };
    return that
  }

  var blades = [];
  for (var i = 0; i < app.NUM_BLADES; i++) {
    var r = Math.random()
    blades[i] = Blade(app.CANVAS_WIDTH / app.NUM_BLADES * i, 0, Math.floor(r * app.MAX_LENGTH), Math.floor(r * app.MAX_SEGMENTS));
  }

  var that = {
    draw : function() {
      app.ctx.strokeStyle = "#006622";
      app.ctx.fillStyle = "#006622";
      app.ctx.save();
      app.ctx.translate(0, app.CANVAS_HEIGHT - 30);
      app.ctx.beginPath();
      app.ctx.fillRect(0, 0, app.CANVAS_WIDTH, 30);
      for (var i = 0; i < app.NUM_BLADES; i++) {
        blades[i].draw(app.windInt);
      }
      app.ctx.restore();
    }
  }
  return that;
}

Math.lerp = function(v0, v1, t) {
  return (1 - t) * v0 + t * v1;
}
/**/