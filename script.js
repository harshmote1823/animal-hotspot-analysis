let areaChart = null;




function loadData() {
    fetch("http://127.0.0.1:5000/data")
        .then(response => response.json())
        .then(data => {
            
            const tbody = document.querySelector("#dataTable tbody");
            tbody.innerHTML = "";

            let areaCount = {};

            data.forEach(row => {
                // Fill table
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${row.date}</td>
                    <td>${row.city}</td>
                    <td>${row.area}</td>
                    <td>${row.animal}</td>
                    <td>${row.count}</td>
                    <td>${row.health}</td>
                    <td>${row.latitude}</td>
                    <td>${row.longitude}</td>
                `;
                tbody.appendChild(tr);

                // Count per area
                if (!areaCount[row.area]) {
                    areaCount[row.area] = 0;
                }
                areaCount[row.area] += Number(row.count);
            });

            drawAreaChart(areaCount);
            drawHotspotMap(data);
            
            
        })
        .catch(err => {
            alert("Backend not running");
            console.error(err);
        });
}
function drawAreaChart(areaCount) {
    const labels = Object.keys(areaCount);
    const values = Object.values(areaCount);

    const ctx = document.getElementById("areaChart").getContext("2d");

    if (areaChart) {
        areaChart.destroy();
    }

    areaChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Total Animals",
                data: values,
                backgroundColor: "rgba(46, 204, 113, 0.7)"
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
let map = null;

function drawHotspotMap(data) {
    if (map) {
        map.remove(); // Remove previous map if exists
    }

    map = L.map("map").setView([22.7196, 75.8577], 12); // Center to Indore (change if needed)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    data.forEach(row => {
        // Convert count to marker radius
        let radius = Math.sqrt(row.count) * 3;

        // Color by health
        let color = row.health === "Healthy" ? "green" :
                    row.health === "Injured" ? "red" : "orange";

        L.circle([row.latitude, row.longitude], {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            radius: radius
        }).addTo(map)
        .bindPopup(`<b>${row.animal}</b><br>Count: ${row.count}<br>Health: ${row.health}`);
    });
}

