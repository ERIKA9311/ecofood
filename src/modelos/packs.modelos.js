// Simulamos una base de datos de productos que sobran en los negocios
const packsInciales = [
    {
        id: 1,
        negocio: "Panadería Central",
        producto: "Bolsa de panes variados",
        precioOriginal: 15000,
        precioOferta: 5000,
        cantidad: 3,
        horaRecogida: "19:00 - 20:00"
    },
    {
        id: 2,
        negocio: "Frubana Local",
        producto: "Canasta de frutas maduras",
        precioOriginal: 20000,
        precioOferta: 8000,
        cantidad: 2,
        horaRecogida: "17:30 - 18:30"
    }
];

module.exports = packsInciales;