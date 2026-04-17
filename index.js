import { Client, GatewayIntentBits } from "discord.js";
import axios from "axios";
import { config } from "dotenv";

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});


async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error("Ошибка отправки в Telegram:", error);
  }
}

client.on("ready", () => {
  console.log(`Бот ${client.user.tag} запущен!`);
});

client.on("voiceStateUpdate", (oldState, newState) => {
  const member = newState.member;
  const oldChannel = oldState.channel;
  const newChannel = newState.channel;

  if (!oldChannel && newChannel) {
    const message = `
    🎤 <b>${member.displayName}</b> зашел в голосовой канал
    \n
    📢 Канал: <b>${newChannel.name}
    </b>`;

    sendTelegramMessage(message);
    console.log(`${member.displayName} зашел в ${newChannel.name}`);
  } else if (oldChannel && !newChannel) {
    const message = `
    👋 <b>${member.displayName}</b> покинул голосовой канал
    \n
    📢 Канал: <b>${oldChannel.name}</b>`;

    sendTelegramMessage(message);
  }
});

function launch() {
  client.login(process.env.DISCORD_TOKEN);
}

launch();
