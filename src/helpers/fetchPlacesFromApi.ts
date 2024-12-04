import { GOOGLE_MAPS_API_URL, RADIUS } from "../config";
import { Coords } from "../types/coords";

export const fetchPlacesFromApi = async (
  userCoordinates: Coords,
  values: any
): Promise<any> => {
  try {
    const response = await fetch(
      `${GOOGLE_MAPS_API_URL}/json?location=${userCoordinates}&radius=${RADIUS}&keyword=${values.query}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (!response.ok) return;

    const places = data.results.map((place: any) => ({
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    }));
    return places;
  } catch (error) {
    console.error("Error fetching places:", error);
  }
};
