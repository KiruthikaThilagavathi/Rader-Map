// OpenWeatherMap API Key
const apiKey = '0a338883915cab8f8b00d23e16c7fdeb'; // Replace with your API key

// Initialize the map centered on India
const map = L.map('map').setView([20.5937, 78.9629], 5);

// Add a base map using OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// OpenWeatherMap Tile URL for weather layers
const tileLayerUrl = "https://{s}.tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=" + apiKey;

// Rain and Clouds layers
const rainLayer = L.tileLayer(tileLayerUrl.replace("{layer}", "precipitation"), { maxZoom: 18 });
const cloudsLayer = L.tileLayer(tileLayerUrl.replace("{layer}", "clouds"), { maxZoom: 18 });

// Add Rain layer by default
rainLayer.addTo(map);

// Layer Control for toggling
L.control.layers({ 'Rain': rainLayer, 'Clouds': cloudsLayer }).addTo(map);

// Function to fetch weather data for a clicked location
async function fetchWeatherData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Add Click Event to Show Weather Data
map.on('click', async (e) => {
    const { lat, lng } = e.latlng;

    // Fetch weather data for clicked location
    const weatherData = await fetchWeatherData(lat, lng);

    // Extract rain and cloud information
    const rain = weatherData.rain ? weatherData.rain['1h'] || 'No Data' : 'No Rain';
    const clouds = weatherData.clouds ? weatherData.clouds.all + '%' : 'No Cloud Data';

    // Show popup with weather details
    L.popup()
        .setLatLng([lat, lng])
        .setContent(`
            <div class="popup-box">
                <p><span>Location:</span> [${lat.toFixed(2)}, ${lng.toFixed(2)}]</p>
                <p><span>Rain (Last 1hr):</span> ${rain}</p>
                <p><span>Cloud Coverage:</span> ${clouds}</p>
            </div>
        `)
        .openOn(map);
});
