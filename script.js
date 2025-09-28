async function carregarConquistas() {
  try {
    const response = await fetch('conquistas.yml');
    const yamlText = await response.text();
    const conquistas = jsyaml.load(yamlText);

    const container = document.getElementById('lista-conquistas');
    const modal = document.getElementById('conquista-modal');
    const modalImg = document.getElementById('modal-img');
    const modalNome = document.getElementById('modal-nome');
    const modalHistoria = document.getElementById('modal-historia');
    const modalClose = document.querySelector('.modal-close');

    conquistas.forEach(c => {
      const card = document.createElement('div');
      card.className = 'conquista-card';
      card.innerHTML = `
        <img src="${c.imagem}" alt="${c.nome}">
        <h3>${c.nome}</h3>
        <p>${c.descricao}</p>
      `;
      container.appendChild(card);

      // Abrir modal ao clicar na imagem
      card.querySelector('img').addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImg.src = c.imagem;
        modalNome.textContent = c.nome;
        modalHistoria.textContent = c.historia; // história exclusiva
      });
    });

    // Fechar modal
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Fechar modal ao clicar fora
    window.addEventListener('click', e => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  } catch (error) {
    console.error('Erro ao carregar conquistas:', error);
  }
}

if (document.getElementById('lista-conquistas')) {
  carregarConquistas();
}
