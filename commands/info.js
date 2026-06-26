module.exports = {
  name: 'info',
  aliases: ['botinfo'],
  description: 'Show bot information',
  async run(sock, msg, args, config) {
    const sender = msg.key.remoteJid;
    const text = `☠️ *${config.botNameMD}* ☠️

━━ *BOT INFO* ━━
🤖 *Name:* ${config.botName}
📦 *Version:* ${config.version}
📡 *Platform:* Baileys Multi-Device
👤 *Owner:* ${config.ownerName}
📞 *Number:* +2348030559356

☠️ *BEOWULF ALWAYS WINS* ☠️`;
    await sock.sendMessage(sender, { text });
  }
};
