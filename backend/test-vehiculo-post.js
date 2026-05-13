fetch('http://localhost:3000/api/vehiculos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        usuario_id: 6,
        marca: "Toyota Test",
        modelo: "Corolla",
        anio: 2020,
        placa: "X" + Math.floor(Math.random() * 10000),
        color: "Rojo",
        kilometraje: 50000
    })
}).then(r => r.json()).then(data => {
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
