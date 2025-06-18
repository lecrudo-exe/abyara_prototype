// script.js

// ───────────── Aguarda DOM completo ─────────────
document.addEventListener('DOMContentLoaded', function () {

  // 1) Menu hambúrguer
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.menu');
  if (hamburger && menu) {
    hamburger.addEventListener('click', function () {
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
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetID = this.getAttribute('href');
      const targetEl = document.querySelector(targetID);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // se for mobile, fecha o menu
      if (hamburger && menu && hamburger.classList.contains('active')) {
        hamburger.classList.remove('active');
        menu.classList.remove('active');
      }
    });
  });

  // 3) Abas do formulário de contato
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      const target = document.getElementById(this.dataset.target);
      if (target) target.classList.add('active');
    });
  });

  // 4) Carousel de depoimentos
  const carousel = document.getElementById('testimonialsCarousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
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

  // ───────────── Integração Sigavi (apenas formulário "Cliente") ─────────────

  const SIGAVI_AUTH_URL = 'https://abyara.sigavi360.com.br/Sigavi/api/Acesso/Token';
  const SIGAVI_LEAD_URL = 'https://abyara.sigavi360.com.br/Sigavi/api/Leads/NovaLead';
  const SIGAVI_USERNAME = 'integracao';
  const SIGAVI_PASSWORD = 'USdZzIwAZcONM6y';

  async function fetchSigaviToken() {
    const body = new URLSearchParams({
      username: SIGAVI_USERNAME,
      password: SIGAVI_PASSWORD,
      grant_type: 'password'
    });

    const res = await fetch(SIGAVI_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
    if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
    const data = await res.json();
    return data.access_token;
  }

  async function sendSigaviLead(token, lead) {
    const res = await fetch(SIGAVI_LEAD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(lead)
    });
    if (!res.ok) throw new Error(`Lead failed: ${res.status}`);
    return res.json();
  }

  // Captura o form da aba "Cliente"
  const clientForm = document.querySelector('#cliente form');
  if (clientForm) {
    clientForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // coleta dados
      const nome = document.getElementById('cli-nome').value.trim();
      const email = document.getElementById('cli-email').value.trim();
      const telefone = document.getElementById('cli-tel').value.replace(/\D/g, '');
      const mensagem = document.getElementById('cli-msg').value.trim();

      try {
        // 1) obtém token
        const token = await fetchSigaviToken();

        // 2) prepara objeto Lead
        const lead = {
          Nome: nome,
          Email: email,
          Telefone: telefone,
          Mensagem: mensagem,
          Empreendimento: false,
          Referencia: ''
        };

        // 3) envia para Sigavi
        const result = await sendSigaviLead(token, lead);

        if (result.Sucesso) {
          alert('Sua mensagem foi enviada com sucesso!');
          clientForm.reset();
        } else {
          console.error('Erros do Sigavi:', result.Erros);
          alert('Ocorreu um problema ao enviar. Tente novamente.');
        }
      } catch (err) {
        console.error(err);
        alert('Não foi possível enviar seus dados no momento.');
      }
    });
  }

  // ───────────── Integração Corretores via Back-end ─────────────

  const corForm = document.querySelector('#corretor form');
  if (corForm) {
    corForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // coleta dados
      const nome        = document.getElementById('cor-nome').value.trim();
      const creci       = document.getElementById('cor-creci').value.trim();
      const email       = document.getElementById('cor-email').value.trim();
      const imobiliaria = document.getElementById('cor-imo').value.trim();

      try {
        // envia os dados para o seu back-end
        const resp = await fetch('http://localhost:3000/api/corretor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, creci, email, imobiliaria })
        });
        const data = await resp.json();
        if (data.sucesso) {
          alert("Cadastro enviado com sucesso!");
          corForm.reset();
        } else {
          throw new Error(data.erro || "Erro desconhecido");
        }
      } catch (err) {
        console.error(err);
        alert("Houve um erro ao enviar. Tente novamente mais tarde.");
      }
    });
  }

});
