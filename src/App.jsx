import { useEffect, useState } from "react";
import { fetchUsers, registerUser } from "./api";
import "./App.css";
import { useAuth } from "./hooks/useAuth";
import useAxios from "./hooks/useAxios";

function App() {
  const { user, login, logout } = useAuth();
  useAxios(user);

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
    resetNotifications();

    try {
      const { status, data } = await registerUser({ username });

      if (status === 200) {
        setSuccess(data.message);
        setUsername("");
      }
    } catch (err) {
      setError(
        `${err.response.status || err.message}: ${
          err.response.data.message || "Sin mensaje"
        }`
      );
    }
  };

  const handleLogin = async () => {
    resetNotifications();

    try {
      await login({ username });
    } catch (err) {
      setError(
        `${err.response.status || err.message}: ${
          err.response.data.message || "Sin mensaje"
        }`
      );
    }
  };

  const handleInput = (event) => {
    setUsername(event.target.value);
  };

  const getUsersList = async (controller) => {
    setUsersError();
    setUsers();

    try {
      const { status, data } = await fetchUsers({
        signal: controller?.signal,
      });

      if (status === 200) setUsers(data);
    } catch (err) {
      if (err.name === "CanceledError") return;

      setUsersError(
        `${err.response?.status || err.message}: ${
          err.response?.data?.message || "Sin mensaje"
        }`
      );
    }
  };

  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();
    getUsersList(controller);

    return () => controller.abort();
  }, [user]);

  return (
    <main className="App">
      <h1>JWT Tokens</h1>
      {error && <p className="notification error">{error}</p>}
      {success && <p className="notification success">{success}</p>}
      {user === null && (
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
          <button type="button" onClick={handleRegister}>
            Registrar
          </button>
          <button type="button" onClick={handleLogin}>
            Iniciar sesión
          </button>
        </>
      )}
      {user && (
        <>
          <p>¡Hola, {user.username || "usuario desconocido"}!</p>
          <button
            type="button"
            onClick={() => {
              setUsers();
              logout();
            }}
          >
            Cerrar sesión
          </button>
        </>
      )}
      {user && (
        <div className="gallery">
          <h2>Galería de Usuarios</h2>
          {usersError && <p className="notification error">{usersError}</p>}
          <button type="button" onClick={getUsersList}>
            Refrescar
          </button>
          {users?.map((aUser) => (
            <p key={aUser.id}>
              {aUser.id}: {aUser.username}
            </p>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;
