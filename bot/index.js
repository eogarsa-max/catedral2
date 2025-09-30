const { 
  Client, 
  GatewayIntentBits, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Carregar variáveis do .env

// Para node-fetch funcionar no Node 18+ ESM
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Configurações
const canalId = '1421137145275355176'; // ID do canal de formulários
const cargoId = '1421132785791533177'; // ID do cargo MEMBRO
const backendUrl = 'http://localhost:3000';
const pendentesPath = path.join(__dirname, '../backend/pendentes.json');

// Função para enviar pendentes
async function enviarPendentes() {
  if (!fs.existsSync(pendentesPath)) return;

  let pendentes = JSON.parse(fs.readFileSync(pendentesPath));
  const canal = await client.channels.fetch(canalId);

  let mudou = false;

  for (const form of pendentes) {
    if (form.enviado) continue; // ignora já enviados

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`aceitar_${form.nome}_${form.discord}`)
        .setLabel('ACEITAR')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`negar_${form.nome}`)
        .setLabel('NEGAR')
        .setStyle(ButtonStyle.Danger)
    );

    const mensagem = await canal.send({
      content: `📝 **Novo Formulário**\n**Nick:** ${form.nome}\n**Idade:** ${form.idade}\n**Discord:** ${form.discord}\n**Motivo:** ${form.motivo}`,
      components: [row]
    });

    // Marca como enviado
    form.enviado = true;
    form.mensagemId = mensagem.id;
    mudou = true;
  }

  if (mudou) {
    fs.writeFileSync(pendentesPath, JSON.stringify(pendentes, null, 2));
  }
}

// Evento de inicialização
client.once('ready', async () => {
  console.log(`✅ Bot logado como ${client.user.tag}`);
  await enviarPendentes();

  // Monitora mudanças no pendentes.json
  fs.watchFile(pendentesPath, async () => {
    console.log('📄 Detectado alteração em pendentes.json, enviando novos pendentes...');
    await enviarPendentes();
  });
});

// Evento de interação (botões)
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const [acao, nome, discordId] = interaction.customId.split('_');

  let pendentes = JSON.parse(fs.readFileSync(pendentesPath));
  const form = pendentes.find(p => p.nome === nome);

  if (!form) {
    await interaction.reply({ content: '❌ Formulário não encontrado ou já processado.', ephemeral: true });
    return;
  }

  if (acao === 'aceitar') {
    try {
      await fetch(`${backendUrl}/aprovar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nick: form.nome,
          cargo: 'MEMBRO',
          avatar: `https://minotar.net/avatar/${form.nome}/100.png`
        })
      });
    } catch (err) {
      console.error("Erro ao comunicar com o backend:", err);
    }

    try {
      const guild = interaction.guild;
      const membro = await guild.members.fetch(discordId).catch(() => null);
      if (membro) await membro.roles.add(cargoId);

      await interaction.update({ content: `✅ Formulário de **${form.nome}** aceito! Cargo adicionado.`, components: [] });
      setTimeout(() => interaction.message.delete().catch(() => {}), 3000);
    } catch (err) {
      console.error("Erro ao dar cargo ou atualizar interação:", err);
    }

  } else if (acao === 'negar') {
    try {
      await interaction.update({ content: `❌ Formulário de **${form.nome}** negado.`, components: [] });
      setTimeout(() => interaction.message.delete().catch(() => {}), 3000);
    } catch (err) {
      console.error("Erro ao atualizar interação:", err);
    }
  }

  // Remove do pendentes.json
  pendentes = pendentes.filter(p => p.nome !== nome);
  fs.writeFileSync(pendentesPath, JSON.stringify(pendentes, null, 2));
});

// Login do bot com variável de ambiente
client.login(process.env.TOKEN);
