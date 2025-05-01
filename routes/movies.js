const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().select('-comments');
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json(movie);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }
    res.status(500).json({ message: 'Error fetching movie', error: error.message });
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
    
    res.status(201).json({
      message: 'Movie created successfully',
      movie: savedMovie
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating movie', error: error.message });
  }
});

router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { title, director, year, description, genre } = req.body;
    
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    if (title) movie.title = title;
    if (director) movie.director = director;
    if (year) movie.year = year;
    if (description) movie.description = description;
    if (genre) movie.genre = genre;
    
    const updatedMovie = await movie.save();
    
    res.json({
      message: 'Movie updated successfully',
      movie: updatedMovie
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }
    res.status(400).json({ message: 'Error updating movie', error: error.message });
  }
});

router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    await movie.deleteOne();
    
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }
    res.status(500).json({ message: 'Error deleting movie', error: error.message });
  }
});

module.exports = router;