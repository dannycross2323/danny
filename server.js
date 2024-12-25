const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

const rooms = {}; // Store rooms and their connected clients

wss.on('connection', (ws) => {
  let currentRoom = null;

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'join') {
      currentRoom = data.room;
      if (!rooms[currentRoom]) {
        rooms[currentRoom] = { clients: [], messages: [] };
      }

      // Add user to the room
      ws.username = data.username;
      ws.color = data.color;
      rooms[currentRoom].clients.push(ws);

      // Send existing messages to the new user
      rooms[currentRoom].messages.forEach((msg) => ws.send(JSON.stringify(msg)));

      console.log(`${data.username} joined room: ${currentRoom}`);
    }

    if (data.type === 'message' && currentRoom) {
      const messageData = {
        type: 'message',
        room: currentRoom,
        username: data.username,
        color: data.color,
        message: data.message,
        timestamp: data.timestamp
      };

      // Save message in room history
      rooms[currentRoom].messages.push(messageData);

      // Broadcast to all clients in the room
      rooms[currentRoom].clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(messageData));
        }
      });
    }
  });

  ws.on('close', () => {
    if (currentRoom && rooms[currentRoom]) {
      rooms[currentRoom].clients = rooms[currentRoom].clients.filter((client) => client !== ws);
      if (rooms[currentRoom].clients.length === 0) {
        delete rooms[currentRoom];
      }
    }
  });

  ws.onerror = (error) => console.error('WebSocket error:', error);
});

console.log('WebSocket server running on ws://localhost:8080');
