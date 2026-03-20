import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { vendorLocations } from "@/data/vendorLocations";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapPin } from "lucide-react";
import { renderToString } from "react-dom/server";

export default function VendorMap() {

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, { marker: L.Marker; circle: L.Circle }>>(new Map());

  useEffect(() => {

    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current, {
      center: [39.8283, -98.5795],
      zoom: 4,
      minZoom: 3,
      maxZoom: 18
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(map.current);

    vendorLocations.forEach((location) => {

      if (!map.current) return;

      const icon = L.divIcon({
        html: renderToString(
          <MapPin size={28} color="red" strokeWidth={2.5} />
        ),
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 28]
      });

      const marker = L.marker([location.lat, location.lng], { icon }).addTo(map.current);

      const circle = L.circle([location.lat, location.lng], {
        radius: 40000,
        color: "red",
        weight: 2,
        opacity: 0.7,
        fillColor: "red",
        fillOpacity: 0.12
      }).addTo(map.current);

      const popup = L.popup().setContent(`
        <div style="padding:8px">
          <strong>${location.state}</strong><br/>
          City: ${location.city}<br/>
          Coverage: ${location.radiusKm}km
        </div>
      `);

      marker.bindPopup(popup);

      markersRef.current.set(location.id, { marker, circle });

    });

    map.current.on("zoomend", () => {

      const zoom = map.current?.getZoom() || 4;

      markersRef.current.forEach(({ circle }) => {

        let radius = 40000;

        if (zoom > 10) radius = 15000;
        if (zoom > 12) radius = 8000;
        if (zoom > 14) radius = 3000;

        circle.setRadius(radius);

      });

    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };

  }, []);

  return (

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full"
    >

      <div
        ref={mapContainer}
        className="w-full h-[600px] rounded-xl border border-red-500/30 overflow-hidden shadow-xl"
      />

    </motion.div>

  );

}