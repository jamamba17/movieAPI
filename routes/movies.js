const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().select('-comments');
    res.send(movies);
  } catch (error) {
    res.status(500);
    res.send({ message: 'Error fetching movies', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      res.status(404);
      return res.send({ message: 'Movie not found' });
    }
    
    res.send(movie);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400);
      return res.send({ message: 'Invalid movie ID format' });
    }
    res.status(500);
    res.send({ message: 'Error fetching movie', error: error.message });
  }
});

router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { title, director, year, description, genre } = req.body;
    
    const movie = new Movie({
      title,
      director,
      year,
      description,
      genre
    });
    
    const savedMovie = await movie.save();
    
    res.status(201);
    res.send({
      message: 'Movie created successfully',
      movie: savedMovie
    });
  } catch (error) {
    res.status(400);
    res.send({ message: 'Error creating movie', error: error.message });
  }
});

router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { title, director, year, description, genre } = req.body;
    
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      res.status(404);
      return res.send({ message: 'Movie not found' });
    }
    
    if (title) movie.title = title;
    if (director) movie.director = director;
    if (year) movie.year = year;
    if (description) movie.description = description;
    if (genre) movie.genre = genre;
    
    const updatedMovie = await movie.save();
    
    res.send({
      message: 'Movie updated successfully',
      movie: updatedMovie
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400);
      return res.send({ message: 'Invalid movie ID format' });
    }
    res.status(400);
    res.send({ message: 'Error updating movie', error: error.message });
  }
});

router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      res.status(404);
      return res.send({ message: 'Movie not found' });
    }
    
    await movie.deleteOne();
    
    res.send({ message: 'Movie deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400);
      return res.send({ message: 'Invalid movie ID format' });
    }
    res.status(500);
    res.send({ message: 'Error deleting movie', error: error.message });
  }
});

module.exports = router;