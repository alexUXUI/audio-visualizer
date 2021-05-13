window.onload = function () {
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");

  file.onchange = function () {
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);

    var analyser = context.createAnalyser();
    var analyser1 = context.createAnalyser();

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 2048;

    var bufferLength = analyser.frequencyBinCount;

    var dataArray = new Uint8Array(bufferLength);
    var dataArray2 = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;
    var y = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);
      renderFrame2();
      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        var r = barHeight + 25 * (i / bufferLength);
        var g = 250 * (i / bufferLength);
        var b = 50;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth;
      }
    }

    function renderFrame2() {
      requestAnimationFrame(renderFrame2);

      y = 0;

      analyser.getByteTimeDomainData(dataArray2);

      for (var j = 0; j < bufferLength; j++) {
        barHeight = dataArray2[j];

        var r = barHeight + 25 * (j / bufferLength);
        var g = 50;
        var b = 250 * (j / bufferLength);

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(y, barHeight * 2.25, barWidth, barHeight);

        y += barWidth;
      }
    }

    function clear() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    audio.play();
    renderFrame();
  };
};

// AnalyserNode.getFloatFrequencyData()
// Copies the current frequency data into a Float32Array array passed into it.
// AnalyserNode.getByteFrequencyData()
// Copies the current frequency data into a Uint8Array (unsigned byte array) passed into it.
// AnalyserNode.getFloatTimeDomainData()
// Copies the current waveform, or time-domain, data into a Float32Array array passed into it.
// AnalyserNode.getByteTimeDomainData()
