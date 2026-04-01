import { Client, GatewayIntentBits } from "discord.js";
import axios from "axios";

const DISCORD_TOKEN =
  "MTQ4ODk1OTM5NzkyMDExMjY1MA.GNleQj.t090yAj_XOymzlfde7ayqv9-n9qY_dxx8zmPow";
const TELEGRAM_TOKEN = "8639402369:AAFgc5V2QraKFr7Ut7q8VX76KgXez3O6Z2g";
const TELEGRAM_CHAT_ID = "-1001865381246";
const TARGET_VOICE_CHANNEL_ID = null;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
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

  const shouldNotify =
    !TARGET_VOICE_CHANNEL_ID ||
    (newChannel && newChannel.id === TARGET_VOICE_CHANNEL_ID) ||
    (oldChannel && oldChannel.id === TARGET_VOICE_CHANNEL_ID);

  if (!shouldNotify) return;

  if (!oldChannel && newChannel) {
    const message = `🎤 <b>${member.displayName}</b> зашел в голосовой канал\n\n📢 Канал: <b>${newChannel.name}</b>`;
    sendTelegramMessage(message);
    console.log(`${member.displayName} зашел в ${newChannel.name}`);
  } else if (oldChannel && !newChannel) {
    const message = `👋 <b>${member.displayName}</b> покинул голосовой канал\n\n📢 Канал: <b>${oldChannel.name}</b>`;
    sendTelegramMessage(message);
  }
});

client.login(DISCORD_TOKEN);
