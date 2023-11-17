const connection = require("../db");

function calcularHorasTomaProgramadas(
  hora_toma,
  frecuencia_horas,
  duracion_tratamiento_dias,
) {
  const horasProgramadas = [];
  const milisegundosPorHora = 60 * 60 * 1000;

  const [hora, minuto] = hora_toma.split(':');
  const hora_tomaMs = new Date().setHours(parseInt(hora), parseInt(minuto), 0, 0);

  for (let dia = 0; dia < duracion_tratamiento_dias; dia++) {
    const diaActualMs = hora_tomaMs + dia * 24 * milisegundosPorHora;

    for (let i = 0; i < 24 / frecuencia_horas; i++) {
      const horaTomaMs = diaActualMs + i * frecuencia_horas * milisegundosPorHora;
      const horaToma = new Date(horaTomaMs);
      
      if (!isNaN(horaToma.getTime())) {
        horasProgramadas.push(horaToma.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'numeric', day: 'numeric', year: 'numeric' }));
      }
    }
  }

  return horasProgramadas;
}




exports.insertMed = (req, res) => {
  const {
    nombre_medicamento,
    dosis,
    hora_toma,
    comentarios,
    frecuencia_horas,
    duracion_tratamiento_dias,
  } = req.body;

  console.log("Datos recibidos en el backend:", req.body);

  const fecha_toma = new Date();
  const horasTomaProgramadas = calcularHorasTomaProgramadas(
    hora_toma,
    Number(frecuencia_horas),
    Number(duracion_tratamiento_dias)
  );

  const sql =
    "INSERT INTO medicamentos (nombre_medicamento, dosis, hora_toma, fecha_toma, comentarios, frecuencia_horas, duracion_tratamiento_dias, horas_toma_programadas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [
      nombre_medicamento,
      dosis,
      hora_toma,
      fecha_toma,
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

// Endpoint para marcar como "ingerido"
exports.marcarIngerido = (req, res) => {
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
        const horasTomaProgramadas = JSON.parse(rows[0].horas_toma_programadas);
        horasTomaProgramadas.shift(); 
        const updateSql = "UPDATE medicamentos SET horas_toma_programadas = ? WHERE id = ?";
        connection.query(updateSql, [JSON.stringify(horasTomaProgramadas), medicamentoId], (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error al actualizar horas de toma programadas:", updateErr);
            res.status(500).json({ error: "Error al marcar como ingerido" });
          } else {
            res.status(200).json({ message: "Medicamento marcado como ingerido" });
          }
        });
      }
    }
  });
};

// Endpoint para marcar como No Ingerido (actualizar horas)
exports.marcarNoIngerido = (req, res) => {
  const medicamentoId = req.params.id;

  const obtenerHoraActual = () => {
    const ahora = new Date();
    const hora = ahora.getHours();
    const minutos = ahora.getMinutes();
    return `${hora}:${minutos}`;
  };

  const calcularNuevasHorasTomaProgramadas = (horaToma, frecuencia_horas) => {
    const horasProgramadas = [];
    const milisegundosPorHora = 60 * 60 * 1000;

    const [hora, minuto] = horaToma.split(':');
    const hora_tomaMs = new Date().setHours(parseInt(hora), parseInt(minuto), 0, 0);

    const horaActual = obtenerHoraActual();
    const horasTomaProgramadasRestantes = calcularHorasTomaProgramadasRestantes(
      horaActual,
      frecuencia_horas,
      1 // Solo necesitas una hora programada para el próximo día
    );

    if (horasTomaProgramadasRestantes.length > 0) {
      const proximaHoraTomaMs = new Date(horasTomaProgramadasRestantes[0]).getTime();
      const tiempoTranscurrido = proximaHoraTomaMs - hora_tomaMs;

      // Calcular nuevas horas de toma programadas para los días restantes
      for (const horaRestante of horasTomaProgramadasRestantes) {
        const horaTomaMs = new Date(new Date(horaRestante).getTime() + tiempoTranscurrido);
        if (!isNaN(horaTomaMs)) {
          horasProgramadas.push(horaTomaMs.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        }
      }
    }

    return horasProgramadas;
  };

  const sql = "SELECT hora_toma, frecuencia_horas, duracion_tratamiento_dias FROM medicamentos WHERE id = ?";
  
  connection.query(sql, [medicamentoId], (err, rows) => {
    if (err) {
      console.error("Error al obtener medicamento por ID:", err);
      res.status(500).json({ error: "Error al obtener medicamento por ID" });
    } else {
      if (rows.length === 0) {
        res.status(404).json({ error: "Medicamento no encontrado" });
      } else {
        const { hora_toma, frecuencia_horas, duracion_tratamiento_dias } = rows[0];
        const nuevasHorasTomaProgramadas = calcularNuevasHorasTomaProgramadas(hora_toma, frecuencia_horas);

        // Actualizar las horas de toma programadas en la base de datos
        const updateSql = "UPDATE medicamentos SET horas_toma_programadas = ? WHERE id = ?";
        connection.query(updateSql, [JSON.stringify(nuevasHorasTomaProgramadas), medicamentoId], (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error al actualizar horas de toma programadas:", updateErr);
            res.status(500).json({ error: "Error al marcar como no ingerido" });
          } else {
            console.log("Medicamento marcado como no ingerido exitosamente");
            res.status(200).json({ message: "Medicamento marcado como no ingerido" });
          }
        });
      }
    }
  });
};
