const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieCatalog')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const movieRoutes = require("./routes/movies");
const authRoutes = require("./routes/auth");
const commentRoutes = require("./routes/comments");

app.use("/movies", movieRoutes);
app.use("/users", authRoutes);
app.use("/comments", commentRoutes);

const port = 3000;

if(require.main === module){
    app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on port ${ process.env.PORT || port }`)
    });
}

module.exports = {app, mongoose};