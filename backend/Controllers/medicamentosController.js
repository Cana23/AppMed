const connection = require("../db");

function calcularHorasTomaProgramadas(
  horaInicial,
  frecuenciaHoras,
  duracionTratamientoDias
) {
  const horasProgramadas = [];

  // Verifica que la hora inicial sea válida
  const horaInicialDate = new Date(`2023-11-09T${horaInicial}`);
  if (isNaN(horaInicialDate.getTime())) {
    throw new Error("La hora inicial proporcionada no es válida");
  }

  // Verifica que la frecuencia y la duración sean números y no nulos
  const frecuenciaHorasNum = parseInt(frecuenciaHoras);
  const duracionTratamientoDiasNum = parseInt(duracionTratamientoDias);

  if (isNaN(frecuenciaHorasNum) || isNaN(duracionTratamientoDiasNum) || frecuenciaHorasNum <= 0 || duracionTratamientoDiasNum <= 0) {
    throw new Error("La frecuencia y la duración del tratamiento deben ser números mayores que cero");
  }

  let hora = new Date(horaInicialDate);

  for (let dia = 1; dia <= duracionTratamientoDiasNum; dia++) {
    horasProgramadas.push(
      hora.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
    hora.setHours(hora.getHours() + frecuenciaHorasNum);
  }

  return horasProgramadas;
}


exports.insertMed = (req, res) => {
  const {
    nombre_medicamento,
    dosis,
    hora_inicial,
    comentarios,
    frecuencia_horas,
    duracion_tratamiento_dias,
  } = req.body;

  const fecha_inicial = new Date(); // La fecha inicial se establece automáticamente en el momento de la inserción.
  const horasTomaProgramadas = calcularHorasTomaProgramadas(
    hora_inicial,
    frecuencia_horas,
    duracion_tratamiento_dias
  );

  const sql =
    "INSERT INTO medicamentos (nombre_medicamento, dosis, hora_inicial, fecha_inicial, comentarios, frecuencia_horas, duracion_tratamiento_dias, horas_toma_programadas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [
      nombre_medicamento,
      dosis,
      hora_inicial,
      fecha_inicial,
      comentarios,
      frecuencia_horas,
      duracion_tratamiento_dias,
      JSON.stringify(horasTomaProgramadas),
    ],
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

// En tu controlador de medicamentosController.js
exports.eliminarHora = (req, res) => {
  const medicamentoId = req.params.id;
  const horaTomaId = req.params.horaTomaId;

  // Lógica para eliminar solo la hora específica del medicamento
  const sql = "UPDATE medicamentos SET horas_toma_programadas = ? WHERE id = ?";
  connection.query("SELECT horas_toma_programadas FROM medicamentos WHERE id = ?", [medicamentoId], (err, result) => {
    if (err) {
      console.error("Error al obtener las horas de toma programadas:", err);
      res.status(500).json({ error: "Error al eliminar la hora" });
    } else {
      const horasTomaProgramadas = JSON.parse(result[0].horas_toma_programadas);
      const nuevasHoras = horasTomaProgramadas.filter((hora) => hora !== horaTomaId);
      
      connection.query(sql, [JSON.stringify(nuevasHoras), medicamentoId], (err, result) => {
        if (err) {
          console.error("Error al actualizar las horas de toma programadas:", err);
          res.status(500).json({ error: "Error al eliminar la hora" });
        } else {
          res.status(200).json({ message: "Hora eliminada con éxito" });
        }
      });
    }
  });
};


