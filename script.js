// Aguarda DOM completo
document.addEventListener('DOMContentLoaded', function() {

  // 1) Menu hambúrguer
  const hamburger = document.querySelector('.hamburger');
  const menu      = document.querySelector('.menu');
  if (hamburger && menu) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      menu.classList.toggle('active');
    });
    // Fecha o menu mobile ao clicar em qualquer link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        menu.classList.remove('active');
      });
    });
  }

  // 2) Smooth scrolling para âncoras internas
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetID = this.getAttribute('href');
      const targetEl = document.querySelector(targetID);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 3) Abas do formulário de contato
  const tabs        = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active de todos
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      // Ativa só o clicado + respectivo conteúdo
      this.classList.add('active');
      const target = document.getElementById(this.dataset.target);
      if (target) target.classList.add('active');
    });
  });

  // 4) Carousel de depoimentos
  const carousel = document.getElementById('testimonialsCarousel');
  if (carousel) {
    const track   = carousel.querySelector('.carousel-track');
    const slides  = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-control.prev');
    const nextBtn = carousel.querySelector('.carousel-control.next');
    let index = 0;

    function updateCarousel() {
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      updateCarousel();
    });
    nextBtn.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      updateCarousel();
    });

    // exibe o primeiro slide
    updateCarousel();
  }

});
