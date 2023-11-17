const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3300;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
}));
app.use(morgan('dev'));
app.use(express.json());

const medicamentosController = require('./Controllers/medicamentosController');

app.post("/medicamentos", medicamentosController.insertMed); // CREATE
app.get("/medicamentos", medicamentosController.getMeds); // READ
app.get("/medicamentos/:id", medicamentosController.getMedById);
app.put("/medicamentos/:id", medicamentosController.updateMed); // UPDATE
app.delete("/medicamentos/:id", medicamentosController.eraseMed); // DELETE
app.post("/medicamentos/:id/ingerido", medicamentosController.marcarIngerido); //Ingeridos
app.post("/medicamentos/:id/no-ingerido", medicamentosController.marcarNoIngerido);




app.listen(PORT, () => {
  console.log(`La aplicación está funcionando en el puerto ${PORT}`);
});
