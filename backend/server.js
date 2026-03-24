const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
const connectDB = require('./lib/db');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    
    // Connect to database AFTER server starts listening
    try {
      await connectDB();
    } catch (error) {
      console.error('Failed to connect to the database.', error);
    }
  });
};

startServer();
