import { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("verificador");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/usuarios/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rol }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar el usuario.");
      }

      setSuccess("Usuario registrado exitosamente.");
      setEmail("");
      setPassword("");
      setRol("verificador");
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
            <h2 className="text-center mb-4">Registro de Usuario</h2>
            {success && <Alert variant="success">{success}</Alert>}
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
              <Form.Group className="mb-3" controlId="formRol">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  required
                >
                  <option value="admin">Administrador</option>
                  <option value="verificador">Verificador</option>
                </Form.Select>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Registrar"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
