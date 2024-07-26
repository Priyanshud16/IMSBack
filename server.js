// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', dataRoutes);

app.get("/AA",(req,res)=>{

  res.send("Hello Wolrd")
})

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.listen(5000, () => console.log('Server running on port 5000'));
