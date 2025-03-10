import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Footer from './ui/Footer';
import Navbar from './ui/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

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
        // On success, save the token (you can save it in localStorage or state)
        localStorage.setItem('auth_token', data.token);
        navigate('/'); // Redirect to another page (e.g., dashboard)
      } else {
        // Handle errors
        setError(data.status.message || 'Login failed');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

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
                <div className="form-group">
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
              </div>

              {/* Display error */}
              {error && <div className="text-danger">{error}</div>}

              {/* footer of form */}
              <div className="form-group d-flex justify-content-between">
                <label htmlFor="rememberMeCheckbox">
                  <input type="checkbox" id="rememberMeCheckbox" />
                  {' '}
                  Remember me
                </label>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <div className="form-group col-12">
                <button type="submit" className="btn btn-info btn-lg col-12">
                  Sign in
                </button>
              </div>
            </form>

            <div className="text-center text-white mb-5">
              Don&apos;t have an account?
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

// import './Login.css';
// import { Link } from 'react-router-dom';
// import Footer from './ui/Footer';
// import Navbar from './ui/Navbar';

// const Login = () => (
//   <>
//     <Navbar className="active text-white" />
//     <div className="background-wallpaper-Login d-flex">
//       <div className="position-relative container-fluid container">
//         <div className="signup-form position-absolute top-50 start-50 translate-middle">
//           <form className="mt-5">
//             <h2>Login</h2>
//             <div className="form-group">
//               {/* email */}
//               <div className="form-group">
//                 <input
//                   type="email"
//                   className="form-control"
//                   name="email"
//                   placeholder="Email"
//                   required="required"
//                 />
//               </div>
//               {/* password */}
//               <div className="form-group">
//                 <input
//                   type="password"
//                   className="form-control"
//                   name="password"
//                   placeholder="Password"
//                   required="required"
//                 />
//               </div>
//             </div>
//             {/* footer of form */}
//             <div className="form-group d-flex justify-content-between">
//               <label htmlFor="rememberMeCheckbox">
//                 <input type="checkbox" id="rememberMeCheckbox" />
//                 {' '}
//                 Remember me
//               </label>
//               <Link to="/forgot-password">Forgot password?</Link>
//             </div>
//             <div className="form-group  col-12">
//               <button type="submit" className="btn btn-info btn-lg col-12">
//                 Sign in
//               </button>
//             </div>
//           </form>
//           <div className="text-center text-white mb-5">
//             Dont have an account?
//             {' '}
//             <Link to="/register" className="text-blue">
//               Sign up
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>

//     <Footer />
//   </>
// );

// export default Login;
