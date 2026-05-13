const fs = require('fs');

fetch('http://localhost:3000/api/vehiculos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        usuario_id: 6,
        marca: "Toyota Test",
        modelo: "Corolla",
        anio: 2020,
        placa: "XX-" + Math.floor(Math.random() * 1000),
        color: "Rojo",
        kilometraje: 50000
    })
}).then(async r => {
    const text = await r.text();
    fs.writeFileSync('fetch-result.txt', text);
    process.exit(0);
}).catch(e => {
    fs.writeFileSync('fetch-result.txt', e.toString());
    process.exit(1);
});
