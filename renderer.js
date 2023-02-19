var el = document.getElementById("scan-button");
var message = document.getElementById("message");
var cameras_info = document.getElementById("cameras_info");

const Stream = require('node-rtsp-stream-jsmpeg');

var cameras = [];
var urls = [];
var container = document.getElementById("button-container");

var stream = null;
global.stream = null;

function startStream(options) {
  if (global.stream == null) {
    global.stream = new Stream(options);
    global.stream.start();
  } else {
    global.stream.stop();
    global.stream = new Stream(options);
    global.stream.start();
  };
};

container.addEventListener('click', function(e) {
  var button = e.target;
    if (button.className == 'camera_buttons') {
      console.log(`Начало трансляции с камеры ${button.id}`);
      var options = {
        name: `Стрим с камеры ${button.id}`,
        url: urls[button.id - 1],
        wsPort: 3333,
      }
      startStream(options);
      button.addEventListener('click', createNewVideoWindow());
  }
});

var buttonLabels = [];

el.addEventListener('click', () => {
  var res = scanCameras();
  res.then(data => {
    console.log(data);
    message.textContent = data.message;
    if (data.success) {
      cameras = data.cameras;
      cameras_info.textContent = 'Press the button to watch the stream'

      for (var i = 0; i < cameras.length; i++) {
        buttonLabels.push("Camera №" + (i+1))
      };

      for (var i = 0; i < buttonLabels.length; i++) {
        var button = document.createElement("button");
        button.innerHTML = buttonLabels[i];
        button.id = i + 1;
        button.className = "camera_buttons";
        container.appendChild(button);
      };

      cameras.map(item => {
        urls.push(item.url);
      });
      console.log(urls);
    };
  });
});
