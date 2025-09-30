const form = document.getElementById('formulario');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const dados = {
    nick: document.getElementById('nick').value,
    idade: document.getElementById('idade').value,
    discord: document.getElementById('discord').value,
    motivo: document.getElementById('motivo').value
  };

  try {
    const response = await fetch('http://localhost:3000/formulario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const result = await response.json();

    if(result.status === 'ok'){
      alert('Formulário enviado com sucesso! Aguarde a aprovação.');
      form.reset(); // limpa os campos
    } else {
      alert('Erro ao enviar formulário.');
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao conectar com o servidor.');
  }
});
