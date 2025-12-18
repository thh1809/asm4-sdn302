const express = require('express');
const { body, validationResult } = require('express-validator');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/questions/quiz/:quizId
// @desc    Get all questions for a quiz
// @access  Public
router.get('/quiz/:quizId', async (req, res) => {
  try {
    const questions = await Question.find({ quizId: req.params.quizId });
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/questions/:id
// @desc    Get single question
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/questions
// @desc    Create a new question
// @access  Private (Admin only)
router.post('/', adminAuth, [
  body('quizId').notEmpty().withMessage('Quiz ID is required'),
  body('questionText').trim().notEmpty().withMessage('Question text is required'),
  body('options').isArray({ min: 2, max: 6 }).withMessage('Must have between 2 and 6 options'),
  body('correctAnswer').isInt({ min: 0 }).withMessage('Correct answer must be a valid index'),
  body('points').optional().isInt({ min: 1 }).withMessage('Points must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quizId, questionText, options, correctAnswer, points } = req.body;

    // Verify quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Validate correctAnswer index
    if (correctAnswer >= options.length) {
      return res.status(400).json({ message: 'Correct answer index is out of range' });
    }

    const question = new Question({
      quizId,
      questionText,
      options,
      correctAnswer,
      points: points || 1
    });

    await question.save();
    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/questions/:id
// @desc    Update a question
// @access  Private (Admin only)
router.put('/:id', adminAuth, [
  body('questionText').optional().trim().notEmpty().withMessage('Question text cannot be empty'),
  body('options').optional().isArray({ min: 2, max: 6 }).withMessage('Must have between 2 and 6 options'),
  body('correctAnswer').optional().isInt({ min: 0 }).withMessage('Correct answer must be a valid index'),
  body('points').optional().isInt({ min: 1 }).withMessage('Points must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const { questionText, options, correctAnswer, points } = req.body;

    if (questionText) question.questionText = questionText;
    if (options) {
      question.options = options;
      // Validate correctAnswer if provided
      if (correctAnswer !== undefined) {
        if (correctAnswer >= options.length) {
          return res.status(400).json({ message: 'Correct answer index is out of range' });
        }
        question.correctAnswer = correctAnswer;
      }
    } else if (correctAnswer !== undefined) {
      if (correctAnswer >= question.options.length) {
        return res.status(400).json({ message: 'Correct answer index is out of range' });
      }
      question.correctAnswer = correctAnswer;
    }
    if (points) question.points = points;

    await question.save();
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/questions/:id
// @desc    Delete a question
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

