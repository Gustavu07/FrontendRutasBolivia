import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Modal, Form } from "react-bootstrap";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";

const ListRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        origin: "",
        destination: "",
        status: "libre",
        reason: "",
        coordinates: [],
    });
    const [tempCoordinates, setTempCoordinates] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const mapRef = useMap();

    const fetchRoutes = async () => {
        try {
            const response = await fetch("http://localhost:3000/rutas");
            const data = await response.json();
            setRoutes(data);
        } catch (error) {
            console.error("Error al cargar rutas:", error);
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

        const newPoint = { lat, lng };
        setTempCoordinates((prev) => [...prev, newPoint]);

        setFormData((prev) => ({
            ...prev,
            coordinates: [...prev.coordinates, [lng, lat]],
        }));
    };

    const drawPolyline = () => {
        if (!mapRef || tempCoordinates.length < 2) return;

        const flightPath = new google.maps.Polyline({
            path: tempCoordinates,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

        flightPath.setMap(mapRef);
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    useEffect(() => {
        drawPolyline();
    }, [tempCoordinates]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing
                ? `http://localhost:3000/rutas/${formData.id}`
                : "http://localhost:3000/rutas";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (isEditing) {
                setRoutes((prevRoutes) =>
                    prevRoutes.map((route) => (route.id === data.id ? data : route))
                );
            } else {
                setRoutes((prevRoutes) => [...prevRoutes, data]);
            }

            setShowModal(false);
            setFormData({
                id: null,
                name: "",
                origin: "",
                destination: "",
                status: "libre",
                reason: "",
                coordinates: [],
            });
            setTempCoordinates([]);
            setIsEditing(false);
        } catch (error) {
            console.error("Error al guardar ruta:", error);
        }
    };

    const handleShowModal = (route = null) => {
        if (route) {
            setFormData(route);
            setTempCoordinates(
                route.coordinates.type === "LineString"
                    ? route.coordinates.coordinates.map(([lng, lat]) => ({ lat, lng }))
                    : []
            );
            setIsEditing(true);
        } else {
            setFormData({
                id: null,
                name: "",
                origin: "",
                destination: "",
                status: "libre",
                reason: "",
                coordinates: [],
            });
            setTempCoordinates([]);
            setIsEditing(false);
        }
        setShowModal(true);
    };

    return (
        <Container fluid>
            <Row className="my-4">
                <Col>
                    <h3 className="text-center">Gestión de Rutas</h3>
                    <Button
                        variant="primary"
                        onClick={() => handleShowModal()}
                        className="mb-3"
                    >
                        Agregar Ruta
                    </Button>
                    <Table striped bordered hover responsive>
                        <thead className="table-primary">
                            <tr>
                                <th>Nombre</th>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Estado</th>
                                <th>Razón</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routes.map((route) => (
                                <tr key={route.id}>
                                    <td>{route.name}</td>
                                    <td>{route.origin}</td>
                                    <td>{route.destination}</td>
                                    <td>{route.status}</td>
                                    <td>{route.reason}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleShowModal(route)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(route.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isEditing ? "Editar Ruta" : "Agregar Ruta"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre de la ruta"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Origen</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Origen"
                                        value={formData.origin}
                                        onChange={(e) =>
                                            setFormData({ ...formData, origin: e.target.value })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Destino</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Destino"
                                        value={formData.destination}
                                        onChange={(e) =>
                                            setFormData({ ...formData, destination: e.target.value })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div style={{ height: "400px" }}>
                            <Map
                                mapId="bf51a910020fa25a"
                                style={{ width: "100%", height: "100%" }}
                                defaultCenter={{
                                    lat: -17.78302580071355,
                                    lng: -63.180359841218795,
                                }}
                                defaultZoom={6}
                                onClick={handleMapClick}
                            >
                                {tempCoordinates.map((point, index) => (
                                    <Marker key={index} position={point} />
                                ))}
                            </Map>
                        </div>
                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-3 w-100"
                        >
                            {isEditing ? "Actualizar Ruta" : "Guardar Ruta"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ListRoutes;
