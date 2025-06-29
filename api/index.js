const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const path = require("path");

const User = require('./models/User');
const Post = require('./models/Post');

const app = express();
const port = process.env.PORT || 4000;

// JWT secret (move to .env in real projects)
const jwtSecret = 'your_jwt_secret_key';
const salt = bcrypt.genSaltSync(10);

// ✅ Multer for file uploads
const uploadMiddleware = multer({ dest: 'uploads/' });

// ✅ CORS for frontend access
const corsOptions = {
  origin: ['http://localhost:3000', 'https://blog-mern-frontend-ugia.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ✅ Serve uploaded images
app.use('/uploads', express.static(__dirname + '/uploads'));

// ✅ Connect to MongoDB
mongoose.connect('mongodb+srv://lavanyanagasri:lavanyanagasri@cluster1.pp2m8.mongodb.net/blogApp?retryWrites=true&w=majority&appName=Cluster1')
  .then(() => console.log('MongoDB connected!'))
  .catch((e) => console.error('MongoDB connection error:', e));

// ================== API Routes ===================

// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.status(201).json({ message: 'User created', user: { username: userDoc.username, id: userDoc._id } });
  } catch (e) {
    res.status(400).json({ message: 'Registration failed', error: e.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) return res.status(404).json({ message: 'User not found' });

    const isPasswordCorrect = bcrypt.compareSync(password, userDoc.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: 'Wrong credentials' });

    const token = jwt.sign({ id: userDoc._id, username }, jwtSecret, {});
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
    }).json({ id: userDoc._id, username });
  } catch (e) {
    res.status(500).json({ message: 'Login failed', error: e.message });
  }
});

// Profile
app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: 'No token' });

  jwt.verify(token, jwtSecret, {}, (err, info) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    res.json(info);
  });
});

// Logout
app.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true }).json('ok');
});

// Create Post
app.post('/post', uploadMiddleware.single('file'), (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, jwtSecret, {}, async (err, info) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    const { title, summary, content } = req.body;
    const { originalname, path: tempPath } = req.file;
    const ext = originalname.split('.').pop();
    const newPath = `${tempPath}.${ext}`;
    fs.renameSync(tempPath, newPath);

    try {
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.status(201).json(postDoc);
    } catch (e) {
      res.status(500).json({ message: 'Post creation failed', error: e.message });
    }
  });
});

// Update Post
app.post('/post1', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;

  if (req.file) {
    const { originalname, path: tempPath } = req.file;
    const ext = originalname.split('.').pop();
    newPath = `${tempPath}.${ext}`;
    fs.renameSync(tempPath, newPath);
  }

  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, jwtSecret, {}, async (err, info) => {
    if (err) return res.status(403).json({ message: 'Token invalid', error: err.message });

    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    if (!postDoc) return res.status(404).json({ message: 'Post not found' });
    if (postDoc.author.toString() !== info.id) {
      return res.status(403).json({ message: 'You are not the author of this post' });
    }

    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    if (newPath) postDoc.cover = newPath;

    try {
      await postDoc.save();
      res.json(postDoc);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update post', error: err.message });
    }
  });
});

// Get all posts
app.get('/post', async (req, res) => {
  const posts = await Post.find()
    .populate('author', ['username'])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

// Get single post by ID
app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID format' });
  }

  try {
    const postDoc = await Post.findById(id).populate('author', ['username']);
    if (!postDoc) return res.status(404).json({ message: 'Post not found' });
    res.json(postDoc);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching post', error: e.message });
  }
});

// ✅ Serve frontend React app **after all routes**
app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Start server
app.listen(port, () => {
  console.log('Server is running on port', port);
});
