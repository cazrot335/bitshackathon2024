import React, { useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const response = await fetch('https://bitshackathon2024.vercel.app/starred');
    
    if (!response.ok) {
      setError('Network response was not ok');
      return;
    }

    const jsonData = await response.json();
    setData(jsonData);
  };

  const loginWithGithub = () => {
    window.location.href = 'https://bitshackathon2024.vercel.app/auth/github';
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={loginWithGithub}>
          Login with GitHub
        </button>
        <button onClick={fetchData}>
          Fetch Data
        </button>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {error && <p>{error}</p>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </header>
    </div>
  );
}

export default App;