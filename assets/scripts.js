'use strict';

// define the vue.js components
const weather = new Vue({
	el: '#weather',
	data: {
		weatherData: {}
	}
})

const alert = new Vue({
	el: '#alert',
	data: {
		message: ''
	}
})

// send request to backend and get weather data
const hostUrl = 'http://localhost:8000';

const getData = function() {
	const httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', hostUrl + '/weather-data', true);
	httpRequest.send(null);
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			if (httpRequest.status === 200 && httpRequest.getResponseHeader('Content-type') === 'application/json') {
				weather.weatherData = JSON.parse(httpRequest.responseText);
				// window.dispatchEvent(new Event('weather-update'));
			} else {
				alert.alertMsg = 'Something went wrong while fetching the weather data';
			}
		} else {
			alert.alertMsg = 'Something went wrong while fetching the weather data';
		}
	}
}

getData();
window.setInterval(getData, 10000);
