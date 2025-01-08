import React, { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";

const Mapbox = ({ ads }) => {
  const [zoom, setZoom] = useState(13);
  const [clusteredMarkers, setClusteredMarkers] = useState([]);
  const mapRef = useRef(null); // Referencia a térképre

  // Formázza az árat
  const formatPrice = (price) =>
    price >= 1000000
      ? `${(price / 1000000).toFixed(1).replace(/\.0$/, "")} M Ft`
      : `${price.toLocaleString("hu-HU")} Ft`;

  // Egyedi ikon létrehozása
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

    const backgroundColor = type === "rent" ? styles.rent : styles.buy;

    return L.divIcon({
      className: "custom-icon",
      html: `
        <div style="${styles.base} ${backgroundColor}">
          ${formatPrice(price)}
        </div>
      `,
    });
  };

  // Csoportosítás
  const handleCluster = () => {
    const threshold = 0.001; // A körzetek közötti távolság küszöbe
    const newClusters = [];

    ads.forEach((item) => {
      if (!item.coords.lat || !item.coords.long) return; // Ha nincs pozíció, ne dolgozzunk vele
      let addedToCluster = false;
      newClusters.forEach((cluster) => {
        const distance = Math.sqrt(
          Math.pow(item.coords.lat - cluster.lat, 2) + Math.pow(item.coords.long - cluster.long, 2)
        );
        if (distance < threshold) {
          cluster.ads.push(item);  // Egyesítjük a hirdetéseket
          cluster.totalPrice += item.price;
          addedToCluster = true;
        }
      });

      if (!addedToCluster) {
        newClusters.push({
          lat: item.coords.lat,
          long: item.coords.long,
          ads: [item],
          totalPrice: item.price,
        });
      }
    });

    setClusteredMarkers(newClusters);
  };

  // Zoom szint figyelése és markerek dinamikus megjelenítése
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on("zoomend", () => {
        setZoom(mapRef.current.getZoom()); // A zoom szint frissítése
      });
    }
  }, []);

  // A markereket csoportosítjuk
  useEffect(() => {
    handleCluster(); // A hirdetéseket mindig csoportosítjuk
  }, [ads]);

  return (
    <MapContainer
      center={[51.505, 4.09]}
      zoom={zoom}
      scrollWheelZoom
      zoomControl={false}
      style={{ width: "100%", height: "100%", zIndex: 1 }}
      ref={mapRef}
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

      {/* Csoportosított marker körök */}
      {clusteredMarkers.map((cluster, index) => {
        return zoom < 12 ? (
          <CircleMarker
            key={index}
            center={[cluster.lat, cluster.long]}
            radius={15}
            color="#FF5733"
            fillOpacity={0.4}
            fillColor="#FF5733"
          >
            <Popup>
              <strong>Total Price:</strong> {formatPrice(cluster.totalPrice)} <br />
              <strong>Number of Ads:</strong> {cluster.ads.length}
            </Popup>
          </CircleMarker>
        ) : null; // Ha közel zoomolunk, ne jelenjen meg a CircleMarker
      })}

      {/* Egyedi markerek, ha elég nagy a zoom */}
      {zoom >= 12 &&
        ads.map(
          (item) =>
            item.coords.lat &&
            item.coords.long && (
              <Marker
                key={item.id}
                position={[item.coords.lat, item.coords.long]}
                icon={createCustomIcon(item.price, item.type)}
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
    </MapContainer>
  );
};

export default Mapbox;
