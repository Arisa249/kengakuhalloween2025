const video = document.getElementById('camera');
const frame = document.getElementById('frame');
const captureBtn = document.getElementById('capture');
const switchFrameBtn = document.getElementById('switch-frame');
const previewContainer = document.getElementById('preview-container');
const preview = document.getElementById('preview');
const retakeBtn = document.getElementById('retake');
const cameraContainer = document.getElementById('camera-container');

let currentFrame = 1;
let stream;

// カメラ起動（背面固定）
function startCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' },
    audio: false
  })
  .then(s => {
    stream = s;
    video.srcObject = stream;
    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.play();
        resolve();
      };
    });
  })
  .catch(err => console.error('カメラ起動失敗:', err));
}

// 初回起動
startCamera();

// 撮影
captureBtn.addEventListener('click', () => {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) {
    alert('カメラの準備中です。少し待ってからもう一度お試しください。');
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = vw;
  canvas.height = vh;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(video, 0, 0, vw, vh);
  ctx.drawImage(frame, 0, 0, vw, vh);

  preview.src = canvas.toDataURL('image/png');
  previewContainer.style.display = 'flex';
  cameraContainer.style.display = 'none';

  // 撮影ボタンとフレーム切替ボタンを非表示
  captureBtn.style.display = 'none';
  switchFrameBtn.style.display = 'none';
});

// 撮り直し
retakeBtn.addEventListener('click', () => {
  previewContainer.style.display = 'none';
  cameraContainer.style.display = 'block';
  startCamera();

  // 撮影ボタンとフレーム切替ボタンを再表示
  captureBtn.style.display = 'inline-block';
  switchFrameBtn.style.display = 'inline-block';
});

// フレーム切替
switchFrameBtn.addEventListener('click', () => {
  currentFrame = currentFrame === 1 ? 2 : 1;
  frame.src = `frame${currentFrame}.png`;
});