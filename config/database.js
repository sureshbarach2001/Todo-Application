const mongoose = require('mongoose');

const connectDB = async () => {
    const dbURI = process.env.DB_URI_PRODUCTION;

    try {
        await mongoose.connect(dbURI, {
            serverSelectionTimeoutMS: 5000, // Timeout if server is unresponsive
        });

        console.log(`✅ Connected to MongoDB: ${dbURI.replace(/:\/\/.*@/, '://*****:*****@')}`);

        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }

    } catch (error) {
        console.error(`❌ MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected. Reconnecting...');
    connectDB();
});

module.exports = connectDB;