const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const config = require('./config');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// Web server (keeps Render alive)
app.get('/', (req, res) => {
  res.send('☠️BEOWULF☠️⎯꯭̽-MD Bot is Running!');
});
app.listen(PORT, () => console.log(`🌐 Server on port ${PORT}`));

// Store commands
const commands = new Map();

// Load commands
function loadCommands() {
  const dir = path.join(__dirname, 'commands');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    try {
      const cmd = require(path.join(dir, file));
      commands.set(cmd.name.toLowerCase(), cmd);
      if (cmd.aliases) cmd.aliases.forEach(a => commands.set(a.toLowerCase(), cmd));
      console.log(`✅ Loaded: ${cmd.name}`);
    } catch (err) {
      console.log(`❌ Failed to load ${file}: ${err.message}`);
    }
  }
}

const cooldowns = new Map();

async function handleMessage(sock, msg) {
  try {
    if (msg.key.fromMe) return;
    const msgText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const sender = msg.key.remoteJid;
    if (!msgText.startsWith(config.prefix)) return;
    const args = msgText.slice(config.prefix.length).trim().split(/ +/);
    const cmdName = args.shift()?.toLowerCase();
    if (!cmdName || !commands.has(cmdName)) return;
    const cmd = commands.get(cmdName);
    const cooldownKey = `${sender}-${cmd.name}`;
    if (cooldowns.has(cooldownKey) && (Date.now() - cooldowns.get(cooldownKey)) / 1000 < 3) return;
    cooldowns.set(cooldownKey, Date.now());
    console.log(`🎯 ${cmd.name} from ${sender}`);
    await cmd.run(sock, msg, args, config);
  } catch (err) {
    console.log('Error:', err.message);
  }
}

async function startBot() {
  console.log('╔═══════════════════════════════╗');
  console.log('║ ☠️BEOWULF☠️⎯꯭̽-MD BOT STARTING ║');
  console.log('╚═══════════════════════════════╝');
  
  loadCommands();
  
  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
  
  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    browser: ['BEOWULF-MD', 'Chrome', '120.0'],
    markOnlineOnConnect: true,
    syncFullHistory: false
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'connecting') {
      console.log('🔄 Connecting to WhatsApp...');
      if (!state.creds.registered) {
        try {
          const code = await sock.requestPairingCode(config.ownerNumber);
          const formatted = code.match(/.{1,4}/g)?.join('-') || code;
          console.log('');
          console.log('╔═══════════════════════════════╗');
          console.log('║   ☠️ PAIRING CODE ☠️           ║');
          console.log('╚═══════════════════════════════╝');
          console.log(`📞 Number: +2348030559356`);
          console.log(`🔑 CODE: ${formatted}`);
          console.log('');
          console.log('STEPS TO LINK YOUR PHONE:');
          console.log('1️⃣ Open WhatsApp on your phone');
          console.log('2️⃣ Tap ⋮ Menu > Linked Devices');
          console.log('3️⃣ Tap "Link a Device"');
          console.log('4️⃣ Enter code: ${formatted}');
          console.log('');
        } catch (err) {
          console.log('❌ Pairing error:', err.message);
        }
      }
    }
    
    if (connection === 'open') {
      console.log('✅ ☠️BEOWULF☠️⎯꯭̽-MD is ONLINE!');
      console.log(`👤 Owner: BEOWULF`);
      console.log(`📞 Number: +2348030559356`);
      console.log(`💬 Send .menu to see commands`);
    }
    
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        console.log('🔄 Reconnecting in 5s...');
        setTimeout(() => startBot(), 5000);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) await handleMessage(sock, msg);
  });
}

startBot().catch(err => {
  console.log('💥 Fatal:', err.message);
  process.exit(1);
});
