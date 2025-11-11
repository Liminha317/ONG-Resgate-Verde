// script.js - Versão simplificada para 3 páginas separadas
// Demonstra domínio de manipulação DOM, eventos, armazenamento local e integração com Handlebars.js

// Espera o DOM estar pronto
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ script.js carregado e DOM pronto");

  // Detecta a página atual
  const currentPage = location.pathname.split('/').pop().replace('.html', '') || 'index';

  // --- CONFIGURAÇÃO GLOBAL ---
  // Toggle de tema
  const toggleThemeBtn = document.getElementById('toggleTheme');
  if (toggleThemeBtn) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme);
    toggleThemeBtn.addEventListener('click', () => {
      const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Hover nos links
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('mouseover', () => {
      link.style.color = '#2ecc71';
      link.style.transition = 'color 0.3s';
    });
    link.addEventListener('mouseout', () => {
      link.style.color = '';
    });
  });

  // Contador de cliques
  let clickCount = parseInt(localStorage.getItem('clickCount') || '0');
  document.addEventListener('click', () => {
    clickCount++;
    localStorage.setItem('clickCount', clickCount);
  });

  // --- SISTEMA DE TEMPLATES ---
  const dynamicContent = document.getElementById('dynamicContent');
  if (dynamicContent) {
    const templates = {
      index: `<h3>Conquistas Dinâmicas</h3><ul><li>Reflorestamento de 10.000 hectares</li><li>Resgate de 5.000 animais</li></ul>`,
      cadastro: `<h3>Oportunidades</h3><ul><li>Descobrir oportunidades</li></ul>`,
      projetos: `<h3>Imagens</h3><img src="images/image (3).webp" alt="Queimadas" style="width:200px;">`
    };
    if (templates[currentPage]) {
      dynamicContent.innerHTML = templates[currentPage]; // Sem Handlebars para simplicidade
    }
  }

  // --- INTERATIVIDADE POR PÁGINA ---
  if (currentPage === 'index') {
    const imagem = document.querySelector('.carrossel img');
    if (imagem) {
      imagem.style.opacity = '0';
      imagem.style.transition = 'opacity 2s';
      setTimeout(() => { imagem.style.opacity = '1'; }, 500);
    }
  }

  if (currentPage === 'cadastro') {
    const form = document.getElementById('formVoluntario');
    const mensagem = document.getElementById('mensagem');
    if (form) {
      const fields = ['nome', 'email', 'telefone', 'cpf', 'dataNascimento', 'tipoLogradouro', 'nomeLogradouro', 'numeroResidencia', 'cep', 'cidade', 'estado', 'motivo'];
      
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', () => validateField(id));
        }
      });

      function validateField(id) {
        const el = document.getElementById(id);
        let error = '';
        if (!el.value.trim()) error = 'Campo obrigatório.';
        else if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) error = 'Email inválido.';
        else if (id === 'cpf') {
          const cpfClean = el.value.replace(/\D/g, '');
          if (!/^\d{11}$/.test(cpfClean)) error = 'CPF inválido (11 dígitos).';
        }
        else if (id === 'dataNascimento' && new Date(el.value) > new Date()) error = 'Data futura inválida.';
        else if (id === 'telefone') {
          const telClean = el.value.replace(/\D/g, '');
          if (!/^\d{10,11}$/.test(telClean)) error = 'Telefone inválido (10-11 dígitos).';
        }
        else if (id === 'cep') {
          const cepClean = el.value.replace(/\D/g, '');
          if (!/^\d{8}$/.test(cepClean)) error = 'CEP inválido (8 dígitos).';
        }
        else if (id === 'numeroResidencia' && !/^\d+$/.test(el.value.trim())) error = 'Número deve ser dígitos.';
        showError(id, error);
      }

      function showError(id, msg) {
        let errEl = document.getElementById(`error-${id}`);
        if (msg) {
          if (!errEl) {
            errEl = document.createElement('span');
            errEl.id = `error-${id}`;
            errEl.style.color = 'red';
            errEl.style.fontSize = '12px';
            document.getElementById(id).parentNode.appendChild(errEl);
          }
          errEl.textContent = msg;
        } else if (errEl) errEl.remove();
      }

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        fields.forEach(id => {
          validateField(id);
          if (document.getElementById(`error-${id}`)) valid = false;
        });
        if (valid) {
          const formData = {};
          fields.forEach(id => { formData[id] = document.getElementById(id).value; });
          localStorage.setItem('voluntarioData', JSON.stringify(formData));
          
          // Fallback: Tenta mostrar no DOM, senão usa alert
          if (mensagem) {
            mensagem.textContent = '✅ Cadastro enviado! Obrigado! 💚';
            mensagem.style.display = 'block';
            mensagem.style.backgroundColor = '#e6f4ea';
            mensagem.style.padding = '15px';
            mensagem.style.borderRadius = '8px';
            mensagem.style.fontWeight = 'bold';
            form.reset();
            setTimeout(() => { mensagem.style.display = 'none'; }, 5000);
          } else {
            alert('✅ Cadastro enviado! Obrigado! 💚'); // Fallback simples
          }
        }
      });

      // Carrega dados salvos
      if (localStorage.getItem('voluntarioData')) {
        const saved = JSON.parse(localStorage.getItem('voluntarioData'));
        Object.keys(saved).forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = saved[id];
        });
      }
    }
  }

  if (currentPage === 'projetos') {
    document.querySelectorAll('.imagem-detalhe img').forEach(img => {
      img.style.opacity = '0';
      img.style.transition = 'opacity 1s';
      setTimeout(() => { img.style.opacity = '1'; }, 1000);
    });
  }
});

// Novo: Toggle do menu hambúrguer
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-visible');
    navMenu.classList.toggle('mobile-hidden');
    menuToggle.classList.toggle('open');
  });
}

// Novo: Efeito de sumiço no header ao rolar para baixo
let lastScrollTop = 0;
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Rolando para baixo: esconde header
    header.classList.remove('header-visible');
    header.classList.add('header-hidden');
  } else {
    // Rolando para cima: mostra header
    header.classList.remove('header-hidden');
    header.classList.add('header-visible');
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Evita valores negativos
});