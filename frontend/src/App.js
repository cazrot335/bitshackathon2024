import React, { useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const response = await fetch('https://bitshackathon2024.vercel.app/starred');
    const jsonData = await response.json();
    setData(jsonData);
  };

  return (
    <div className="App">
      <header className="App-header">
        <a href="https://bitshackathon2024.vercel.app/auth/github">Login with GitHub</a>
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
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </header>
    </div>
  );
}

export default App;