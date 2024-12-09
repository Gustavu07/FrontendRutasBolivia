import { Col, Container, Row } from "react-bootstrap";
import { AdvancedMarker, Map, Marker, Pin, useMap } from "@vis.gl/react-google-maps";
import motorcycle from '/motorcycle.png';
import { useEffect, useState } from "react";

//aqui se tienen que hacer las lineas de la ruta

const RutaMapa = () => {
    const map = useMap();
    const [markerArray, setMarkerArray] = useState([]);
    const [filter, setFilter] = useState(null);

    useEffect(() => {
        if (!map || markerArray.length < 2) return;

        // eslint-disable-next-line no-undef
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
        // Aquí puedes implementar la lógica de filtrado
    };

    return (
        <>
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
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <img
                                        src="../../../public/abc_Cj6bVmu.png" // Cambia esto por la ruta a tu logo
                                        alt="Logo ABC"
                                        style={{ height: "50px", marginRight: "10px" }}
                                    />
                                    <h4 style={{ margin: 0 }}>Transitabilidad Actual</h4>
                                </div>
                                <div style={{ display: "flex", gap: "15px" }}>
                                    <button
                                        style={{ color: "#FFA500", background: "none", border: "none", cursor: "pointer" }}
                                        onClick={() => handleFilterClick("desvios")}
                                    >
                                        • Transitable con desvíos
                                    </button>
                                    <button
                                        style={{ color: "#00BFFF", background: "none", border: "none", cursor: "pointer" }}
                                        onClick={() => handleFilterClick("conflictos")}
                                    >
                                        • No transitable por conflictos sociales
                                    </button>
                                    <button
                                        style={{ color: "#00008B", background: "none", border: "none", cursor: "pointer" }}
                                        onClick={() => handleFilterClick("restriccion")}
                                    >
                                        • Restricción vehicular
                                    </button>
                                    <button
                                        style={{ color: "#FF0000", background: "none", border: "none", cursor: "pointer" }}
                                        onClick={() => handleFilterClick("trafico_cerrado")}
                                    >
                                        • No transitable tráfico cerrado
                                    </button>
                                    <button
                                        style={{ color: "#008000", background: "none", border: "none", cursor: "pointer" }}
                                        onClick={() => handleFilterClick("restriccion_especial")}
                                    >
                                        • Restricción vehicular, especial
                                    </button>
                                </div>
                                <div>
                                    <button className="btn btn-outline-secondary me-2">Ver listado de reportes</button>
                                    <button className="btn btn-outline-secondary">Detalle por departamento</button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Contenedor del Mapa */}
            <Container fluid style={{ marginTop: "10px" }}>
                <Row>
                    <Col md={12}>
                        <Map
                            onClick={(e) => {
                                console.log(e.detail.latLng);
                                const newArray = [...markerArray, e.detail.latLng];
                                setMarkerArray(newArray);
                            }}
                            mapId={'bf51a910020fa25a'}
                            style={{ width: '100%', height: '600px' }}
                            defaultCenter={{ lat: -17.78302580071355, lng: -63.180359841218795 }}
                            defaultZoom={6}
                            gestureHandling={'greedy'}
                            disableDefaultUI={true}
                        >
                            {markerArray.map((marker, index) => (
                                <AdvancedMarker
                                    key={index}
                                    position={marker}
                                    title={'AdvancedMarker with custom html content.'}
                                >
                                    <div
                                        style={{
                                            width: 16,
                                            height: 16,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            background: '#1dbe80',
                                            border: '2px solid #0e6443',
                                            borderRadius: '50%',
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    ></div>
                                </AdvancedMarker>
                            ))}
                            <Marker
                                position={{ lat: -17.78302580071355, lng: -63.180359841218795 }}
                                clickable={true}
                                onClick={() => alert('marker was clicked!')}
                                title={'clickable google.maps.Marker'}
                            />
                            <AdvancedMarker
                                position={{ lat: -17.768895040004235, lng: -63.182911542255376 }}
                                title={'AdvancedMarker with customized pin.'}
                            >
                                <Pin
                                    background={'#22ccff'}
                                    borderColor={'#1e89a1'}
                                    glyphColor={'#0f677a'}
                                ></Pin>
                            </AdvancedMarker>
                            <AdvancedMarker
                                position={{ lat: -17.76014242465274, lng: -63.1784029425748 }}
                                title={'AdvancedMarker with custom html content.'}
                            >
                                <div
                                    style={{
                                        width: 16,
                                        height: 16,
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        background: '#1dbe80',
                                        border: '2px solid #0e6443',
                                        borderRadius: '50%',
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                ></div>
                            </AdvancedMarker>
                            <AdvancedMarker
                                position={{ lat: -17.758930001314468, lng: -63.17814554135265 }}
                                title={'AdvancedMarker with image.'}
                            >
                                <img src={motorcycle} alt="motorcycle" style={{ width: 32, height: 32 }} />
                            </AdvancedMarker>
                        </Map>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default RutaMapa;
