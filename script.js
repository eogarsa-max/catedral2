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
// --- FUNÇÕES BACKEND ---
async function listarPendentes() {
  try {
    const response = await fetch("http://localhost:3000/backend/pendentes", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    const dados = await response.json();
    console.log("Pendentes:", dados);
    return dados;
  } catch (err) {
    console.error("Erro ao listar pendentes:", err);
  }
}

async function adicionarPendente(novoPendente) {
  try {
    const response = await fetch("http://localhost:3000/backend/pendentes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoPendente)
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    const dados = await response.json();
    console.log("Pendente adicionado:", dados);
    return dados;
  } catch (err) {
    console.error("Erro ao adicionar pendente:", err);
  }
}

// --- SEU SCRIPT DE CONQUISTAS ---
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

      card.querySelector('img').addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImg.src = c.imagem;
        modalNome.textContent = c.nome;
        modalHistoria.textContent = c.historia;
      });
    });

    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', e => {
      if (e.target === modal) modal.style.display = 'none';
    });

  } catch (error) {
    console.error('Erro ao carregar conquistas:', error);
  }
}

if (document.getElementById('lista-conquistas')) {
  carregarConquistas();
}

// --- EXEMPLO DE USO DOS PENDENTES ---
document.getElementById('btn-listar-pendentes')?.addEventListener('click', listarPendentes);
document.getElementById('btn-adicionar-pendente')?.addEventListener('click', () => {
  adicionarPendente({ titulo: "Estudar Node.js", prioridade: "alta" });
});
