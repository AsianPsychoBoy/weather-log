'use strict';

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const parse = require('csv-parse');

const server = http.createServer((req, res) => {

	let pathname = url.parse(req.url).pathname;
	if (pathname.split('/')[1] === 'assets') {
		let ext = path.parse(pathname).ext;
		let contentType = {
			'.js': 'text/javascript',
			'.css': 'text/css',
			'.svg': 'image/svg+xml'
		};
		fs.readFile(__dirname + pathname, (err, data) => {
			if (err) {
				res.statusCode = 500;
				res.end(err.message);
			} else {
				res.setHeader('Content-type', contentType[ext] || 'text/plain');
				res.end(data);
			}
		});
	} else {
		switch (pathname) {
			case '/':
				fs.readFile(__dirname + '/index.html', 'utf8', (err, html) => {
					if (err) throw err;
					res.writeHead(200, { "Content-Type": "text/html" })
					res.write(html);
					res.end();
				});
				break;
			case '/weather-data': 
				// let parser = parse( {delimiter: ','}, (err, data) => {
				// 	if (err) throw err;
				// 	res.writeHead(200, { "Content-Type": "application/json" });
				// 	let lastLine = data[data.length - 1];
				// 	let jsonData = {
				// 		date: lastLine[0],
				// 		ODTemp: lastLine[1],
				// 		ODHumi: lastLine[2],
				// 		DewPt: lastLine[3],
				// 		IDTemp: lastLine[4],
				// 		IDHumi: lastLine[5],
				// 		windDir: lastLine[6],
				// 		windSpd: lastLine[7],
				// 		heatIndex: lastLine[8],
				// 		windChill: lastLine[9],
				// 		rainFall: lastLine[10],
				// 		pressure: lastLine[11],
				// 		signalStr: lastLine[12]
				// 	};
				// 	res.end(JSON.stringify(jsonData));
				// } );

				// fs.createReadStream(__dirname + '/data/weatherdata.csv').pipe(parser);
				fs.readFile(__dirname + '/data/vis18s.dat', 'utf8', (err, data) => {
					if (err) throw err;
					res.writeHead(200, { "Content-Type": "application/json" });
					let dataByLines = data.split('\r\n');
					let lastLine = dataByLines[dataByLines.length - 2].split(',');
					let jsonData = {
						date: lastLine[0],
						ODTemp: lastLine[2],
						ODHumi: lastLine[4],
						dewPt: lastLine[3],
						IDTemp: lastLine[1],
						IDHumi: lastLine[5],
						windDir: lastLine[6],
						windSpd: lastLine[7],
						heatIndex: lastLine[8],
						windChill: lastLine[9],
						rainFall: lastLine[10],
						pressure: lastLine[11],
						signalStr: lastLine[12]
					};
					res.end(JSON.stringify(jsonData));
				})
		}
	}
})

server.listen(8000, (err) => {
	if (err) {
		return console.log('something bad happened', err);
	}

	console.log('listening on port 8000');
});
