import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { subscribeToPush } from './push';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('user изменился:', user);
    if (user) {
      subscribeToPush(user.id);
    }
  }, [user]);

  return (
    <div>
      {user ? (
        <Dashboard user={user} onLogout={() => setUser(null)} />
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  );
}

export default App;