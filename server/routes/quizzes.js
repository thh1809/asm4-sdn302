const express = require('express');
const { body, validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/quizzes
// @desc    Get all quizzes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get single quiz with questions
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'username');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const questions = await Question.find({ quizId: req.params.id });
    res.json({ quiz, questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/quizzes
// @desc    Create a new quiz
// @access  Private (Admin only)
router.post('/', adminAuth, [
  body('title').trim().notEmpty().withMessage('Title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;
    const quiz = new Quiz({
      title,
      description,
      createdBy: req.user._id
    });

    await quiz.save();
    await quiz.populate('createdBy', 'username');

    res.status(201).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/quizzes/:id
// @desc    Update a quiz
// @access  Private (Admin only)
router.put('/:id', adminAuth, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { title, description, isActive } = req.body;
    if (title) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (isActive !== undefined) quiz.isActive = isActive;

    await quiz.save();
    await quiz.populate('createdBy', 'username');

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/quizzes/:id
// @desc    Delete a quiz
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Delete all questions associated with this quiz
    await Question.deleteMany({ quizId: req.params.id });
    await Quiz.findByIdAndDelete(req.params.id);

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

