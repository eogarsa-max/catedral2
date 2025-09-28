async function carregarMembros() {
  try {
    const response = await fetch('jogadores.yml');
    const yamlText = await response.text();
    const jogadores = jsyaml.load(yamlText);

    const container = document.getElementById('lista-membros');

    // Organizar por cargos
    const cargos = {};
    jogadores.forEach(j => {
      if(!cargos[j.cargo]) cargos[j.cargo] = [];
      cargos[j.cargo].push(j);
    });

    // Criar seções por cargo
    for (const [cargo, membros] of Object.entries(cargos)) {
      // Título do cargo
      const cargoTitle = document.createElement('h2');
      cargoTitle.textContent = `${cargo}`;
      cargoTitle.className = 'cargo-title';
      container.appendChild(cargoTitle);

      // Container de membros do cargo
      const cargoContainer = document.createElement('div');
      cargoContainer.className = 'cargo-container';

      membros.forEach(m => {
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

  } catch (error) {
    console.error('Erro ao carregar membros:', error);
  }
}

if(document.getElementById('lista-membros')) {
  carregarMembros();
}
