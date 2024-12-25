let currentRoom = '';
let messagesContainer = document.getElementById('messages');

// Function to connect to the room
function connectRoom() {
    currentRoom = document.getElementById('room').value.trim();
    if (!currentRoom) {
        alert('Please enter a valid room code!');
        return;
    }
    // Simulate room connection by using LocalStorage (for simplicity)
    localStorage.setItem('currentRoom', currentRoom);
    alert(`Connected to room: ${currentRoom}`);
    loadMessages();
}

// Function to send a message
function sendMessage() {
    let message = document.getElementById('message').value.trim();
    if (!message) return;

    let room = localStorage.getItem('currentRoom');
    if (!room) {
        alert('Please connect to a room first!');
        return;
    }

    let messageData = {
        room: room,
        message: message,
        timestamp: new Date().toLocaleTimeString()
    };

    // Store message in LocalStorage (acting as a simple server)
    let messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push(messageData);
    localStorage.setItem('messages', JSON.stringify(messages));

    document.getElementById('message').value = ''; // Clear input box
    loadMessages(); // Reload messages
}

// Function to load messages
function loadMessages() {
    let room = localStorage.getItem('currentRoom');
    if (!room) return;

    let messages = JSON.parse(localStorage.getItem('messages')) || [];
    let filteredMessages = messages.filter(msg => msg.room === room);

    messagesContainer.innerHTML = '';
    filteredMessages.forEach(msg => {
        let msgElement = document.createElement('div');
        msgElement.textContent = `${msg.timestamp}: ${msg.message}`;
        messagesContainer.appendChild(msgElement);
    });
}

// Listen for changes in localStorage (from other tabs/windows)
window.addEventListener('storage', function(event) {
    if (event.key === 'messages') {
        loadMessages(); // Update the messages when there's a change in localStorage
    }
});
