const connection = require("../db");

exports.insertMed = (req, res) => {
  const { nombre_medicamento, dosis, hora_toma, fecha_toma, comentarios } =
    req.body;
  const sql =
    "INSERT INTO medicamentos (nombre_medicamento, dosis, hora_toma, fecha_toma, comentarios) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [nombre_medicamento, dosis, hora_toma, fecha_toma, comentarios],
    (err, result) => {
      if (err) {
        console.error("Error al insertar medicamento:", err);
        res.status(500).json({ error: "Error al insertar el medicamento" });
      } else {
        res.json({ message: "Medicamento insertado correctamente" });
      }
    }
  );
};

// READ all
exports.getMeds = (req, res) => {
  const sql = "SELECT * FROM medicamentos";
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error al obtener medicamentos:", err);
      res.status(500).json({ error: "Error al obtener medicamentos" });
    } else {
      console.log("Datos de medicamentos:", result);
      res.status(200).json(result);
    }
  });
};

// Read by ID
exports.getMedById = (req, res) => {
  const medicamentoId = req.params.id;
  const sql = "SELECT * FROM medicamentos WHERE id = ?";
  connection.query(sql, [medicamentoId], (err, rows) => {
    if (err) {
      console.error("Error al obtener medicamento por ID:", err);
      res.status(500).json({ error: "Error al obtener medicamento por ID" });
    } else {
      if (rows.length === 0) {
        res.status(404).json({ error: "Medicamento no encontrado" });
      } else {
        res.status(200).json(rows[0]);
      }
    }
  });
};

// UPDATE
exports.updateMed = (req, res) => {
  const medicamentoId = req.params.id;
  const { nombre_medicamento, dosis, hora_toma, fecha_toma, comentarios } =
    req.body;
  const sql =
    "UPDATE medicamentos SET nombre_medicamento = ?, dosis = ?, hora_toma = ?, fecha_toma = ?, comentarios = ? WHERE id = ?";
  connection.query(
    sql,
    [
      nombre_medicamento,
      dosis,
      hora_toma,
      fecha_toma,
      comentarios,
      medicamentoId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar medicamento:", err);
        res.status(500).json({ error: "Error al actualizar medicamento" });
      } else {
        res.status(200).json({ message: "Medicamento actualizado con éxito" });
      }
    }
  );
};

// DELETE
exports.eraseMed = (req, res) => {
  const medicamentoId = req.params.id;
  const sql = "DELETE FROM medicamentos WHERE id = ?";
  connection.query(sql, [medicamentoId], (err, result) => {
    if (err) {
      console.error("Error al eliminar medicamento:", err);
      res.status(500).json({ error: "Error al eliminar medicamento" });
    } else {
      res.status(200).json({ message: "Medicamento eliminado con éxito" });
    }
  });
};
