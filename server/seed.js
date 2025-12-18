const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizapp';

const upsertUser = async ({ username, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    if (role && existing.role !== role) {
      existing.role = role;
      await existing.save();
    }
    return existing;
  }

  const user = new User({ username, email, password, role });
  await user.save();
  return user;
};

const main = async () => {
  await mongoose.connect(MONGODB_URI);

  const admin = await upsertUser({
    username: 'Mary',
    email: 'admin@example.com',
    password: '123456',
    role: 'admin'
  });

  await upsertUser({
    username: 'John',
    email: 'user@example.com',
    password: '123456',
    role: 'user'
  });

  let quiz = await Quiz.findOne({ title: 'General Knowledge Quiz' });
  if (!quiz) {
    quiz = new Quiz({
      title: 'General Knowledge Quiz',
      description: 'Sample quiz for ASM4',
      createdBy: admin._id,
      isActive: true
    });
    await quiz.save();
  }

  const existingCount = await Question.countDocuments({ quizId: quiz._id });
  if (existingCount === 0) {
    await Question.insertMany([
      {
        quizId: quiz._id,
        questionText: 'What is the capital of Germany?',
        options: ['Paris', 'London', 'Berlin', 'Madrid'],
        correctAnswer: 2,
        points: 1
      },
      {
        quizId: quiz._id,
        questionText: 'Who developed the theory of relativity?',
        options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Nikola Tesla'],
        correctAnswer: 0,
        points: 1
      },
      {
        quizId: quiz._id,
        questionText: 'What is the symbol for iron on the periodic table?',
        options: ['Fe', 'Ir', 'In', 'F'],
        correctAnswer: 0,
        points: 1
      },
      {
        quizId: quiz._id,
        questionText: '2 + 2 equals?',
        options: ['3', '4', '5', '22'],
        correctAnswer: 1,
        points: 1
      }
    ]);
  }

  console.log('Seed completed successfully.');
  console.log('Admin login: admin@example.com / 123456');
  console.log('User login: user@example.com / 123456');
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
