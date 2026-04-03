const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use((err, req, res, next) => {
  if (!err) return next();
  const status = err.status || (err.name === 'MulterError' ? 400 : 400);
  const message = err.message || 'Terjadi kesalahan saat upload';
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
