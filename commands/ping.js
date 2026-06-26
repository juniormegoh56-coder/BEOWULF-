module.exports = {
  name: 'ping',
  aliases: ['p'],
  description: 'Check bot response',
  async run(sock, msg, args, config) {
    const sender = msg.key.remoteJid;
    await sock.sendMessage(sender, { text: '☠️ *Pong!* 🏓\n_BEOWULF IS ONLINE_' });
  }
};
