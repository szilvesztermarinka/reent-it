import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

const Mapbox = () => {
    return (
            <MapContainer center={[51.505, 4.09]} zoom={13} scrollWheelZoom={true} zoomControl={false} style={{ width: "100%", height: "100%", zIndex: 1 }}>
                <TileLayer
                    url={process.env.REACT_APP_MAPBOX_URL}
                    attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ©
                      <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>
                      <strong>
                      <a href="https://labs.mapbox.com/contribute/" target="_blank">Improve this map</a>
                      </strong>'
                />
            </MapContainer>
    );
};

export default Mapbox;
