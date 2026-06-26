module.exports = {
  name: 'runtime',
  aliases: ['uptime', 'rt'],
  description: 'Show bot uptime',
  async run(sock, msg, args, config) {
    const sender = msg.key.remoteJid;
    const up = process.uptime();
    const d = Math.floor(up / 86400);
    const h = Math.floor((up % 86400) / 3600);
    const m = Math.floor((up % 3600) / 60);
    const s = Math.floor(up % 60);
    const text = `☠️ *${config.botNameMD}* ☠️

━━ *UPTIME* ━━
📅 Days: ${d}
🕐 Hours: ${h}
🕑 Minutes: ${m}
🕒 Seconds: ${s}

☠️ *BEOWULF ALWAYS WINS* ☠️`;
    await sock.sendMessage(sender, { text });
  }
};
