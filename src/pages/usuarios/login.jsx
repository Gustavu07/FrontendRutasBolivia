import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión.");
      }

      localStorage.setItem("token", data.token); // Guarda el token en localStorage
      alert("Inicio de sesión exitoso");

      if (data.user.rol === "admin") {
        navigate("/Listadmin"); // Redirige a la vista de administrador
      } else {
        navigate("/rutas"); // Redirige a otra vista según el rol
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <div className="p-4 shadow rounded bg-white">
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingresa tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Ingresar"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
