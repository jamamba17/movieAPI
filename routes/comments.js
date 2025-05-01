const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { authenticate } = require('../middleware/auth');

router.post('/:movieId', authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      res.status(400);
      return res.send({ message: 'Comment text is required' });
    }
    
    const movie = await Movie.findById(req.params.movieId);
    
    if (!movie) {
      res.status(404);
      return res.send({ message: 'Movie not found' });
    }
    
    const newComment = {
      user: req.user._id,
      text
    };
    
    movie.comments.push(newComment);
    await movie.save();
    
    res.status(201);
    res.send({
      message: 'Comment added successfully',
      comment: movie.comments[movie.comments.length - 1]
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400);
      return res.send({ message: 'Invalid movie ID format' });
    }
    res.status(500);
    res.send({ message: 'Error adding comment', error: error.message });
  }
});

router.get('/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
      .select('comments')
      .populate('comments.user', 'email');
    
    if (!movie) {
      res.status(404);
      return res.send({ message: 'Movie not found' });
    }
    
    res.send(movie.comments);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400);
      return res.send({ message: 'Invalid movie ID format' });
    }
    res.status(500);
    res.send({ message: 'Error fetching comments', error: error.message });
  }
});

module.exports = router;