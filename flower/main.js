onload = () => {
    const c = setTimeout(() => {
      document.body.classList.remove("not-loaded");
      clearTimeout(c);
    }, 1000);
  };

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