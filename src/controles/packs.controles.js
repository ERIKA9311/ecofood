const db = require('../config/db');

const crearPack = async (req, res) => {
    // Recibimos los datos del cuerpo de la petición (req.body)
    const { negocio, producto, precioOferta, horaRecogida, usuario_id, cantidad,direccionRecogida } = req.body;
    console.log("Datos completos:", req.body);
    console.log("Cantidad recibida:", cantidad);

    try {
         const query = 
            'INSERT INTO packs (negocio, producto, precioOferta, horaRecogida, usuario_id, cantidad, direccionRecogida) VALUES (?, ?, ?, ?, ?,?,?)'
           
        ;
        

        await db.query(query, [
            negocio, 
            producto, 
            precioOferta, 
            horaRecogida, 
            usuario_id, 
            cantidad,
            direccionRecogida
        ]) ;       
        res.json({ mensaje: "¡Pack publicado con éxito!" });
    } catch (error) {
        console.error("error al insertar",error);
        res.status(500).json({ mensaje: "Error al publicar el pack" });
    }
};

// 2. ESTA FUNCIÓN ES PARA MOSTRAR EN EL INICIO (GET)
const obtenerPacks = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM packs ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener:", error);
        res.status(500).json({ mensaje: "Error al obtener los packs" });
    }
};

const obtenerPacksPorUsuario = async (req, res) => {
    const { usuario_id } = req.params; // Recibimos el ID desde la URL

    try {
        const [rows] = await db.query(
            'SELECT * FROM packs WHERE usuario_id = ? ORDER BY id DESC', 
            [usuario_id]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al cargar tus packs" });
    }
};



const reservarPack = async (req, res) => {
    const { id } = req.params; // Recibimos el ID del pack
    const { cantidadReserva } = req.body;
    try {
        // 1. Verificamos si aún hay unidades disponibles
        const [rows] = await db.query('SELECT cantidad FROM packs WHERE id = ?', [id]);
        
        if (rows.length === 0) return res.status(404).json({ mensaje: "Pack no encontrado" });

        const textoOriginal = rows[0].cantidad;
        const stockDisponible = parseInt(textoOriginal.split(' ')[0]);
        const unidad = textoOriginal.split(' ')[1] || 'unidades';
        // Extraemos el número de la cadena (ej: "5 porciones" -> 5)
       
        if (cantidadReserva > stockDisponible) {
            return res.status(400).json({ 
                mensaje: `⚠️ No es posible reservar esa cantidad. Solo quedan ${stockDisponible} ${unidad} disponibles.` 
            });
        }

            const nuevoStock = stockDisponible - cantidadReserva;
            const nuevoTexto = `${nuevoStock} ${unidad}`;

            // 2. Actualizamos la base de datos
           await db.query('UPDATE packs SET cantidad = ? WHERE id = ?', [nuevoTexto, id]);
            return res.json({
                exito:true,
                mensaje: `¡Reservaste ${cantidadReserva} ${unidad} con éxito!`
            });
       
        
        } catch (error) {
        res.status(500).json({ mensaje: "Error al procesar la reserva" });
    }
       
};

const eliminarPack = async (req, res) => {
    const { id } = req.params;

    try {
        // CORRECCIÓN: Usamos "db.query" en vez de "pool.query" para que coincida con la línea 1
        const [resultado] = await db.query('DELETE FROM packs WHERE id = ?', [id]);

        // Verificamos de manera segura si se borró la fila
        if (resultado && resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'El pack no existe o ya fue eliminado.' });
        }

        return res.json({ mensaje: '¡Publicación eliminada con éxito!' });
    } catch (error) {
        console.error('Error al eliminar el pack:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor al eliminar.' });
    }
};

module.exports = {crearPack, obtenerPacks, obtenerPacksPorUsuario,reservarPack,eliminarPack };