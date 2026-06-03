import React, { useEffect, useRef, useContext, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ShipmentContext from "@/contexts/ShipmentContext";
import * as turf from "@turf/turf";
import { useRouter } from "next/navigation";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MapComponent = ({ senderCoords, receiverCoords, trackingNumber, currentCoords, currentLocation }) => {
  const mapRef = useRef(null);
  const movingMarkerRef = useRef(null);
  const router = useRouter();
  const { shipmentStatus, setShipmentStatus, shipmentPosition } = useContext(ShipmentContext);
  const [route, setRoute] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [animationFrame, setAnimationFrame] = useState(null);
  
  // Function to create a curved route between two points
  const createCurvedRoute = (start, end) => {
    if (!start || !end) return [];
    
    try {
      // Create a straight line between points
      const straightLine = turf.lineString([start, end]);
      
      // Get the midpoint of the line
      const midpoint = turf.midpoint(turf.point(start), turf.point(end));
      
      // Calculate distance between points
      const distance = turf.distance(turf.point(start), turf.point(end), {units: 'kilometers'});
      
      // Create a curved line by offsetting the midpoint
      // The curve height is proportional to the distance between points
      const curveHeight = Math.min(distance * 0.15, 50); // Limit max curve height
      
      // Calculate bearing between points
      const bearing = turf.bearing(turf.point(start), turf.point(end));
      
      // Calculate perpendicular bearing for the offset direction
      const perpBearing = bearing - 90;
      
      // Create the offset midpoint
      const offsetMidpoint = turf.destination(midpoint, curveHeight, perpBearing, {units: 'kilometers'});
      
      // Create a bezier curve with control points
      const curvedLine = [
        start,
        [start[0] * 0.7 + offsetMidpoint.geometry.coordinates[0] * 0.3, 
         start[1] * 0.7 + offsetMidpoint.geometry.coordinates[1] * 0.3],
        [offsetMidpoint.geometry.coordinates[0], offsetMidpoint.geometry.coordinates[1]],
        [end[0] * 0.3 + offsetMidpoint.geometry.coordinates[0] * 0.7, 
         end[1] * 0.3 + offsetMidpoint.geometry.coordinates[1] * 0.7],
        end
      ];
      
      // Create a more detailed curve by interpolating points
      const numPoints = 50;
      const interpolatedPoints = [];
      
      for (let i = 0; i < numPoints; i++) {
        const t = i / (numPoints - 1);
        const point = bezierPoint(curvedLine, t);
        interpolatedPoints.push(point);
      }
      
      return interpolatedPoints;
    } catch (error) {
      console.error("Error creating curved route:", error);
      // Fallback to straight line if curve creation fails
      return [start, end];
    }
  };
  
  // Bezier curve calculation function
  const bezierPoint = (points, t) => {
    if (points.length === 1) return points[0];
    
    const newPoints = [];
    for (let i = 0; i < points.length - 1; i++) {
      newPoints.push([
        points[i][0] * (1 - t) + points[i + 1][0] * t,
        points[i][1] * (1 - t) + points[i + 1][1] * t
      ]);
    }
    
    return bezierPoint(newPoints, t);
  };
  
  // Function to add route to map
  const addRouteToMap = (coordinates) => {
    if (!mapRef.current) return;
    
    try {
      // Remove existing route layer if it exists
      if (mapRef.current.getLayer('route')) {
        mapRef.current.removeLayer('route');
      }
      
      if (mapRef.current.getSource('route')) {
        mapRef.current.removeSource('route');
      }
      
      // Add the new route layer
      mapRef.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      });
      
      mapRef.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#0078FF',
          'line-width': 4,
          'line-opacity': 0.8,
          'line-dasharray': [1, 1],
        },
      });
      
      // Add a glow effect with a second line
      mapRef.current.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#4DA6FF',
          'line-width': 8,
          'line-opacity': 0.4,
          'line-blur': 2,
        },
      });
      
      // Set the route state
      setRoute(coordinates);
    } catch (error) {
      console.error("Error adding route to map:", error);
    }
  };

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [animationFrame]);
  
  // Function to animate marker along route
  const animateMarker = (timestamp) => {
    if (!movingMarkerRef.current || !route || route.length === 0) return;
    
    // Calculate progress based on shipment status
    let progress = 0;
    
    switch (shipmentStatus) {
      case "Pending":
        progress = 0;
        break;
      case "Pick Up":
        progress = 0.1;
        break;
      case "On Hold":
        progress = 0.3;
        break;
      case "Out for Delivery":
        progress = 0.7;
        break;
      case "Delivered":
        progress = 1;
        break;
      default:
        progress = 0.5;
    }
    
    // Get the point along the route based on progress
    const pointIndex = Math.min(Math.floor(progress * (route.length - 1)), route.length - 1);
    const point = route[pointIndex];
    
    // Update marker position
    if (point && point.length === 2) {
      movingMarkerRef.current.setLngLat(point);
      setCurrentPosition(point);
    }
    
    // Add pulsing effect for the current position
    if (mapRef.current && mapRef.current.getLayer('point-pulse')) {
      mapRef.current.setLayoutProperty('point-pulse', 'visibility', 'visible');
    }
    
    // Continue animation
    setAnimationFrame(requestAnimationFrame(animateMarker));
  };
  
  useEffect(() => {
    if (typeof window !== "undefined" && senderCoords && receiverCoords) {
      // Make a copy of the coordinates to avoid modifying the original values
      const startCoords = [...senderCoords];
      const endCoords = [...receiverCoords];
      
      console.log('Sender coordinates:', startCoords);
      console.log('Receiver coordinates:', endCoords);
      
      // Check if coordinates are valid
      const isValidCoord = coord => {
        return Array.isArray(coord) && coord.length === 2 && 
               !isNaN(coord[0]) && !isNaN(coord[1]);
      };
      
      if (!isValidCoord(startCoords) || !isValidCoord(endCoords)) {
        console.error('Invalid coordinates provided to MapComponent');
        return;
      }
      
      if (!mapRef.current) {
        console.log("Initializing the map");
        mapRef.current = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/light-v10", // Using a lighter style for better route visibility
          center: [(startCoords[0] + endCoords[0]) / 2, (startCoords[1] + endCoords[1]) / 2], // Center between points
          zoom: 3, // Zoom level to show both points
        });
        
        // Add navigation controls
        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Add fullscreen control
        mapRef.current.addControl(new mapboxgl.FullscreenControl());

        // Wait for map to load before adding elements
        mapRef.current.on('load', () => {
          // Add sender marker with custom HTML element for better styling
          const senderMarkerElement = document.createElement('div');
          senderMarkerElement.className = 'custom-marker sender-marker';
          senderMarkerElement.innerHTML = '<div class="marker-icon"><i class="fas fa-shipping-fast"></i></div>';
          senderMarkerElement.style.width = '30px';
          senderMarkerElement.style.height = '30px';
          senderMarkerElement.style.borderRadius = '50%';
          senderMarkerElement.style.backgroundColor = '#3498db';
          senderMarkerElement.style.display = 'flex';
          senderMarkerElement.style.justifyContent = 'center';
          senderMarkerElement.style.alignItems = 'center';
          senderMarkerElement.style.color = 'white';
          senderMarkerElement.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
          
          new mapboxgl.Marker(senderMarkerElement)
            .setLngLat(startCoords)
            .setPopup(new mapboxgl.Popup().setHTML("<h4>Origin</h4><p>Package sent from here</p>"))
            .addTo(mapRef.current);

          // Add receiver marker with custom HTML element
          const receiverMarkerElement = document.createElement('div');
          receiverMarkerElement.className = 'custom-marker receiver-marker';
          receiverMarkerElement.innerHTML = '<div class="marker-icon"><i class="fas fa-map-marker-alt"></i></div>';
          receiverMarkerElement.style.width = '30px';
          receiverMarkerElement.style.height = '30px';
          receiverMarkerElement.style.borderRadius = '50%';
          receiverMarkerElement.style.backgroundColor = '#e74c3c';
          receiverMarkerElement.style.display = 'flex';
          receiverMarkerElement.style.justifyContent = 'center';
          receiverMarkerElement.style.alignItems = 'center';
          receiverMarkerElement.style.color = 'white';
          receiverMarkerElement.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
          
          const receiverMarker = new mapboxgl.Marker(receiverMarkerElement)
            .setLngLat(endCoords)
            .setPopup(new mapboxgl.Popup().setHTML("<h4>Destination</h4><p>Package will be delivered here</p>"))
            .addTo(mapRef.current);

          // Create a curved route between points
          const curvedRouteCoordinates = createCurvedRoute(startCoords, endCoords);
          
          // Add the route to the map
          addRouteToMap(curvedRouteCoordinates);
          
          // Create a moving marker for the package
          const movingMarkerElement = document.createElement('div');
          movingMarkerElement.className = 'custom-marker package-marker';
          movingMarkerElement.innerHTML = '<div class="marker-icon"><i class="fas fa-box"></i></div>';
          movingMarkerElement.style.width = '35px';
          movingMarkerElement.style.height = '35px';
          movingMarkerElement.style.borderRadius = '50%';
          movingMarkerElement.style.backgroundColor = '#2ecc71';
          movingMarkerElement.style.display = 'flex';
          movingMarkerElement.style.justifyContent = 'center';
          movingMarkerElement.style.alignItems = 'center';
          movingMarkerElement.style.color = 'white';
          movingMarkerElement.style.boxShadow = '0 0 15px rgba(46, 204, 113, 0.7)';
          movingMarkerElement.style.zIndex = '10';
          
          movingMarkerRef.current = new mapboxgl.Marker(movingMarkerElement)
            .setLngLat(startCoords)
            .setPopup(new mapboxgl.Popup().setHTML(`<h4>Package</h4><p>Status: ${shipmentStatus}</p>`))
            .addTo(mapRef.current);
          
          // Add pulsing effect for the current position
          mapRef.current.addSource('point', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': [
                {
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Point',
                    'coordinates': startCoords
                  },
                  'properties': {}
                }
              ]
            }
          });
          
          mapRef.current.addLayer({
            'id': 'point-pulse',
            'type': 'circle',
            'source': 'point',
            'paint': {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7, 10,
                16, 20
              ],
              'circle-color': '#2ecc71',
              'circle-opacity': 0.3,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#2ecc71'
            }
          });
          
          // Start the animation
          requestAnimationFrame(animateMarker);
          
          // Current location marker (orange pin) if heldInCountry is set
          if (currentCoords && currentCoords.length === 2) {
            const currentMarkerEl = document.createElement('div');
            currentMarkerEl.style.width = '36px';
            currentMarkerEl.style.height = '36px';
            currentMarkerEl.style.borderRadius = '50%';
            currentMarkerEl.style.backgroundColor = '#f97316';
            currentMarkerEl.style.display = 'flex';
            currentMarkerEl.style.justifyContent = 'center';
            currentMarkerEl.style.alignItems = 'center';
            currentMarkerEl.style.color = 'white';
            currentMarkerEl.style.fontSize = '16px';
            currentMarkerEl.style.boxShadow = '0 0 14px rgba(249,115,22,0.7)';
            currentMarkerEl.style.border = '3px solid white';
            currentMarkerEl.style.zIndex = '20';
            currentMarkerEl.innerHTML = '<i class="fas fa-map-marker-alt"></i>';

            new mapboxgl.Marker(currentMarkerEl)
              .setLngLat(currentCoords)
              .setPopup(new mapboxgl.Popup().setHTML(`<h4 style="margin:0 0 4px">Current Location</h4><p style="margin:0">${currentLocation || 'In Transit'}</p>`))
              .addTo(mapRef.current);
          }

          // Fit map to show both points (+ current location) with padding
          const bounds = new mapboxgl.LngLatBounds()
            .extend(startCoords)
            .extend(endCoords);

          if (currentCoords && currentCoords.length === 2) {
            bounds.extend(currentCoords);
          }

          mapRef.current.fitBounds(bounds, {
            padding: 100,
            duration: 1000
          });
        });
      }
    }
  }, [senderCoords, receiverCoords]);
  
  // Update marker position and popup when shipment status changes
  useEffect(() => {
    if (movingMarkerRef.current) {
      movingMarkerRef.current.setPopup(new mapboxgl.Popup().setHTML(`<h4>Package</h4><p>Status: ${shipmentStatus}</p>`));
      
      // Trigger animation update
      requestAnimationFrame(animateMarker);
    }
  }, [shipmentStatus]);

  return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default MapComponent;
