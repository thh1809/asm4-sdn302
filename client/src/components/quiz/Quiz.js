import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { getQuiz, clearQuiz } from '../../actions/quizActions';

const Quiz = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentQuiz, questions, loading, error } = useSelector(
    (state) => state.quiz
  );

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    dispatch(getQuiz(id));
    return () => {
      dispatch(clearQuiz());
    };
  }, [dispatch, id]);

  const handleAnswerChange = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let correctCount = 0;
    let total = 0;

    questions.forEach((question) => {
      total += question.points || 1;
      if (answers[question._id] === question.correctAnswer) {
        correctCount += question.points || 1;
      }
    });

    setScore(correctCount);
    setTotalPoints(total);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-90">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!currentQuiz) {
    return <Alert variant="warning">Quiz không tồn tại</Alert>;
  }

  return (
    <div>
      <h1 className="mb-4">{currentQuiz.title}</h1>
      {currentQuiz.description && (
        <p className="text-muted mb-4">{currentQuiz.description}</p>
      )}

      {submitted ? (
        <Card className="mb-4">
          <Card.Body>
            <h3>Kết quả Quiz</h3>
            <p>
              Bạn đã trả lời đúng: <strong>{score}/{totalPoints}</strong> điểm
            </p>
            <p>
              Tỷ lệ: <strong>{((score / totalPoints) * 100).toFixed(1)}%</strong>
            </p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Quay lại danh sách
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <Card key={question._id} className="mb-4">
              <Card.Body>
                <Card.Title>
                  Câu {index + 1}: {question.questionText}
                </Card.Title>
                <Form.Group>
                  {question.options.map((option, optionIndex) => (
                    <Form.Check
                      key={optionIndex}
                      type="radio"
                      id={`question-${question._id}-option-${optionIndex}`}
                      name={`question-${question._id}`}
                      label={option}
                      checked={answers[question._id] === optionIndex}
                      onChange={() =>
                        handleAnswerChange(question._id, optionIndex)
                      }
                      disabled={submitted}
                    />
                  ))}
                </Form.Group>
                {submitted && (
                  <Alert
                    variant={
                      answers[question._id] === question.correctAnswer
                        ? 'success'
                        : 'danger'
                    }
                    className="mt-2"
                  >
                    {answers[question._id] === question.correctAnswer
                      ? '✓ Đúng!'
                      : `✗ Sai! Đáp án đúng là: ${question.options[question.correctAnswer]}`}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          ))}
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate('/')}>
              Quay lại
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={Object.keys(answers).length !== questions.length}
            >
              Nộp bài
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default Quiz;

