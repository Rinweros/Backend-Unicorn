const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user');
const Recipe = require('./models/recipe');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Připojení k MongoDB
mongoose.connect('mongodb://localhost:27017/recipe-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Endpoint pro registraci uživatele
app.post('/users', async (req, res) => {
  try {
    console.log (req.body);
    const user = new User(req.body);
    console.log (user);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Endpoint pro přihlášení uživatele
app.post('/login', async (req, res) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(400).send({ message: 'Invalid username or password' });
    }
    console.log (user);
    res.send({ message: 'Login successful', user });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Endpoint pro vytvoření receptu
app.post('/recipes', async (req, res) => {
  try {
    console.log (JSON.stringify(req.body));
    const mrt = req.body.ingredients.split(',');
    console.log (mrt);
    const recipe = new Recipe(req.body);
    recipe.ingredients=mrt;
    await recipe.save();
    res.status(201).send(recipe);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Endpoint pro získání všech receptů
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.send(recipes);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Endpoint pro získání detailů jednoho receptu
app.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).send({ message: 'Recipe not found' });
    }
    res.send(recipe);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/users/:id', async (req, res) => { 
  console.log(req.params.id);
  try {
    const id = req.params.id;
    console.log (id); 
    const user = await User.findOne({ _id:id});
    console.log (user);
    if (!user) {
      return res.status(400).send({ message: 'Invalid id' });
    }
    res.send({ message: 'User found', user });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});

