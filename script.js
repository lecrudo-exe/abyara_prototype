// script.js

// ───────────── Aguarda DOM completo ─────────────
document.addEventListener('DOMContentLoaded', () => {

  // — 1) Menu hambúrguer
  const hamburger = document.querySelector('.hamburger');
  const menu      = document.querySelector('.menu');
  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      menu.classList.toggle('active');
    });
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        menu.classList.remove('active');
      });
    });
  }

  // — 2) Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const el = document.querySelector(a.getAttribute('href'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (hamburger.classList.contains('active')) {
        hamburger.classList.remove('active');
        menu.classList.remove('active');
      }
    });
  });

  // — 3) Abas de formulário
  const tabs        = document.querySelectorAll('.tab');
  const contents    = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });

  // — 4) Carousel depoimentos
  const carousel    = document.getElementById('testimonialsCarousel');
  if (carousel) {
    const track  = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prev   = carousel.querySelector('.carousel-control.prev');
    const next   = carousel.querySelector('.carousel-control.next');
    let idx = 0;
    const update = () => track.style.transform = `translateX(-${idx*100}%)`;
    prev.addEventListener('click', () => { idx = (idx-1+slides.length)%slides.length; update() });
    next.addEventListener('click', () => { idx = (idx+1)%slides.length; update() });
    update();
  }

  // — 5) Sigavi (Cliente)
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
    return (await res.json()).access_token;
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

  const clientForm = document.querySelector('#cliente form');
  if (clientForm) {
    clientForm.addEventListener('submit', async e => {
      e.preventDefault();
      const nome = document.getElementById('cli-nome').value.trim();
      const email = document.getElementById('cli-email').value.trim();
      const telefone = document.getElementById('cli-tel').value.replace(/\D/g,'');
      const mensagem = document.getElementById('cli-msg').value.trim();
      try {
        const token = await fetchSigaviToken();
        const lead = { Nome: nome, Email: email, Telefone: telefone, Mensagem: mensagem, Empreendimento: false, Referencia: '' };
        const result = await sendSigaviLead(token, lead);
        if (result.Sucesso) {
          alert('Sua mensagem foi enviada com sucesso!');
          clientForm.reset();
        } else {
          console.error(result.Erros);
          alert('Erro ao enviar. Tente novamente.');
        }
      } catch (err) {
        console.error(err);
        alert('Não foi possível enviar no momento.');
      }
    });
  }

  // — 6) Corretores → Back-end
  const corForm = document.querySelector('#corretor form');
  if (corForm) {
    corForm.addEventListener('submit', async e => {
      e.preventDefault();
      const nome        = document.getElementById('cor-nome').value.trim();
      const creci       = document.getElementById('cor-creci').value.trim();
      const email       = document.getElementById('cor-email').value.trim();
      const imobiliaria = document.getElementById('cor-imo').value.trim();
      try {
        const resp = await fetch('http://localhost:3000/api/corretor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, creci, email, imobiliaria })
        });
        const data = await resp.json();
        if (data.sucesso) {
          alert('Cadastro enviado com sucesso!');
          corForm.reset();
        } else throw new Error(data.erro||'Erro desconhecido');
      } catch (err) {
        console.error(err);
        alert('Houve um erro. Tente mais tarde.');
      }
    });
  }

  // — 7) Incorporadores → Back-end
  const incForm = document.querySelector('#incorporador form');
  if (incForm) {
    incForm.addEventListener('submit', async e => {
      e.preventDefault();
      const empresa = document.getElementById('inc-empresa').value.trim();
      const contato = document.getElementById('inc-contato').value.trim();
      const email   = document.getElementById('inc-email').value.trim();
      const telefone= document.getElementById('inc-tel').value.trim();
      const mensagem= document.getElementById('inc-msg').value.trim();
      try {
        const resp = await fetch('http://localhost:3000/api/incorporador', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ empresa, contato, email, telefone, mensagem })
        });
        const data = await resp.json();
        if (data.sucesso) {
          alert('Cadastro de incorporador enviado com sucesso!');
          incForm.reset();
        } else throw new Error(data.erro||'Erro desconhecido');
      } catch (err) {
        console.error(err);
        alert('Houve um erro. Tente novamente mais tarde.');
      }
    });
  }

});
