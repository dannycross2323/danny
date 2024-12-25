const WebSocket = require('ws');
const express = require('express');
const app = express();

// Use Render's dynamic port or fallback to 8080 for local testing
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ noServer: true });

// Serve static files (e.g., for frontend)
app.use(express.static('public'));

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('A new client connected!');
  ws.on('message', (message) => {
    console.log('Received message:', message);
    // Broadcast message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('A client disconnected.');
  });
});

// Upgrade HTTP server to WebSocket server
app.server = app.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
