const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3300;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Ruta de mensaje
app.get('/', (req, res) => {
  res.json({ message: '¡Hola, mundo!' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`La aplicación está funcionando en el puerto ${PORT}`);
});
