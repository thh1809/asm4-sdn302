import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { signup } from '../../actions/authActions';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const { username, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    dispatch(signup(username, email, password));
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-90">
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <h2>Đăng ký</h2>
          </Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên người dùng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên người dùng"
                name="username"
                value={username}
                onChange={onChange}
                required
                minLength={3}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                name="password"
                value={password}
                onChange={onChange}
                required
                minLength={6}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập lại mật khẩu"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Đăng ký
            </Button>
          </Form>
          <div className="text-center mt-3">
            <small>
              Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Signup;

