const mongoose = require('mongoose');

// Assuming the connection string is in .env or I can find it in lib/mongodb.ts
// I'll try to use the environment variables if available.
// Since I can't easily run a next.js script, I'll check lib/mongodb.ts first.

const MONGODB_URI = "mongodb://127.0.0.1:27017/arqam_academy";

async function debugSettings() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const Settings = mongoose.models.Settings || mongoose.model('Settings', new mongoose.Schema({
            key: String,
            value: mongoose.Schema.Types.Mixed
        }));

        const allSettings = await Settings.find({});
        console.log('All Settings:', JSON.stringify(allSettings, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('Debug failed:', err);
        process.exit(1);
    }
}

debugSettings();
