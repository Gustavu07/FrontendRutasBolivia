import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Modal, Form } from "react-bootstrap";
import { Map, Marker } from "@vis.gl/react-google-maps";

const ListIncidents = () => {
    const [incidents, setIncidents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: null, description: "", type: "", coordinates: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [tempCoordinates, setTempCoordinates] = useState(null);

    const incidentTypes = [
        "Transitable con desvíos y/o horarios de circulación",
        "No transitable por conflictos sociales",
        "Restricción vehicular",
        "No transitable tráfico cerrado",
        "Restricción vehicular, especial",
    ];

    const fetchIncidents = async () => {
        try {
            const response = await fetch("http://localhost:3000/incidentes");
            const data = await response.json();

            if (Array.isArray(data)) {
                setIncidents(data);
            } else {
                console.error("El JSON devuelto no es un array:", data);
                setIncidents([]);
            }
        } catch (error) {
            console.error("Error al cargar incidentes:", error);
        }
    };

    const handleMapClick = (e) => {
        const latLng = e.latLng || e.detail?.latLng;
        if (!latLng) {
            console.error("No se pudo obtener latLng del evento.");
            return;
        }

        const lat = typeof latLng.lat === "function" ? latLng.lat() : latLng.lat;
        const lng = typeof latLng.lng === "function" ? latLng.lng() : latLng.lng;

        if (lat === undefined || lng === undefined) {
            console.error("No se pudo obtener latitud o longitud.");
            return;
        }

        const newCoordinates = { lat, lng };
        console.log("Nuevas coordenadas seleccionadas:", newCoordinates);

        setTempCoordinates(newCoordinates);

        setFormData((prev) => ({
            ...prev,
            coordinates: `${lng}, ${lat}`,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing
                ? `http://localhost:3000/incidentes/${formData.id}`
                : "http://localhost:3000/incidentes";

            const location = {
                type: "Point",
                coordinates: formData.coordinates.split(",").map(Number),
            };

            const body = {
                description: formData.description,
                type: formData.type,
                location,
            };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await response.json();

            if (isEditing) {
                setIncidents(
                    incidents.map((incident) =>
                        incident.id === data.id ? data : incident
                    )
                );
            } else {
                setIncidents([...incidents, data]);
            }

            setShowModal(false);
            setFormData({ id: null, description: "", type: "", coordinates: "" });
            setIsEditing(false);
        } catch (error) {
            console.error("Error al guardar incidente:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:3000/incidentes/${id}`, { method: "DELETE" });
            setIncidents(incidents.filter((incident) => incident.id !== id));
        } catch (error) {
            console.error("Error al eliminar incidente:", error);
        }
    };

    const handleShowModal = (incident = null) => {
        if (incident) {
            setFormData({
                id: incident.id,
                description: incident.description,
                type: incident.type,
                coordinates: incident.location.coordinates.join(", "),
            });
            setIsEditing(true);
        } else {
            setFormData({ id: null, description: "", type: "", coordinates: "" });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    return (
        <Container fluid>
            <Row className="my-4">
                <Col md={4} className="mb-3">
                    <h3 className="text-primary">Gestión de Incidentes</h3>
                    <Button variant="primary" onClick={() => handleShowModal()} className="mb-3 w-100">
                        Agregar Incidente
                    </Button>
                    <Table striped bordered hover responsive className="shadow-sm">
                        <thead className="table-primary">
                            <tr>
                                <th>Descripción</th>
                                <th>Tipo</th>
                                <th>Coordenadas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidents.map((incident) => (
                                <tr key={incident.id}>
                                    <td>{incident.description}</td>
                                    <td>{incident.type}</td>
                                    <td>{incident.location.coordinates.join(", ")}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="mx-1"
                                            onClick={() => handleShowModal(incident)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(incident.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
                <Col md={8}>
                    <div className="shadow-sm rounded overflow-hidden">
                        <Map
                            mapId="bf51a910020fa25a"
                            style={{ width: "100%", height: "500px" }}
                            defaultCenter={{ lat: -17.78302580071355, lng: -63.180359841218795 }}
                            defaultZoom={6}
                        >
                            {incidents.map((incident) => (
                                <Marker
                                    key={incident.id}
                                    position={{
                                        lat: incident.location.coordinates[1],
                                        lng: incident.location.coordinates[0],
                                    }}
                                />
                            ))}
                        </Map>
                    </div>
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Editar Incidente" : "Agregar Incidente"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Descripción del incidente"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipo de Incidente</Form.Label>
                            <Form.Select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                required
                            >
                                <option value="">Selecciona el tipo de incidente</option>
                                {incidentTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Coordenadas</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ejemplo: -63.185, -17.785"
                                value={formData.coordinates}
                                onChange={(e) =>
                                    setFormData({ ...formData, coordinates: e.target.value })
                                }
                                readOnly
                            />
                        </Form.Group>
                        <div className="mb-3" style={{ height: "400px" }}>
                            <Map
                                mapId="bf51a910020fa25a"
                                style={{ width: "100%", height: "100%" }}
                                defaultCenter={{ lat: -17.78302580071355, lng: -63.180359841218795 }}
                                defaultZoom={6}
                                onClick={handleMapClick}
                            >
                                {tempCoordinates && (
                                    <Marker
                                        position={{
                                            lat: tempCoordinates.lat,
                                            lng: tempCoordinates.lng,
                                        }}
                                    />
                                )}
                            </Map>
                        </div>
                        <Button variant="primary" type="submit" className="w-100">
                            {isEditing ? "Actualizar" : "Guardar"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ListIncidents;
