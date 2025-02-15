// Toggle LED
function toggleLED(led, status) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/updateLedStatus", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("led=" + led + "&status=" + status);
}

function handleToggle(event) {
  var led = event.target.name;
  var status = event.target.checked ? 1 : 0;
  toggleLED(led, status);
}

// Set gauge value
function setGaugeValue(gauge, value, unit) {
  if (value < 0 || value > 100) {
    return;
  }
  gauge.querySelector(".gauge_fill").style.transform = `rotate(${
    value / 200
  }turn)`;
  gauge.querySelector(".gauge_cover").textContent = `${value}${unit}`;
}

// Fetch sensor data
function fetchSensorData() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/getSensorData", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var data = JSON.parse(xhr.responseText);
      setGaugeValue(
        document.querySelector(".gauge:nth-child(1)"),
        data.temperature,
        "°C"
      );
      setGaugeValue(
        document.querySelector(".gauge:nth-child(2)"),
        data.humidity,
        "%"
      );
    }
  };
  xhr.send();
}

// Fetch LED status
function fetchLedStatus() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/getLedStatus", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var data = JSON.parse(xhr.responseText);
      document.querySelector('input[name="led1"]').checked = data.led1 == 1;
      document.querySelector('input[name="led2"]').checked = data.led2 == 1;
      document.querySelector('input[name="led3"]').checked = data.led3 == 1;
      document.querySelector('input[name="led4"]').checked = data.led4 == 1;
    }
  };
  xhr.send();
}

// Periodically fetch data
setInterval(fetchLedStatus, 1000);
setInterval(fetchSensorData, 3000);

// Initial fetch
fetchLedStatus();
fetchSensorData();
