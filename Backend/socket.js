const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: 'http://localhost:5173', // Update with your frontend URL
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { 
                    socketId: socket.id,
                    status: 'active' // Set captain as active when they join
                });
                socket.join('drivers'); // Add to drivers room for broadcasts
            }
        });

        // Simplified location update - just keep captain active
        socket.on('update-location-captain', async (data) => {
            const { userId } = data;
            await captainModel.findByIdAndUpdate(userId, {
                status: 'active'
            });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log(messageObject);
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

// Add new function to broadcast to all drivers
const notifyAllDrivers = (messageObject) => {
    if (io) {
        io.to('drivers').emit(messageObject.event, messageObject.data);
    }
};

module.exports = { initializeSocket, sendMessageToSocketId, notifyAllDrivers };