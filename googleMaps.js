// googleMaps.js - Handles Google Maps API integration

// Initialize the map
function initMap() {
  // Map options
  const options = {
      zoom: 5, // Initial zoom level
      center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
  };

  // Create the map instance
  const map = new google.maps.Map(document.getElementById("map"), options);

  // Add a default marker at the map's center
  const marker = new google.maps.Marker({
      position: options.center,
      map: map,
      title: "Default Location",
  });

  // Add a search input field to the map
  const input = document.createElement("input");
  input.setAttribute("id", "map-search");
  input.setAttribute("placeholder", "Search for a location...");
  input.style.position = "absolute";
  input.style.top = "10px";
  input.style.left = "10px";
  input.style.padding = "10px";
  input.style.border = "1px solid #ccc";
  input.style.borderRadius = "5px";
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Initialize the Places SearchBox
  const searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards the current map bounds
  map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
  });

  // Event listener for search results
  searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) return;

      // Remove the previous marker
      marker.setMap(null);

      // Get the first place from the search results
      const place = places[0];
      if (!place.geometry || !place.geometry.location) {
          console.error("Returned place contains no geometry");
          return;
      }

      // Center the map to the selected place
      map.setCenter(place.geometry.location);
      map.setZoom(12); // Zoom in for a closer view

      // Add a new marker for the selected place
      new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
      });

      // Optionally log the place details (name, address, etc.)
      console.log("Place details:", {
          name: place.name,
          address: place.formatted_address,
          location: place.geometry.location.toJSON(),
      });
  });
}

// Expose the initMap function globally (required by Google Maps API)
window.initMap = initMap;
