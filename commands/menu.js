module.exports = {
  name: 'menu',
  aliases: ['help', 'h'],
  description: 'Show all commands',
  async run(sock, msg, args, config) {
    const sender = msg.key.remoteJid;
    const text = `☠️ *${config.botNameMD}* ☠️

┏━━━━━━━━━━━━━━━━┓
┃   *MAIN MENU*    
┃ 👤 *Number:* +2348030559356
┃ 🤖 *Bot:* ${config.botName}
┃ 📦 *Version:* ${config.version}
┗━━━━━━━━━━━━━━━━┛

━━ *GENERAL* ━━
⦿ ${config.prefix}menu — Show this menu
⦿ ${config.prefix}ping — Check bot response
⦿ ${config.prefix}owner — Owner info
⦿ ${config.prefix}info — Bot information
⦿ ${config.prefix}runtime — Bot uptime

☠️ *BEOWULF ALWAYS WINS* ☠️`;
    await sock.sendMessage(sender, { text });
  }
};
