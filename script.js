document.addEventListener('DOMContentLoaded', () => {
  const gradientBg = document.querySelector('.gradient-bg');
  
  // Parallax Effect: Bergerak halus mengikuti posisi mouse di layar (hanya untuk desktop)
  if (gradientBg && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      // Hitung koordinat relatif (-10px sampai 10px)
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      
      // Aplikasikan transform translasi dengan transisi yang halus
      gradientBg.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
      gradientBg.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  }
});
