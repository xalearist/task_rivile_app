require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const userRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const activityLogsRoutes = require('./routes/actitivityLogs');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(express.json()); 

sequelize.sync().then(() => {
  console.log('Database & tables created!');
}).catch(err => {
  console.error('Failed to sync database:', err);
  process.exit(1); 
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, 
}));

// Use routes
app.use('/api/auth', userRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/activityLogs', activityLogsRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



/*// backend/server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const activityLogsRoutes = require('./routes/actitivityLogs');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');


const app = express();
app.use(express.json()); // Middleware to parse JSON

connectDB(); // Connect to the database

app.use(cors({
    origin: 'http://localhost:3000', // Allow only your frontend to access the backend
    credentials: true, // Allow cookies to be sent
  }));

// Use routes
app.use('/api/auth', userRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/activityLogs', activityLogsRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));*/
