const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photos = document.getElementById('photos');
const filterSelect = document.getElementById('filterSelect');
const startBtn = document.getElementById('startBtn');
const countdownDisplay = document.getElementById('countdown');
const downloadBtn = document.getElementById('downloadBtn');
const shutterSound = document.getElementById('shutterSound');
const frameSelect = document.getElementById('frameSelect');
const switchBtn = document.getElementById("switchCameraBtn");

let currentFacingMode = "user"; // default kamera depan
let stream = null;

async function startCamera(facingMode = "user") {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: facingMode } },
      audio: false
    });
    const video = document.getElementById("video");
    video.srcObject = stream;
    await video.play();
  } catch (err) {
    alert("Tidak dapat mengakses kamera: " + err);
  }
}

// Inisialisasi kamera saat halaman dimuat
window.addEventListener("DOMContentLoaded", () => {
  startCamera(currentFacingMode);

  if (switchBtn) {
    switchBtn.addEventListener("click", () => {
      currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
      startCamera(currentFacingMode);
    });
  }
});

frameSelect.addEventListener('change', () => {
  if (frameSelect.value && frameSelect.value !== "none") {
    currentFrame.src = frameSelect.value;
  } else {
    currentFrame.src = ""; // kosongkan src jika tanpa frame
  }
});
let currentFrame = new Image();
currentFrame.src = 'Polaroid.png'; //default frame

const ctx = canvas.getContext('2d');
let currentFilter = 'none';
let capturedImages = [];

video.addEventListener('loadedmetadata', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Mulai menggambar video, filter, dan frame secara real-time
  renderLoop();
});

function renderLoop() {
  function draw() {
    // Bersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Terapkan filter ke video
    ctx.filter = getCSSFilter(currentFilter);
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1); // Membalik video secara horizontal
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.filter = 'none'; // Reset filter untuk gambar frame

    // Gambar frame di atas video hanya jika frame valid
    if (currentFrame.src && frameSelect.value && frameSelect.value !== "none") {
      if (currentFrame.complete) {
        ctx.drawImage(currentFrame, 0, 0, canvas.width, canvas.height);
      }
    }

    // Panggil kembali fungsi ini untuk frame berikutnya
    requestAnimationFrame(draw);
  }
  draw();
}

function getCSSFilter(name) {
  const filters = {
    softpink: 'brightness(1.1) contrast(0.9) sepia(0.2) saturate(1.5)',
    vintage: 'sepia(0.6) contrast(0.8) brightness(1.1)',
    dramatic: 'contrast(1.5) brightness(0.9)',
    dramaticwarm: 'contrast(1.4) sepia(0.4) brightness(1)',
    warm: 'sepia(0.2) saturate(1.3)',
    mono: 'grayscale(1)',
    silvertone: 'grayscale(0.8) contrast(1.2)',
    noir: 'grayscale(1) contrast(1.4)',
    bwaesthetic: 'grayscale(1) brightness(1.2)'
  };
  return filters[name] || 'none';
}

filterSelect.addEventListener('change', () => {
  currentFilter = filterSelect.value;
});


function takePhotoWithConfirmation() {
  shutterSound.play();
  ctx.filter = getCSSFilter(currentFilter);
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.filter = 'none';
  if (currentFrame.complete && frameSelect.value && frameSelect.value !== "none") {
    ctx.drawImage(currentFrame, 0, 0, canvas.width, canvas.height);
  }
  
  const dataURL = canvas.toDataURL('image/png');

  const previewContainer = document.createElement('div');
  previewContainer.style.position = 'relative';
  previewContainer.style.display = 'inline-block';
  previewContainer.style.margin = '10px';

  const img = document.createElement('img');
  img.src = dataURL;
  img.style.width = '150px';
  img.style.border = 'none';
  img.style.borderRadius = '2px';

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = '✅ Simpan';
  confirmBtn.style.position = 'absolute';
  confirmBtn.style.bottom = '0';
  confirmBtn.style.left = '0';
  confirmBtn.style.fontSize = '0.8em';
  confirmBtn.style.background = '#baffc9';

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌ Hapus';
  deleteBtn.style.position = 'absolute';
  deleteBtn.style.bottom = '0';
  deleteBtn.style.right = '0';
  deleteBtn.style.fontSize = '0.8em';
  deleteBtn.style.background = '#ffb3b3';

  confirmBtn.onclick = () => {
    photos.insertBefore(img, photos.firstChild);
    capturedImages.push(dataURL);
    previewContainer.remove();
  };

  deleteBtn.onclick = () => {
    previewContainer.remove();
  };

  previewContainer.appendChild(img);
  previewContainer.appendChild(confirmBtn);
  previewContainer.appendChild(deleteBtn);
  photos.insertBefore(previewContainer, photos.firstChild);
}

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  let countdown = 3;
  countdownDisplay.style.display = 'block';

  function count() {
    if (countdown === 0) {
      countdownDisplay.style.display = 'none';
      takePhotoWithConfirmation();
      startBtn.disabled = false;
      startBtn.textContent = '📸 Mulai';
    } else {
      countdownDisplay.textContent = countdown;
      countdown--;
      setTimeout(count, 1000);
    }
  }

  count();
});

downloadBtn.addEventListener('click', () => {
  if (capturedImages.length === 0) return;

  const downloadCanvas = document.createElement('canvas');
  downloadCanvas.width = canvas.width;
  downloadCanvas.height = canvas.height * capturedImages.length;
  const dctx = downloadCanvas.getContext('2d');

  const frameImg = new Image();
  frameImg.src = currentFrame.src;

  frameImg.onload = () => {
    let loaded = 0;

    capturedImages.forEach((imgSrc, index) => {
      const img = new Image();
      img.onload = () => {
        dctx.drawImage(img, 0, canvas.height * index, canvas.width, canvas.height);
      

        loaded++;
        if (loaded === capturedImages.length) {
          const link = document.createElement('a');
          link.download = 'photobooth.png';
          link.href = downloadCanvas.toDataURL('image/png');
          link.click();

          capturedImages = [];
          photos.innerHTML = '';
        }
      };
      img.src = imgSrc;
    });
  };
});


renderLoop();
