import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../actions/authActions';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          📝 Quiz App
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/">
                  Quizzes
                </Nav.Link>
                {user?.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin">
                    Admin Dashboard
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <BootstrapNavbar.Text className="me-3">
                  Xin chào, <strong>{user?.username}</strong>
                  {user?.role === 'admin' && (
                    <span className="badge bg-warning text-dark ms-2">Admin</span>
                  )}
                </BootstrapNavbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Đăng nhập
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Đăng ký
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;

