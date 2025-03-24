import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";

const Mapbox = ({ ads }) => {
  const formatPrice = (price) =>
    price >= 1000000
      ? `${(price / 1000000).toFixed(1).replace(/\.0$/, "")} M Ft`
      : `${price.toLocaleString("hu-HU")} Ft`;

  const calculateCenter = (ads) => {
    const validCoords = ads.filter(
      (item) => item.coords.lat && item.coords.lng
    );
    if (validCoords.length === 0) return [47.50748265850585, 19.04492472631566];

    const latSum = validCoords.reduce((sum, item) => sum + item.coords.lat, 0);
    const lngSum = validCoords.reduce(
      (sum, item) => sum + item.coords.lng,
      0
    );

    return [latSum / validCoords.length, lngSum / validCoords.length];
  };

  const center = calculateCenter(ads);

  const createCustomIcon = (price, type) => {
    const styles = {
      base: `
        display: inline-block;
        padding: 6px 8px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
      `,
      rent: "background-color: #FEF3C7; color: #F59E0B;",
      buy: "background-color: #D1FAE5; color: #10B981;",
    };

    const backgroundColor = type === "Rent" ? styles.rent : styles.buy;

    return L.divIcon({
      className: "custom-icon",
      html: `
        <div style="${styles.base} ${backgroundColor}">
          ${formatPrice(price)}
        </div>
      `,
    });
  };

  const customClusterIcon = function (cluster) {
    return L.divIcon({
      html: `<span style="background-color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; width: 33px; height: 33px;">${cluster.getChildCount()}</span>`,
      className: "custom-cluster-icon",
      iconSize: L.point(33, 33, true),
    });
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ width: "100%", height: "100%", zIndex: 1 }}
    >
      <TileLayer
        url={process.env.REACT_APP_MAPBOX_URL}
        attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ©
                      <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>
                      <strong>
                      <a href="https://labs.mapbox.com/contribute/" target="_blank">
                      Improve this map
                      </a>
                      </strong>'
      />
      <MarkerClusterGroup
        showCoverageOnHover={false}
        maxClusterRadius={60} // A csoportosítás távolsága
        spiderfyOnMaxZoom={true} // Az egyedi markerek széthúzása zoomoláskor
        disableClusteringAtZoom={16} // Zoom szint, ahol már nem csoportosít
        iconCreateFunction={customClusterIcon}
        polygonOptions={{
          fillColor: "#ffffff",
          color: "#000000",
          weight: 5,
          opacity: 1,
          fillOpacity: 0.8,
        }}
      >
        {ads.map(
          (item) =>
            item.coords.lat &&
            item.coords.lng && (
              <Marker
                key={item.id}
                position={[item.coords.lat, item.coords.lng]}
                icon={createCustomIcon(item.price, item.listtype)}
              >
                <Popup>
                  <div style={{ width: 50 }}>
                    <img
                      src={item.images[0]}
                      alt="kép"
                      style={{ width: "100%", borderRadius: 8 }}
                    />
                  </div>
                  <div>
                    <strong>{formatPrice(item.price)}</strong>
                    <p>{item.description}</p>
                  </div>
                </Popup>
              </Marker>
            )
        )}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Mapbox;