module.exports = {
  name: 'owner',
  aliases: ['creator', 'dev'],
  description: 'Show owner info',
  async run(sock, msg, args, config) {
    const sender = msg.key.remoteJid;
    const text = `☠️ *${config.botNameMD}* ☠️

━━ *OWNER* ━━
👤 *Name:* ${config.ownerName}
📞 *Phone:* +2348030559356
🤖 *Bot:* ${config.botName}

☠️ *BEOWULF ALWAYS WINS* ☠️`;
    await sock.sendMessage(sender, { text });
  }
};
