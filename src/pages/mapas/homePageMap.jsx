import { Col, Container, Row, Button } from "react-bootstrap";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainMenu from "../../components/navBar";

const HomePageMapa = () => {
    const map = useMap();
    const [markerArray, setMarkerArray] = useState([]);
    const [municipalities, setMunicipalities] = useState([]); // Municipios
    const [filter, setFilter] = useState(null);
    const [incidentes, setIncidentes] = useState([]); // Incidentes
    const navigate = useNavigate();

    // Cargar municipios desde el backend
    const fetchMunicipalities = async () => {
        try {
            const response = await fetch("http://localhost:3000/municipios");
            const data = await response.json();
            setMunicipalities(data);
        } catch (error) {
            console.error("Error al cargar municipios:", error);
        }
    };

    // Cargar incidentes desde el backend
    const fetchIncidentes = async () => {
        try {
            const response = await fetch("http://localhost:3000/solicitudIncidente");
            const data = await response.json();
            setIncidentes(data);
        } catch (error) {
            console.error("Error al cargar incidentes:", error);
        }
    };

    useEffect(() => {
        fetchMunicipalities();
        fetchIncidentes();
    }, []);

    useEffect(() => {
        if (!map || markerArray.length < 2) return;

        const flightPath = new google.maps.Polyline({
            path: markerArray,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

        flightPath.setMap(map);
    }, [markerArray, map]);

    const handleFilterClick = (filterType) => {
        console.log(`Filtro seleccionado: ${filterType}`);
        setFilter(filterType);
    };

    const handleReportClick = () => {
        navigate("/reportar-incidente");
    };

    return (
        <>
            {/* Navbar */}
            <MainMenu />

            <div style={{ marginTop: "70px" }}>
                <div
                    style={{
                        backgroundColor: "#f8f9fa",
                        padding: "10px 20px",
                        borderBottom: "2px solid #ddd",
                    }}
                >
                    <Container fluid>
                        <Row>
                            <Col md={12}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div style={{ display: "flex", gap: "15px" }}>
                                        <button
                                            style={{
                                                color: "#FFA500",
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleFilterClick("desvios")}
                                        >
                                            • Transitable con desvíos
                                        </button>
                                        <button
                                            style={{
                                                color: "#00BFFF",
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleFilterClick("conflictos")}
                                        >
                                            • No transitable por conflictos sociales
                                        </button>
                                        <button
                                            style={{
                                                color: "#00008B",
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleFilterClick("restriccion")}
                                        >
                                            • Restricción vehicular
                                        </button>
                                        <button
                                            style={{
                                                color: "#FF0000",
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleFilterClick("trafico_cerrado")}
                                        >
                                            • No transitable tráfico cerrado
                                        </button>
                                        <button
                                            style={{
                                                color: "#008000",
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleFilterClick("restriccion_especial")}
                                        >
                                            • Restricción vehicular, especial
                                        </button>
                                    </div>
                                    <div>
                                        <Button variant="primary" onClick={handleReportClick}>
                                            Reportar Incidente
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <Container fluid style={{ marginTop: "10px" }}>
                    <Row>
                        <Col md={3}>
                            {incidentes.map((incidente) => (
                                <div
                                    key={incidente.id}
                                    style={{
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        marginBottom: "10px",
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <img
                                        src={`http://localhost:3000/imagenes/solicitudIncidente/${incidente.id}.jpg`}
                                        alt="Imagen del incidente"
                                        style={{
                                            width: "100%",
                                            height: "120px",
                                            objectFit: "cover",
                                            borderRadius: "5px",
                                        }}
                                    />
                                    <h5 style={{ marginTop: "10px" }}>{incidente.detalle}</h5>
                                    <Button
                                        variant="danger"
                                        style={{ marginTop: "5px" }}
                                        onClick={() => {
                                            console.log("Ver en mapa:", incidente);
                                        }}
                                    >
                                        Ver en mapa
                                    </Button>
                                </div>
                            ))}
                        </Col>

                        <Col md={9}>
                            <Map
                                onClick={(e) => {
                                    console.log(e.detail.latLng);
                                    const newArray = [...markerArray, e.detail.latLng];
                                    setMarkerArray(newArray);
                                }}
                                mapId={"bf51a910020fa25a"}
                                style={{ width: "100%", height: "600px" }}
                                defaultCenter={{
                                    lat: -17.78302580071355,
                                    lng: -63.180359841218795,
                                }}
                                defaultZoom={6}
                                gestureHandling={"greedy"}
                                disableDefaultUI={true}
                            >
                                {markerArray.map((marker, index) => (
                                    <Marker key={index} position={marker} />
                                ))}
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
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default HomePageMapa;
