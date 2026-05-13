const http = require('http');
const fs = require('fs');

const data = JSON.stringify({
    usuario_id: 6,
    marca: 'Test',
    modelo: 'M',
    anio: 2021,
    placa: 'T' + Date.now().toString().slice(-4),
    color: 'R',
    kilometraje: 100
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/vehiculos',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let chunks = '';
    res.on('data', d => chunks += d);
    res.on('end', () => {
        fs.writeFileSync('debug.log', `Status: ${res.statusCode}\nBody: ${chunks}`);
    });
});

req.on('error', error => fs.writeFileSync('debug.log', `Req Error: ${error.message}`));
req.write(data);
req.end();
