import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FetchUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:3000/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <div>No user data found.</div>;
  }

  return console.log('User data:', user);
//   return (
//     <div>
//       <h2>Current User</h2>
//       <p>Email: {user.email}</p>
//       <p>ID: {user.id}</p>
//     </div>
//   );
};

export default FetchUser;
