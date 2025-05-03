let slideIndex = 0;
const slides = document.querySelectorAll('.slideshow img');

function showSlides() {
  slides.forEach((img) => img.classList.remove('active'));
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  if (slides.length > 0) {
    slides[0].classList.add('active');
    setInterval(showSlides, 3000); // Slide berganti setiap 3 detik
  }
});

// Heart animation
const heartsContainer = document.querySelector('.hearts-container');

function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.innerText = '♥';

  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
  heart.style.animationDuration = (Math.random() * 3 + 4) + 's';

  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 7000);
}

setInterval(createHeart, 500); // 1 hati tiap 0.5 detik


window.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bg-music');
  
    // Coba paksa autoplay saat halaman dimuat
    setTimeout(() => {
      audio.play().catch((err) => {
        console.warn("Autoplay gagal, coba klik di mana saja untuk memulai musik.");
      });
    }, 100); // kasih jeda 0.1 detik biar lebih stabil
  });

  // Trigger manual saat user klik di mana saja (backup jika autoplay gagal)
document.addEventListener('click', () => {
    const audio = document.getElementById('bg-music');
    if (audio.paused) {
      audio.play();
    }
  });