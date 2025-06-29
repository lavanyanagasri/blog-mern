const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const User = require('./models/User');
const Post = require('./models/Post'); // You need a Post model
const app = express();

const path = require("path");

// Serve frontend build
app.use(express.static(path.join(__dirname, "client/build"))); // adjust path if needed

// Catch-all route for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

const port=process.env.PORT || 4000;

const salt = bcrypt.genSaltSync(10);
const jwtSecret = 'your_jwt_secret_key';

// Multer setup for file uploads
const uploadMiddleware = multer({ dest: 'uploads/' });

const corsOptions = {
  origin:['http://localhost:3000', 'https://blog-mern-frontend-ugia.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); 

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads')); // serve static files

// ✅ Connect to MongoDB
mongoose.connect('mongodb+srv://lavanyanagasri:lavanyanagasri@cluster1.pp2m8.mongodb.net/blogApp?retryWrites=true&w=majority&appName=Cluster1')
  .then(() => console.log('MongoDB connected!'))
  .catch((e) => console.error('MongoDB connection error:', e));

// ✅ Register route
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

// ✅ Login route
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

// ✅ Profile route
app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: 'No token' });

  jwt.verify(token, jwtSecret, {}, (err, info) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    res.json(info);
  });
});

// ✅ Logout route
app.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true }).json('ok');
});

// ✅ Create Post route
app.post('/post', uploadMiddleware.single('file'), (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, jwtSecret, {}, async (err, info) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    const { title, summary, content } = req.body;
    const { originalname, path } = req.file;
    const ext = originalname.split('.').pop();
    const newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);

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

app.post('/post1', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;

  if (req.file) {
    const { originalname, path } = req.file;
    const ext = originalname.split('.').pop();
    newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, jwtSecret, {}, async (err, info) => {
    if (err) return res.status(403).json({ message: 'Token invalid', error: err.message });

    const { id, title, summary, content } = req.body;
    let postDoc;

    try {
      postDoc = await Post.findById(id);
      if (!postDoc) return res.status(404).json({ message: 'Post not found' });
    } catch (err) {
      return res.status(400).json({ message: 'Invalid post ID', error: err.message });
    }

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



//get route of post
app.get('/post', async (req, res) => {
  const posts = await Post.find()
    .populate('author', ['username']) 
    .sort({ createdAt: -1 })
    .limit(20);        
  res.json(posts);
});

//post id route
app.get('/post/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID format' });
  }

  try {
    const postDoc = await Post.findById(id).populate('author', ['username']);

    if (!postDoc) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(postDoc);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching post', error: e.message });
  }
});





app.listen(port, () => {
  console.log('Server is running on port 4000');
});
