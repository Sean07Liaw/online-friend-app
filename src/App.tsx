import { useState, useEffect } from 'react';
import Login from './components/Login';
import FriendsList from './components/FriendsList';
import { AnimatePresence, motion } from 'motion/react';
import { api } from './services/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.getMe()
        .then(user => {
          setUsername(user.username);
          setIsLoggedIn(true);
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (name: string, token: string) => {
    localStorage.setItem('accessToken', token);
    setUsername(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setUsername('');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Login onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="friends"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FriendsList 
              username={username} 
              onLogout={handleLogout} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
