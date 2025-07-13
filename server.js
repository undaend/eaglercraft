const WebSocket = require('ws');
const net = require('net');

const TARGET_HOST = process.env.TARGET || 'thekingdomserver.falixsrv.me';
const TARGET_PORT = process.env.TARGET_PORT || 30319;
const LISTEN_PORT = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port: LISTEN_PORT });

console.log(`[+] Eagler WSS proxy started on port ${LISTEN_PORT}`);
console.log(`[>] Forwarding to ${TARGET_HOST}:${TARGET_PORT}`);

wss.on('connection', function connection(ws) {
  const mcSocket = net.createConnection(TARGET_PORT, TARGET_HOST);

  ws.on('message', (msg) => {
    mcSocket.write(msg);
  });

  mcSocket.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });

  ws.on('close', () => mcSocket.end());
  mcSocket.on('close', () => ws.close());
  mcSocket.on('error', (err) => {
    console.error('[!] Minecraft error:', err.message);
    ws.close();
  });
});
