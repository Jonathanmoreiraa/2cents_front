import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './store';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import theme from './theme';
import { useEffect, useState } from 'react';
import authService from './services/authService';
import Revenues from './pages/Revenues';
import Expenses from './pages/Expenses';
import Savings from './pages/Savings';
import Settings from './pages/Settings';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        await authService.getCurrentUser();
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* TODO: Adicionar a rota de recuperar senha */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path='/receitas' element={<Revenues />} />
              <Route path='/despesas' element={<Expenses />} />
              <Route path='/caixinhas' element={<Savings />} />
              <Route path='/configuracoes' element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
