const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// MongoDB Connection URL and Database Name
const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'demo_boxoffice';

let db;

async function connectDB() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        console.log('Connected successfully to MongoDB server');
        db = client.db(dbName);
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        // Retry logic could be added here, but for now we just log
        process.exit(1);
    }
}

// Connect to DB on startup
connectDB();

// API Endpoints

// POST /api/movies - Add a new movie
app.post('/api/movies', async (req, res) => {
    try {
        const { movieName, hero, collection, status } = req.body;

        if (!movieName || !hero || collection === undefined || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const movie = {
            movie_name: movieName, // Map camelCase to snake_case
            hero,
            collection: parseFloat(collection),
            status,
            created_at: new Date()
        };

        const collectionName = 'movies';
        const result = await db.collection(collectionName).insertOne(movie);

        res.status(201).json({ message: 'Movie saved', id: result.insertedId });
    } catch (err) {
        console.error('Error saving movie:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /api/movies - Search or list movies
app.get('/api/movies', async (req, res) => {
    try {
        const { query } = req.query;
        const filter = {};

        if (query) {
            // Simple case-insensitive regex search on movie_name or hero
            const regex = new RegExp(query, 'i');
            filter.$or = [
                { movie_name: regex },
                { hero: regex }
            ];
        }

        const movies = await db.collection('movies')
            .find(filter)
            .sort({ created_at: -1 }) // Newest first
            .toArray();

        res.json(movies);
    } catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Fallback to index.html for any other GET request (SPA support if needed, though simple static serve handles root)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});