import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

//aqui se hace los incidentes publicos

const IncidentForm = () => {
    const navigate = useNavigate();
    const [detalle, setDetalle] = useState("");
    const [FotoIncidente, setFotoIncidente] = useState(null);
    const [validated, setValidated] = useState(false);

    const onChangeFoto = (e) => {
        setFotoIncidente(e.target.files[0]);
    };

    const onGuardarClick = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setValidated(true);

        if (form.checkValidity() === false) {
            e.stopPropagation();
            return;
        }

        try {
            const incidenteData = {
                detalle: detalle,
            };

            const incidenteResponse = await axios.post(
                "http://localhost:3000/solicitudIncidente",
                incidenteData
            );

            const incidenteId = incidenteResponse.data.id;
            if (FotoIncidente) {
                const formData = new FormData();
                formData.append("imagen", FotoIncidente);

                await axios.post(
                    `http://localhost:3000/solicitudIncidente/${incidenteId}/imagen`,
                    formData
                );
            }

            alert("Incidente guardado con éxito");
            navigate(`/`);
        } catch (error) {
            console.error("Error al guardar el incidente:", error);
            alert("Ocurrió un error al guardar el incidente.");
        }
    };

    return (
        <Container>
            <Row className="mt-3 mb-3">
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>Foto del incidente</h2>
                            </Card.Title>
                            <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                                <Form.Group>
                                    <Form.Label>Seleccione una imagen:</Form.Label>
                                    <Form.Control required type="file" onChange={onChangeFoto} />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor seleccione un archivo.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Detalle del lugar del incidente:</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        value={detalle}
                                        onChange={(e) => setDetalle(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor ingrese un detalle para el incidente.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mt-3">
                                    <Button type="submit">Guardar datos</Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default IncidentForm;
