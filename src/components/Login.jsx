import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer from './ui/Footer';
import Navbar from './ui/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // За индикација за вчитување
  const navigate = useNavigate();

  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/current_user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Логирање на грешка ако е неуспешно
        // eslint-disable-next-line
        console.log('Response not ok', response);
        const userData = await response.json();
        setError(userData.message || 'Failed to fetch current user');
        return;
      }

      const userData = await response.json();
      // eslint-disable-next-line
      console.log('User data fetched:', userData); // Логирај ја добиената дата
      sessionStorage.setItem('user_data', JSON.stringify(userData));
    } catch (err) {
      // eslint-disable-next-line
      console.error('Error fetching current user:', err);
      setError('Unable to fetch current user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Ресетирај го претходниот error
    setIsLoading(true); // Вклучи индикатор за вчитување

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email,
            password,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Чување на токенот во sessionStorage
        sessionStorage.setItem('auth_token', data.token);
        navigate('/'); // Пренасочување по успешен login

        // Повик за актуелниот корисник
        fetchCurrentUser(data.token);
      } else {
        setError(data.message || 'Login failed'); // Обработка на грешки
      }
    } catch (err) {
      // eslint-disable-next-line
      console.error('Error:', err);
      setError('Something went wrong. Please try again.'); // Генерална грешка
    } finally {
      setIsLoading(false); // Исклучи индикатор за вчитување
    }
  };

  useEffect(() => {
    // Проверка дали веќе имате токен за да не пренасочите повторно на login
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <>
      <Navbar className="active text-white" />
      <div className="background-wallpaper-Login d-flex">
        <div className="position-relative container-fluid container">
          <div className="signup-form position-absolute top-50 start-50 translate-middle">
            <form className="mt-5" onSubmit={handleSubmit}>
              <h2>Login</h2>
              <div className="form-group">
                {/* email */}
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required="required"
                />
              </div>
              {/* password */}
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required="required"
                />
              </div>

              {/* Display error */}
              {error && <div className="text-danger">{error}</div>}

              {/* Footer of form */}
              <div className="form-group d-flex justify-content-between">
                <label htmlFor="rememberMeCheckbox">
                  <input type="checkbox" id="rememberMeCheckbox" />
                  {' '}
                  Remember me
                </label>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              {/* Submit button */}
              <div className="form-group col-12">
                <button type="submit" className="btn btn-info btn-lg col-12">
                  {isLoading ? 'Loading...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="text-center text-white mb-5">
              Don&apos t have an account?
              {' '}
              <Link to="/register" className="text-blue">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
