// Countdown até 20/06/2025
const targetDate = new Date('2025-06-20T00:00:00').getTime();
function updateCountdown() {
  const now = Date.now();
  const delta = targetDate - now;
  if (delta < 0) return clearInterval(countdownInterval);
  const days    = Math.floor(delta / (1000*60*60*24));
  const hours   = Math.floor((delta % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((delta % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((delta % (1000*60)) / 1000);
  document.getElementById('days').textContent    = String(days).padStart(2,'0');
  document.getElementById('hours').textContent   = String(hours).padStart(2,'0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
}
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

document.addEventListener('DOMContentLoaded', () => {
  const tipoSelect = document.getElementById('tipo');
  const forms = document.querySelectorAll('.fields');
  const form = document.getElementById('contact-form');
  const success = document.getElementById('success-message');
  const links = document.querySelectorAll('nav a');

  // Mostrar campos conforme perfil
  tipoSelect.addEventListener('change', () => {
    forms.forEach(f => {
      f.classList.remove('active');
    });
    const sel = tipoSelect.value;
    if (sel) {
      document.querySelector(`.fields.${sel}`).classList.add('active');
    }
  });

  // Simular envio e mostrar sucesso
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: chamar API Sigavi aqui
    form.reset();
    forms.forEach(f => f.classList.remove('active'));
    success.hidden = false;
  });

  // Smooth scroll para âncoras
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// Inicia AOS
AOS.init({ duration: 800, once: true });

// Dispara confete leve ao abrir a página
window.addEventListener('load', () => {
  confetti({
    particleCount: 100,
    spread: 60,
    origin: { y: 0.2 }
  });
});
