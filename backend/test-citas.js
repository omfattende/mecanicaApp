fetch('http://localhost:3000/api/citas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        usuario_id: 6,
        vehiculo_id: 1,
        fecha: "2024-12-12",
        hora: "10:00",
        servicio: "Cambio de Aceite",
        descripcion: "test test"
    })
}).then(r => r.json()).then(data => {
    console.log(JSON.stringify(data, null, 2));
    process.exit();
}).catch(e => {
    console.error(e);
    process.exit(1);
});
