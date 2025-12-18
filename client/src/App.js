import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { loadUser } from './actions/authActions';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import QuizList from './components/quiz/QuizList';
import Quiz from './components/quiz/Quiz';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-90">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="my-4">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <QuizList />
              </PrivateRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <PrivateRoute>
                <Quiz />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;

