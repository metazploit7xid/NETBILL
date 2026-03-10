import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import fs from 'fs';

let sock: any = null;
let status = 'disconnected';
let pairingCode = '';
let userPhone = '';

export const getWaStatus = () => ({ status, pairingCode, userPhone });

export const connectToWhatsApp = async (phoneNumber?: string) => {
  const { state, saveCreds } = await useMultiFileAuthState('./wa-auth');

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }) as any,
    browser: ['Ubuntu', 'Chrome', '20.0.04'], // Required for pairing code
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update: any) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      status = 'disconnected';
      pairingCode = '';
      if (shouldReconnect) {
        connectToWhatsApp();
      } else {
        // Logged out, clear auth
        if (fs.existsSync('./wa-auth')) {
          fs.rmSync('./wa-auth', { recursive: true, force: true });
        }
        sock = null;
      }
    } else if (connection === 'open') {
      status = 'connected';
      pairingCode = '';
      userPhone = sock.user?.id || '';
      console.log('WhatsApp Connected!');
    }
  });

  // Request pairing code if phone number is provided and not yet registered
  if (phoneNumber && !sock.authState.creds.me) {
    status = 'connecting';
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(phoneNumber);
        pairingCode = code;
        status = 'waiting_for_pairing';
      } catch (err) {
        console.error('Error requesting pairing code', err);
        status = 'error';
      }
    }, 2000);
  } else if (sock.authState.creds.me) {
      status = 'connecting';
  }
};

export const logoutWhatsApp = async () => {
  if (sock) {
    await sock.logout();
    status = 'disconnected';
    pairingCode = '';
    userPhone = '';
    sock = null;
  }
};

export const sendWaMessage = async (jid: string, text: string) => {
  if (!sock || status !== 'connected') throw new Error("WhatsApp not connected");
  // Format JID correctly
  const formattedJid = jid.includes('@s.whatsapp.net') ? jid : `${jid}@s.whatsapp.net`;
  await sock.sendMessage(formattedJid, { text });
};

// Auto-connect on startup if auth exists
if (fs.existsSync('./wa-auth/creds.json')) {
  connectToWhatsApp();
}
