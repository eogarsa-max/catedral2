async function carregarMembros() {
  try {
    // Busca os membros aprovados do backend
    const response = await fetch('http://localhost:3000/membros'); // ou a URL do Netlify se estiver online
    const jogadores = await response.json();

    const container = document.getElementById('lista-membros');
    container.innerHTML = ''; // Limpa antes de adicionar

    // Organizar por cargos
    const cargos = {};
    jogadores.forEach(j => {
      if(!cargos[j.cargo]) cargos[j.cargo] = [];
      cargos[j.cargo].push(j);
    });

    // Criar seções por cargo em ordem desejada
    const ordemCargos = ['LÍDER', 'CAPITÃO', 'MEMBRO'];
    ordemCargos.forEach(cargo => {
      if(cargos[cargo]) {
        // Título do cargo
        const cargoTitle = document.createElement('h2');
        cargoTitle.textContent = cargo;
        cargoTitle.className = 'cargo-title';
        container.appendChild(cargoTitle);

        // Container de membros do cargo
        const cargoContainer = document.createElement('div');
        cargoContainer.className = 'cargo-container';

        cargos[cargo].forEach(m => {
          const card = document.createElement('div');
          card.className = 'membro-card';
          card.innerHTML = `
            <img src="${m.avatar}" alt="${m.nick}">
            <p>${m.nick}</p>
          `;
          cargoContainer.appendChild(card);
        });

        container.appendChild(cargoContainer);
      }
    });

  } catch (error) {
    console.error('Erro ao carregar membros:', error);
  }
}

// Iniciar carregamento
if(document.getElementById('lista-membros')) {
  carregarMembros();
}
