// ========= Formulário "Quero adotar" =========
// Ao enviar, abre o WhatsApp da equipe com os dados já preenchidos.
// Não precisa de servidor: funciona abrindo o contato.html direto no navegador.

// Número da equipe: somente números, com DDI (55) + DDD. Ex.: 5511999999999
const WHATSAPP_ATENDIMENTO = "5511979853859"; // Substitua pelo número real da equipe

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formContato');
  const erro = document.getElementById('erroForm');
  const sucesso = document.getElementById('sucesso');
  const celular = document.getElementById('celular');
  const cep = document.getElementById('cep');

  if (!form || !celular || !cep) return;

  // Máscara de celular: (11) 99999-9999
  celular.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    e.target.value = v;
  });

  // Máscara de CEP: 00000-000
  cep.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.replace(/^(\d{5})(\d{0,3}).*/, '$1-$2');
    e.target.value = v;
  });

  function mostrarErro(mensagem) {
    sucesso.style.display = 'none';
    erro.textContent = mensagem;
    erro.style.display = 'block';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    erro.style.display = 'none';
    sucesso.style.display = 'none';

    const dados = {
      nome: document.getElementById('nome').value.trim(),
      celular: celular.value.replace(/\D/g, ''),
      cep: cep.value.replace(/\D/g, ''),
      email: document.getElementById('email').value.trim()
    };

    if (dados.nome.length < 3) return mostrarErro('Digite seu nome completo.');
    if (dados.celular.length < 10) return mostrarErro('Digite um número de celular válido com DDD.');
    if (dados.cep.length !== 8) return mostrarErro('Digite um CEP válido com 8 números.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) return mostrarErro('Digite um e-mail válido.');

    const mensagem =
      'Olá! Tenho interesse em adotar um pet na MAGLU Pet Center.\n\n' +
      `Nome: ${dados.nome}\n` +
      `Celular: ${celular.value}\n` +
      `CEP: ${cep.value}\n` +
      `E-mail: ${dados.email}\n\n` +
      'Gostaria de continuar o atendimento sobre a adoção.';

    const url = `https://wa.me/${WHATSAPP_ATENDIMENTO}?text=${encodeURIComponent(mensagem)}`;

    sucesso.innerHTML = '<strong>Tudo certo! 💚</strong><br>Abrimos o WhatsApp da equipe em uma nova aba. Se ela não abrir, <a id="linkWhats" href="#" target="_blank" rel="noopener">clique aqui para conversar</a>.';
    sucesso.style.display = 'block';
    document.getElementById('linkWhats').href = url;

    // Aberto dentro do clique do usuário, o que evita bloqueio de pop-up
    window.open(url, '_blank', 'noopener');
  });
});