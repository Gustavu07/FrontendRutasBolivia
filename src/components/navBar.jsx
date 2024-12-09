import { Container, Nav, Navbar, NavDropdown, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Gear } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const MainMenu = () => {
  const navigate = useNavigate();

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("id");
    navigate("/login"); // Redirige al login
  };

  return (
    <Navbar expand="lg" bg="primary" variant="dark" fixed="top" className="w-100">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          {/* Imagen a la izquierda */}
          <img
            src="../../public/abc_Cj6bVmu.png" // Reemplaza con la ruta de tu imagen
            alt="Logo"
            style={{
              width: "40px",
              height: "40px",
              marginRight: "10px",
              borderRadius: "50%",
            }}
          />
          Transitabilidad Bolivia
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/mapa">
              Mapa
            </Nav.Link>
            <Nav.Link as={Link} to="/rutas">
              Rutas
            </Nav.Link>
            <Nav.Link as={Link} to="/municipios">
              Municipios
            </Nav.Link>
            <Nav.Link as={Link} to="/incidentes">
              Incidentes
            </Nav.Link>
          </Nav>

          <Nav className="me-auto">
            <NavDropdown title="Administración" id="admin-nav-dropdown">
              <NavDropdown.Item as={Link} to="/Listadmin">
                Usuarios
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/agregar-incidente">
                Agregar Incidente
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reportar-incidente">
                Reportar Incidente
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* Alineación a la derecha */}
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="dropdown-custom-components">
                <Gear color="white" size={24} /> {/* Icono de tuerca */}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainMenu;
