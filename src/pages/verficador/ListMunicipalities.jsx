import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Modal, Form } from "react-bootstrap";
import { Map, Marker } from "@vis.gl/react-google-maps";

const ListMunicipalities = () => {
    const [municipalities, setMunicipalities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: "", coordinates: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [tempCoordinates, setTempCoordinates] = useState(null);

    const fetchMunicipalities = async () => {
        try {
            const response = await fetch("http://localhost:3000/municipios");
            const data = await response.json();

            if (Array.isArray(data)) {
                setMunicipalities(data);
            } else {
                console.error("El JSON devuelto no es un array:", data);
                setMunicipalities([]);
            }
        } catch (error) {
            console.error("Error al cargar municipios:", error);
        }
    };

    // Función para manejar el clic en el mapa
    const handleMapClick = (e) => {
        let latLng = e.latLng || e.detail?.latLng;
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

        // Actualiza el campo de coordenadas automáticamente
        setFormData((prev) => ({
            ...prev,
            coordinates: `${lng}, ${lat}`,
        }));
    };

    // Función para manejar el envío del formulario (crear o editar)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing
                ? `http://localhost:3000/municipios/${formData.id}`
                : "http://localhost:3000/municipios";

            const location = {
                type: "Point",
                coordinates: formData.coordinates.split(",").map(Number),
            };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formData.name, location }),
            });
            const data = await response.json();

            if (isEditing) {
                setMunicipalities(
                    municipalities.map((municipality) =>
                        municipality.id === data.id ? data : municipality
                    )
                );
            } else {
                setMunicipalities([...municipalities, data]);
            }

            setShowModal(false);
            setFormData({ id: null, name: "", coordinates: "" });
            setIsEditing(false);
        } catch (error) {
            console.error("Error al guardar municipio:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:3000/municipios/${id}`, { method: "DELETE" });
            setMunicipalities(municipalities.filter((municipality) => municipality.id !== id));
        } catch (error) {
            console.error("Error al eliminar municipio:", error);
        }
    };

    const handleShowModal = (municipality = null) => {
        if (municipality) {
            setFormData({
                id: municipality.id,
                name: municipality.name,
                coordinates: municipality.location.coordinates.join(", "),
            });
            setIsEditing(true);
        } else {
            setFormData({ id: null, name: "", coordinates: "" });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    useEffect(() => {
        fetchMunicipalities();
    }, []);

    return (
        <Container fluid>
            <Row className="my-4">
                <Col md={4} className="mb-3">
                    <h3 className="text-primary">Gestión de Municipios</h3>
                    <Button variant="primary" onClick={() => handleShowModal()} className="mb-3 w-100">
                        Agregar Municipio
                    </Button>
                    <Table striped bordered hover responsive className="shadow-sm">
                        <thead className="table-primary">
                            <tr>
                                <th>Nombre</th>
                                <th>Coordenadas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {municipalities.map((municipality) => (
                                <tr key={municipality.id}>
                                    <td>{municipality.name}</td>
                                    <td>{municipality.location.coordinates.join(", ")}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="mx-1"
                                            onClick={() => handleShowModal(municipality)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(municipality.id)}
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
                            {municipalities.map((municipality) => (
                                <Marker
                                    key={municipality.id}
                                    position={{
                                        lat: municipality.location.coordinates[1],
                                        lng: municipality.location.coordinates[0],
                                    }}
                                />
                            ))}
                        </Map>
                    </div>
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Editar Municipio" : "Agregar Municipio"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre del municipio"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
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

export default ListMunicipalities;
