import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { Coords } from "../types/coords";

interface MapProps {
  keyword: string; // Keyword entered by user
  markers: Coords[]; // Markers to display
  setMarkers: React.Dispatch<React.SetStateAction<Coords[]>>; // Function to update markers
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const Map: React.FC<MapProps> = ({ keyword, markers, setMarkers }) => {
  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState<number | null>(
    null
  ); // Track hovered marker index
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 50.4501, // Default latitude (fallback)
    lng: 30.5234, // Default longitude (fallback)
  });

  const [placesData, setPlacesData] = useState<any[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Trigger the search whenever the keyword changes
  useEffect(() => {
    if (!keyword) return; // No search is performed if no keyword

    const searchPlaces = () => {
      const map = new google.maps.Map(document.createElement("div")); // Creating a temporary map to use PlacesService
      const service = new google.maps.places.PlacesService(map);

      const request = {
        location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
        radius: 1500, // Search radius in meters
        keyword: keyword, // User search term
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const newMarkers = results.map((place) => ({
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0,
            name: place.name || "", // Place name
            address: place.vicinity || "", // Place address
            rating: place.rating || "N/A", // Rating (optional)
            placeId: place.place_id || "", // Unique place ID
            website: place.website || "No website", // Website (optional)
          }));

          console.log(results);

          const newPlacesData = results.map((place) => ({
            name: place.name,
            address: place.vicinity,
            rating: place.rating,
            placeId: place.place_id,
            website: place.website,
          }));

          setMarkers(newMarkers); // Update markers
          setPlacesData(newPlacesData); // Update places data
        } else {
          console.error("PlacesService error:", status);
        }
      });
    };

    searchPlaces(); // Call the search function
  }, [keyword, userLocation, setMarkers]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation}
        zoom={12}
      >
        {markers.map((marker, idx) => (
          <Marker
            key={marker.placeId}
            position={{ lat: marker.lat, lng: marker.lng }}
            onMouseOver={() => setHoveredMarkerIndex(idx)} // Set the index when hovered
            onMouseOut={() => setHoveredMarkerIndex(null)} // Clear the index when mouse leaves
          >
            {hoveredMarkerIndex === idx && (
              <InfoWindow>
                <div>
                  <h4>{marker.name}</h4>
                  <p>Address: {marker.address}</p>
                  <p>Rating: {marker.rating}</p>
                  <p>
                    Website:{" "}
                    <a
                      href={marker.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {marker.website !== "No website"
                        ? marker.website
                        : "Not available"}
                    </a>
                  </p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>

      {/* Displaying the places list below the map */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Places Found:
        </Typography>
        <Box sx={{ display: "grid", gap: 3 }}>
          {placesData.map((place, idx) => (
            <Card key={idx} sx={{ padding: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {place.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginBottom: 1 }}
                >
                  {place.address}
                </Typography>
                {place.rating && (
                  <Typography variant="body2" color="textSecondary">
                    Rating: {place.rating} ★
                  </Typography>
                )}
                {place.website && (
                  <Button
                    href={place.website}
                    target="_blank"
                    variant="outlined"
                    size="small"
                    sx={{ marginTop: 1 }}
                  >
                    Visit Website
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default Map;
