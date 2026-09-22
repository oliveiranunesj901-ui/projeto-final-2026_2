// ========= Comum a todas as páginas: menu mobile e ano no rodapé =========
document.addEventListener('DOMContentLoaded', () => {
  // Ano automático no footer
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  // Menu mobile (toggle)
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const aberto = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(aberto));
    });
    menu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // ========= Catálogo com filtros (só existe na index) =========
  const lista = document.getElementById('lista');
  const filtros = document.getElementById('filtros');
  if (!lista || !filtros || !Array.isArray(window.ITENS)) return;

  const LABEL_IDADE = window.LABEL_IDADE || 'Idade:';
  let filtroAtivo = 'Todos';

  // Função pura: dado um filtro, devolve os itens filtrados
  function filtrar(itens, filtro) {
    if (filtro === 'Todos') return itens;
    return itens.filter(i => i.categoria === filtro);
  }

  // Evita que texto dos dados quebre o HTML gerado
  function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function renderizar() {
    const itens = filtrar(window.ITENS, filtroAtivo);
    if (itens.length === 0) {
      lista.innerHTML = '<p class="vazio">Nenhum pet encontrado com esse filtro.</p>';
      return;
    }
    lista.innerHTML = itens.map(i => `
      <article class="item-card">
        <div class="img"><img src="${escapar(i.foto)}" alt="Foto de ${escapar(i.nome)}" loading="lazy"></div>
        <h3>${escapar(i.nome)}</h3>
        <p>${escapar(i.categoria)}</p>
        <p class="idade">${LABEL_IDADE} ${escapar(i.idade)}</p>
      </article>
    `).join('');
  }

  filtros.addEventListener('click', (e) => {
    const btn = e.target.closest('.filtro-btn');
    if (!btn) return;
    filtroAtivo = btn.dataset.filtro;
    filtros.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    renderizar();
  });

  // Marca o primeiro filtro como ativo e renderiza o catálogo
  const primeiro = filtros.querySelector('.filtro-btn');
  if (primeiro) primeiro.classList.add('ativo');
  renderizar();
});
