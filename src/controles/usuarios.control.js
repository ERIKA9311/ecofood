const db = require('../config/db');

const registrarUsuario = async (req, res) => {
    const { nombreNegocio, email, password, ubicacion } = req.body;

    try {
        //validacion formulario
        const [existe] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (existe.length > 0 && existe.length > 0) {
            // Si el correo ya está en la base de datos, detenemos el proceso aquí
            return res.status(400).json({ 
                mensaje: "Este correo ya está registrado. Intenta con otro o inicia sesión." 
            });
        }

        // --- 2. SI NO EXISTE, PROCEDEMOS A INSERTAR ---
        const [result] = await db.query(
            'INSERT INTO usuarios (nombreNegocio, email, password, ubicacion) VALUES (?, ?, ?, ?)',
            [nombreNegocio, email, password, ubicacion]
        );
        
        res.json({
            mensaje: "Restaurante guardado en base de datos",
            usuario: { id: result.insertId, nombreNegocio, email, ubicacion }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al registrar en MySQL" });
    }
};


const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscamos al usuario por su email
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ mensaje: "El correo no está registrado" });
        }

        const usuario = rows[0];

        // Verificamos la contraseña (luego usaremos bcrypt para más seguridad)
        if (usuario.password !== password) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        // Si todo está bien, enviamos los datos del usuario para el LocalStorage
        res.json({
            mensaje: "¡Bienvenido de nuevo!",
            usuario: {
                id: usuario.id,
                nombreNegocio: usuario.nombreNegocio,
                email: usuario.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

module.exports = { 
    registrarUsuario, 
    loginUsuario 
};