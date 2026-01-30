const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'demo_boxoffice';
const client = new MongoClient(mongoUrl);

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/movies', async (req, res) => {
  const { movieName, hero, collection, status } = req.body;

  if (!movieName || !hero || typeof collection !== 'number' || !status) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const db = client.db(dbName);
    await db.collection('movies').insertOne({
      movie_name: movieName,
      hero,
      collection,
      status,
      created_at: new Date()
    });
    return res.status(201).json({ message: 'Movie saved.' });
  } catch (err) {
    return res.status(500).json({ message: 'Database error.', error: err.message });
  }
});

app.get('/api/movies', async (req, res) => {
  const query = req.query.query || '';

  try {
    const db = client.db(dbName);
    const filter = query
      ? {
          $or: [
            { movie_name: { $regex: query, $options: 'i' } },
            { hero: { $regex: query, $options: 'i' } }
          ]
        }
      : {};

    const rows = await db
      .collection('movies')
      .find(filter, { projection: { _id: 0, movie_name: 1, hero: 1, collection: 1, status: 1 } })
      .sort({ created_at: -1 })
      .toArray();

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Database error.', error: err.message });
  }
});

async function start() {
  try {
    await client.connect();
    app.listen(port, () => {
      console.log(`Demo-Boxoffice running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

start();
