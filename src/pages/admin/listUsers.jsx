import { useEffect, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavMenu from "../../components/navBar"; // Asegúrate de importar correctamente el NavBar

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate(); // Hook para redirigir

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay un token válido.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener los usuarios.");
      }

      setUsers(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/usuarios/${selectedUser.id}/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cambiar la contraseña.");
      }

      alert("Contraseña actualizada exitosamente.");
      setShowPasswordModal(false);
      setNewPassword("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleShowPasswordModal = (user) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Usuario eliminado exitosamente.");
      fetchUsers();
    } catch (error) {
      alert("Error al eliminar el usuario.");
    }
  };

  const handleCreateUser = () => {
    navigate("/register"); // Redirige al componente de registro
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <NavMenu />

      <div className="container mt-5" style={{ paddingTop: "70px" }}>
        {/* Se agrega margen superior para evitar que el título choque con el NavBar */}
        <h1 className="mb-4">Lista de Usuarios</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Botón para crear un nuevo usuario */}
        <Button
          variant="primary"
          className="mb-3"
          onClick={handleCreateUser}
        >
          Crear Usuario
        </Button>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowPasswordModal(user)}
                    >
                      Cambiar Contraseña
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal
          show={showPasswordModal}
          onHide={() => setShowPasswordModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Cambiar Contraseña</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña Nueva</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleChangePassword}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ListUsers;
