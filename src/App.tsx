import { useState } from "react";
import Map from "./components/Map";
import { TextField, Button, Box } from "@mui/material";
import { Coords } from "./types/coords";

const App = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [markers, setMarkers] = useState<Coords[]>([]);

  // Handle button click to trigger map update
  const handleSearch = () => {
    if (keyword.trim() === "") {
      alert("Please enter a valid keyword!");
      return;
    }

    console.log("Searching for places with keyword:", keyword); // Debugging

    setMarkers([]); // Clear previous markers if any

    // This will trigger the marker update in the Map component
    console.log("Markers state reset:", markers); // Debugging
  };

  return (
    <Box sx={{ padding: 4 }}>
      <TextField
        label="Search for places"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleSearch} sx={{ mt: 2 }}>
        Search
      </Button>
      <Map keyword={keyword} markers={markers} setMarkers={setMarkers} />
    </Box>
  );
};

export default App;
