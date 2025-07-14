import dotenv from 'dotenv';
dotenv.config();
import { createServer } from 'http';
import { Server } from 'socket.io';
import { MongoClient } from 'mongodb';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

// MongoDB setup using environment variables
const MONGO_URI = process.env.MONGO_URI!;
const DB_NAME = process.env.MONGO_DB_NAME || 'codefly';
const COLLECTION = process.env.MONGO_COLLECTION || 'rooms';

let db: any = null;
let roomsCollection: any = null;

MongoClient.connect(MONGO_URI)
  .then(async (client) => {
    db = client.db(DB_NAME);
    roomsCollection = db.collection(COLLECTION);
    // Ensure TTL index exists (1 day = 86400 seconds)
    await roomsCollection.createIndex({ lastUpdated: 1 }, { expireAfterSeconds: 86400 });
    console.log('Connected to MongoDB and ensured TTL index');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

io.on('connection', (socket) => {
  socket.on('join', async (roomId: string) => {
    socket.join(roomId);
    // Fetch the latest code from MongoDB
    if (roomsCollection) {
      const doc = await roomsCollection.findOne({ roomId });
      if (doc && doc.code) {
        socket.emit('code-update', doc.code);
      }
    }
  });

  socket.on('code-change', async ({ roomId, code }: { roomId: string; code: string }) => {
    // Upsert the code for the room in MongoDB, update lastUpdated
    if (roomsCollection) {
      await roomsCollection.updateOne(
        { roomId },
        { $set: { code, lastUpdated: new Date() } },
        { upsert: true }
      );
    }
    socket.to(roomId).emit('code-update', code);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
}); 