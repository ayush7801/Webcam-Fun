const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.error("OH NOO!!!", err);
    });
}

function paintToCanvas() {
  const [width, height] = [video.videoWidth, video.videoHeight];
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    //take the pixels outdebugger

    let pixels = ctx.getImageData(0, 0, width, height);
    //mess with them
    pixels = rgbSplit(pixels);
    //ctx.globalAlpha = 0.1;
    //pixels = greenScreen(pixels);
    //put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function greenScreen(pixels) {
  const level = {};
  document
    .querySelectorAll(".rgb input")
    .forEach((input) => (level[input.name] = input.value));
  console.log(level);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const red = pixels.data[i + 0];
    const green = pixels.data[i + 1];
    const blue = pixels.data[i + 2];
    const alpha = pixels.data[i + 3];

    if (
      red >= level.rmin &&
      red <= level.rmax &&
      green >= level.gmin &&
      green <= level.gmax &&
      blue >= level.bmin &&
      blue >= level.bmax
    ) {
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i] + 100; //red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //Blue
    //pixels.data[i + 3];//alpha
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; //red
    pixels.data[i + 500] = pixels.data[i + 1]; //green
    pixels.data[i - 550] = pixels.data[i + 2]; //Blue
    //pixels.data[i + 3];//alpha
  }
  return pixels;
}

function takePhoto() {
  //played the sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "handsome");
  link.innerHTML = `<img src = ${data} alt = 'handsome man'></img>`;
  strip.appendChild(link);

  //strip.insertBefore(link, strip.firstChild);
}

getVideo();

video.addEventListener("canplay", paintToCanvas);
