import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState();

  function resetNotifications() {
    setError();
    setSuccess();
    setUsersError();
  }

  const handleRegister = async () => {
  };

  const handleLogin = () => {
  };

  const handleInput = (event) => {
    setUsername(event.target.value);
  };

  return (
    <main className="App">
      <h1>JWT Tokens</h1>
      {error && <p className="notification error">{error}</p>}
      {success && <p className="notification success">{success}</p>}

      <>
        <p>No has iniciado sesión:</p>
        <form onSubmit={(event) => event.preventDefault()}>
          <label>Usuario:&nbsp;</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleInput}
          />
        </form>
        <button className="secondary" type="button" onClick={handleRegister}>
          Registrar
        </button>
        <button className="primary" type="button" onClick={handleLogin}>
          Iniciar sesión
        </button>
      </>

      <>
        <p>¡Hola, Usuario!</p>
        <button
          className="secondary"
          type="button"
        >
          Cerrar sesión
        </button>
      </>

      <div className="gallery">
        <h2>Galería de Usuarios</h2>
        {usersError && <p className="notification error">{usersError}</p>}
        <button className="primary" type="button">
          Refrescar
        </button>
        <div className="items">
          {users?.map((aUser) => (
            <div className="item" key={aUser.id}>
              {aUser.id}: {aUser.username}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
