import { useState, useEffect } from "react";

export function UserSelector() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("currentUser");
    if (stored) setUsername(stored);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    sessionStorage.setItem("currentUser", username.trim());
    alert(`Usuario actual: ${username}`);
  };

  return (
    <form
      className="d-flex align-items-center gap-2"
      onSubmit={handleSave}
    >
      <label className="form-label mb-0">Usuario:</label>
      <input
        className="form-control"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="ej. fabian"
        required
      />
      <button className="btn btn-dark" type="submit">
        Guardar
      </button>
    </form>
  );
}
