// Importar las dependencias necesarias
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // Para manejar la subida de archivos
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de multer para almacenar las imágenes con validación de tipo de archivo
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Tipo de archivo no permitido'), false);
        }
        cb(null, true);
    }
});

// Ruta para servir el archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para obtener comentarios e imágenes de un marcador específico
app.get('/marker-data/:id', (req, res) => {
    try {
        const markerId = req.params.id;
        const filePath = path.join(__dirname, 'data', `${markerId}.json`);

        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            res.json(JSON.parse(data));
        } else {
            res.json({ comments: [], images: [] }); // Si no existe, retornar datos vacíos
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener datos del marcador.' });
    }
});

// Endpoint para subir un comentario y una imagen relacionados con un marcador
app.post('/upload-comment/:id', upload.single('file'), (req, res) => {
    try {
        const markerId = req.params.id;
        const comment = req.body.comment || '';
        const filePath = path.join(__dirname, 'data', `${markerId}.json`);
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        let markerData = { comments: [], images: [] };

        // Si ya existe un archivo JSON para el marcador, leerlo
        if (fs.existsSync(filePath)) {
            markerData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }

        // Agregar el nuevo comentario e imagen
        if (comment) markerData.comments.push(comment);
        if (imagePath) markerData.images.push(imagePath);

        // Guardar los datos actualizados
        fs.writeFileSync(filePath, JSON.stringify(markerData, null, 2));

        res.json({ message: 'Comentario subido con éxito', newComment: comment, newImage: imagePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al subir el comentario o la imagen.' });
    }
});

// Middleware para manejar errores de multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message === 'Tipo de archivo no permitido') {
        return res.status(400).json({ error: err.message });
    }
    next(err);
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
