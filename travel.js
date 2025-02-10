const AI_KEY = "qIfDVzXQRPfh8IxWp7D2IeHI6brub4rF";
const API_SECRET = "ceqPRI36eIANUA6S";

async function getAccessToken() {
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=client_credentials&client_id=${AI_KEY}&client_secret=${API_SECRET}`
    });
    const data = await response.json();
    return data.access_token;
}

document.getElementById("flightSearchForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const origin = document.getElementById("origin").value.toUpperCase();
    const destination = document.getElementById("destination").value.toUpperCase();
    const departureDate = document.getElementById("departureDate").value;
    const returnDate = document.getElementById("returnDate").value;

    if (!origin || !destination || !departureDate) {
        alert("Please fill all required fields.");
        return;
    }

    const token = await getAccessToken();
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1&currencyCode=USD`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error("Error fetching flight data:", error);
        alert("Error fetching flight data. Please try again.");
    }
});

function displayResults(data) {
    const resultsDiv = document.getElementById("flightResults");
    resultsDiv.innerHTML = "<h3>Flight Results:</h3>";

    if (data.data && data.data.length > 0) {
        data.data.forEach((flight, index) => {
            resultsDiv.innerHTML += `
                <div class="flight-item">
                    <p><strong>Flight ${index + 1}</strong></p>
                    <p>Price: <strong>${flight.price.total} USD</strong></p>
                    <p>Airline: ${flight.validatingAirlineCodes.join(", ") || "N/A"}</p>
                    <p>Number of stops: ${flight.itineraries[0].segments.length - 1}</p>
                </div>
            `;
        });
    } else {
        resultsDiv.innerHTML += "<p>No flights found.</p>";
    }
}
