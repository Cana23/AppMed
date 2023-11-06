app.post("/medicamentos", (req, res) => {
  const {
    hora_del_dia,
    nombre_del_medicamento,
    dosis,
    hora_de_la_toma,
    fecha_de_creacion,
    comentarios,
  } = req.body;

  const query =
    "INSERT INTO medicamentos (hora_del_dia, nombre_del_medicamento, dosis, hora_de_la_toma, fecha_de_creacion, comentarios) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      hora_del_dia,
      nombre_del_medicamento,
      dosis,
      hora_de_la_toma,
      fecha_de_creacion,
      comentarios,
    ],
    (err, result) => {
      if (err) {
        console.error("Error al agregar el medicamento:", err);
        res.status(500).send("Error al agregar el medicamento");
      } else {
        res.status(201).json({ message: "Medicamento agregado con éxito" });
      }
    }
  );
});

/*
CREATE TABLE medicamentos (
id INT AUTO_INCREMENT PRIMARY KEY,
hora_del_dia VARCHAR(255),
nombre_del_medicamento VARCHAR(255),
dosis VARCHAR(255),
hora_de_la_toma VARCHAR(255),
fecha_de_creacion DATETIME,
comentarios TEXT
);
*/
