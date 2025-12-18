import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../../config';
import {
  Button,
  Modal,
  Form,
  Table,
  Alert,
  Tabs,
  Tab
} from 'react-bootstrap';

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    isActive: true
  });

  const [questionForm, setQuestionForm] = useState({
    quizId: '',
    questionText: '',
    options: ['', ''],
    correctAnswer: 0,
    points: 1
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const quizzesRes = await axios.get(getApiUrl('/api/quizzes'));
      setQuizzes(quizzesRes.data);
      
      // Load questions for each quiz
      const allQuestions = [];
      for (const quiz of quizzesRes.data) {
        try {
          const questionsRes = await axios.get(getApiUrl(`/api/questions/quiz/${quiz._id}`));
          allQuestions.push(...questionsRes.data);
        } catch (err) {
          console.error(`Error loading questions for quiz ${quiz._id}:`, err);
        }
      }
      setQuestions(allQuestions);
      setLoading(false);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu');
      setLoading(false);
    }
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        await axios.put(getApiUrl(`/api/quizzes/${editingQuiz._id}`), quizForm);
      } else {
        await axios.post(getApiUrl('/api/quizzes'), quizForm);
      }
      setShowQuizModal(false);
      setEditingQuiz(null);
      setQuizForm({ title: '', description: '', isActive: true });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tạo quiz');
    }
  };

  const handleOpenCreateQuiz = () => {
    setError(null);
    setEditingQuiz(null);
    setQuizForm({ title: '', description: '', isActive: true });
    setShowQuizModal(true);
  };

  const handleOpenEditQuiz = (quiz) => {
    setError(null);
    setEditingQuiz(quiz);
    setQuizForm({
      title: quiz.title || '',
      description: quiz.description || '',
      isActive: quiz.isActive !== undefined ? quiz.isActive : true
    });
    setShowQuizModal(true);
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quiz này?')) {
      try {
        await axios.delete(getApiUrl(`/api/quizzes/${id}`));
        loadData();
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi khi xóa quiz');
      }
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    try {
      const filteredOptions = questionForm.options.filter((opt) => opt.trim() !== '');
      if (filteredOptions.length < 2) {
        setError('Cần ít nhất 2 đáp án');
        return;
      }

      const correctAnswer =
        questionForm.correctAnswer >= filteredOptions.length
          ? filteredOptions.length - 1
          : questionForm.correctAnswer;

      if (editingQuestion) {
        await axios.put(getApiUrl(`/api/questions/${editingQuestion._id}`), {
          ...questionForm,
          correctAnswer,
          options: filteredOptions
        });
      } else {
        await axios.post(getApiUrl('/api/questions'), {
          ...questionForm,
          correctAnswer,
          options: filteredOptions
        });
      }
      setShowQuestionModal(false);
      setEditingQuestion(null);
      setQuestionForm({
        quizId: '',
        questionText: '',
        options: ['', ''],
        correctAnswer: 0,
        points: 1
      });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tạo câu hỏi');
    }
  };

  const handleOpenCreateQuestion = () => {
    setError(null);
    setEditingQuestion(null);
    setQuestionForm({
      quizId: '',
      questionText: '',
      options: ['', ''],
      correctAnswer: 0,
      points: 1
    });
    setShowQuestionModal(true);
  };

  const handleOpenEditQuestion = (question) => {
    setError(null);
    setEditingQuestion(question);
    const options = Array.isArray(question.options) ? question.options : [];
    const normalizedOptions = options.length >= 2 ? options : [...options, '', ''].slice(0, 2);
    setQuestionForm({
      quizId: question.quizId || '',
      questionText: question.questionText || '',
      options: normalizedOptions,
      correctAnswer: question.correctAnswer ?? 0,
      points: question.points ?? 1
    });
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      try {
        await axios.delete(getApiUrl(`/api/questions/${id}`));
        loadData();
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi khi xóa câu hỏi');
      }
    }
  };

  const addOption = () => {
    if (questionForm.options.length < 6) {
      setQuestionForm({
        ...questionForm,
        options: [...questionForm.options, '']
      });
    }
  };

  const removeOption = (index) => {
    if (questionForm.options.length > 2) {
      const newOptions = questionForm.options.filter((_, i) => i !== index);
      setQuestionForm({
        ...questionForm,
        options: newOptions,
        correctAnswer:
          questionForm.correctAnswer >= newOptions.length
            ? newOptions.length - 1
            : questionForm.correctAnswer
      });
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const questionsForSelectedQuiz = questions.filter(
    (q) => q.quizId === selectedQuiz?._id
  );

  return (
    <div>
      <h1 className="mb-4">Admin Dashboard</h1>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Tabs defaultActiveKey="quizzes" className="mb-4">
        <Tab eventKey="quizzes" title="Quản lý Quiz">
          <div className="mb-3">
            <Button onClick={handleOpenCreateQuiz}>Tạo Quiz mới</Button>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz._id}>
                  <td>{quiz.title}</td>
                  <td>{quiz.description || '-'}</td>
                  <td>{quiz.isActive ? 'Hoạt động' : 'Không hoạt động'}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => setSelectedQuiz(quiz)}
                    >
                      Xem câu hỏi
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleOpenEditQuiz(quiz)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteQuiz(quiz._id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="questions" title="Quản lý Câu hỏi">
          <div className="mb-3">
            <Button onClick={handleOpenCreateQuestion}>
              Tạo Câu hỏi mới
            </Button>
          </div>
          {selectedQuiz && (
            <Alert variant="info" className="mb-3">
              Đang xem câu hỏi của: <strong>{selectedQuiz.title}</strong>
              <Button
                variant="link"
                size="sm"
                onClick={() => setSelectedQuiz(null)}
              >
                Xem tất cả
              </Button>
            </Alert>
          )}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Câu hỏi</th>
                <th>Quiz</th>
                <th>Điểm</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {(selectedQuiz ? questionsForSelectedQuiz : questions).map(
                (question) => (
                  <tr key={question._id}>
                    <td>{question.questionText}</td>
                    <td>
                      {quizzes.find((q) => q._id === question.quizId)?.title ||
                        '-'}
                    </td>
                    <td>{question.points}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleOpenEditQuestion(question)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question._id)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {/* Quiz Modal */}
      <Modal show={showQuizModal} onHide={() => setShowQuizModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingQuiz ? 'Sửa Quiz' : 'Tạo Quiz mới'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitQuiz}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                value={quizForm.title}
                onChange={(e) =>
                  setQuizForm({ ...quizForm, title: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={quizForm.description}
                onChange={(e) =>
                  setQuizForm({ ...quizForm, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Quiz đang hoạt động"
                checked={!!quizForm.isActive}
                onChange={(e) => setQuizForm({ ...quizForm, isActive: e.target.checked })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowQuizModal(false)}
            >
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editingQuiz ? 'Lưu' : 'Tạo'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Question Modal */}
      <Modal
        show={showQuestionModal}
        onHide={() => setShowQuestionModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingQuestion ? 'Sửa Câu hỏi' : 'Tạo Câu hỏi mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitQuestion}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Chọn Quiz</Form.Label>
              <Form.Select
                value={questionForm.quizId}
                onChange={(e) =>
                  setQuestionForm({ ...questionForm, quizId: e.target.value })
                }
                required
              >
                <option value="">-- Chọn Quiz --</option>
                {quizzes.map((quiz) => (
                  <option key={quiz._id} value={quiz._id}>
                    {quiz.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Câu hỏi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={questionForm.questionText}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    questionText: e.target.value
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Đáp án</Form.Label>
              {questionForm.options.map((option, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Check
                    type="radio"
                    name="correctAnswer"
                    checked={questionForm.correctAnswer === index}
                    onChange={() =>
                      setQuestionForm({
                        ...questionForm,
                        correctAnswer: index
                      })
                    }
                    className="me-2"
                  />
                  <Form.Control
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Đáp án ${index + 1}`}
                    required
                  />
                  {questionForm.options.length > 2 && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => removeOption(index)}
                    >
                      Xóa
                    </Button>
                  )}
                </div>
              ))}
              {questionForm.options.length < 6 && (
                <Button variant="outline-primary" size="sm" onClick={addOption}>
                  + Thêm đáp án
                </Button>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Điểm</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={questionForm.points}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    points: parseInt(e.target.value)
                  })
                }
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowQuestionModal(false)}
            >
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editingQuestion ? 'Lưu' : 'Tạo'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

