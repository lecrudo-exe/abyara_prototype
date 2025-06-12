// —————— Contador Regressivo ——————
const targetDate = new Date('2025-06-20T00:00:00').getTime();

function updateCountdown() {
  const now   = Date.now();
  const delta = targetDate - now;
  if (delta < 0) return clearInterval(countdownInterval);

  const days    = Math.floor(delta / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((delta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((delta % (1000 * 60)) / 1000);

  document.getElementById('days').textContent    = String(days).padStart(2, '0');
  document.getElementById('hours').textContent   = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();


// —————— Interações ao carregar o DOM ——————
document.addEventListener('DOMContentLoaded', () => {
  // 1) Menu hambúrguer
  const hamburger = document.querySelector('.hamburger');
  const menu      = document.querySelector('.menu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    menu.classList.toggle('active');
  });

  // 2) Formulário dinâmico (Corretor, Incorporador, Cliente)
  const tipoSelect = document.getElementById('tipo');
  const forms      = document.querySelectorAll('.fields');
  tipoSelect.addEventListener('change', () => {
    forms.forEach(f => f.classList.remove('active'));
    const sel = tipoSelect.value;
    if (sel) {
      document.querySelector(`.fields.${sel}`).classList.add('active');
    }
  });

  // 3) Simular envio e exibir mensagem de sucesso
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('success-message');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: integrar com API Sigavi
    form.reset();
    forms.forEach(f => f.classList.remove('active'));
    success.hidden = false;
  });

  // 4) Smooth scroll para links de âncora
  const links = document.querySelectorAll('nav a[href^="#"]');
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 5) Inicia as animações de scroll (AOS)
  if (window.AOS) {
    AOS.init({ duration: 800, once: true });
  }
});
