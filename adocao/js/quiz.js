// ========= Quiz de adoção =========
document.addEventListener('DOMContentLoaded', () => {
  const perguntas = [...document.querySelectorAll('.question')];
  const barra = document.getElementById('progressBar');
  const progresso = document.querySelector('.progress');
  const proximo = document.getElementById('proximo');
  const voltar = document.getElementById('voltar');
  const acoes = document.querySelector('.quiz-actions');
  const resultado = document.getElementById('resultado');
  const mensagem = document.getElementById('mensagemResultado');
  const recomendacoes = document.getElementById('recomendacoes');

  if (!perguntas.length || !proximo || !resultado) return;

  let atual = 0;
  const respostas = [];

  function atualizarTela() {
    perguntas.forEach((p, i) => p.classList.toggle('ativa', i === atual));
    const pct = ((atual + 1) / perguntas.length) * 100;
    barra.style.width = `${pct}%`;
    if (progresso) progresso.setAttribute('aria-valuenow', String(Math.round(pct)));
    voltar.hidden = atual === 0;
    proximo.textContent = atual === perguntas.length - 1 ? 'Ver resultado' : 'Próxima';
    proximo.disabled = respostas[atual] === undefined;
  }

  perguntas.forEach((pergunta, i) => {
    pergunta.querySelectorAll('.opcao').forEach(botao => {
      botao.addEventListener('click', () => {
        pergunta.querySelectorAll('.opcao').forEach(x => x.classList.remove('selecionada'));
        botao.classList.add('selecionada');
        respostas[i] = botao.dataset.value;
        proximo.disabled = false;
      });
    });
  });

  proximo.addEventListener('click', () => {
    if (atual < perguntas.length - 1) {
      atual++;
      atualizarTela();
    } else {
      mostrarResultado();
    }
  });

  voltar.addEventListener('click', () => {
    if (atual > 0) {
      atual--;
      atualizarTela();
    }
  });

  function mostrarResultado() {
    const [moradia, tempo, energia, passeios, objetivo] = respostas;
    let sugestoes;

    if (moradia === 'apartamento') {
      sugestoes = [
        ['🐱', 'Gatos', 'se adaptam bem a ambientes internos, com enriquecimento e cuidados adequados.'],
        ['🐶', 'Cães pequenos', 'podem ser uma boa opção quando a rotina atende às necessidades do animal.'],
        ['🐭', 'Pequenos roedores', 'ocupam pouco espaço, mas precisam de ambiente e alimentação específicos.']
      ];
    } else if (moradia === 'casa') {
      sugestoes = [
        ['🐱', 'Gatos', 'vivem bem dentro de casa com um ambiente seguro e enriquecido.'],
        ['🐶', 'Cães pequenos ou médios', 'combinam com espaços menores quando as necessidades diárias são atendidas.']
      ];
    } else {
      sugestoes = [
        ['🐶', 'Cães', 'aproveitam o espaço externo, que não substitui passeios, interação e cuidados.'],
        ['🐱', 'Gatos', 'também vivem bem em casas com quintal, desde que o acesso seja seguro.']
      ];
    }

    if ((tempo === 'pouco' || passeios === 'nao') && sugestoes[0][1] !== 'Gatos') {
      sugestoes.reverse();
    }

    if (energia === 'ativo' && passeios === 'sim') {
      sugestoes.unshift(['🐕', 'Cães ativos',
        'sua disponibilidade para passeios combina com animais que precisam de mais atividade.']);
    }

    if (objetivo === 'tranquilidade') {
      sugestoes.sort((a, b) => (a[1] === 'Gatos' ? 0 : 1) - (b[1] === 'Gatos' ? 0 : 1));
    }

    mensagem.textContent =
      'Com base nas suas respostas, estes são os perfis de pet que mais combinam com você:';
    recomendacoes.innerHTML = sugestoes.slice(0, 3).map(s => `
      <div class="recomendacao"><strong>${s[0]} ${s[1]}</strong><span>${s[2]}</span></div>
    `).join('');

    perguntas.forEach(p => p.classList.remove('ativa'));
    if (acoes) acoes.style.display = 'none';
    resultado.style.display = 'block';
    barra.style.width = '100%';
    if (progresso) progresso.setAttribute('aria-valuenow', '100');
    resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  atualizarTela();
});
