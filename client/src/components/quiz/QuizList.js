import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import { getQuizzes } from '../../actions/quizActions';

const QuizList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { quizzes, loading, error } = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(getQuizzes());
  }, [dispatch]);

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

  return (
    <div>
      <h1 className="mb-4">Danh sách Quiz</h1>
      {quizzes.length === 0 ? (
        <Alert variant="info">Chưa có quiz nào. Vui lòng đợi admin tạo quiz mới.</Alert>
      ) : (
        <div className="row">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="col-md-6 col-lg-4 mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{quiz.title}</Card.Title>
                  <Card.Text>{quiz.description || 'Không có mô tả'}</Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      Tạo bởi: {quiz.createdBy?.username || 'Unknown'}
                    </small>
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                  >
                    Làm Quiz
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;

