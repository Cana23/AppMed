import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";

function TablaMed() {
  const [data, setData] = useState([]);
  const [medicine, setMedicine] = useState("");
  const [dose, setDose] = useState("");
  const [firstHour, setFirstHour] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    obtenerMed();
  }, []);

  const categorizarEtapaDia = (horaToma) => {
    const hora = parseInt(horaToma.split(":")[0]);

    if (hora >= 6 && hora < 12) {
      return "mañana";
    } else if (hora >= 12 && hora < 18) {
      return "tarde";
    } else if (hora >= 18 && hora < 24) {
      return "noche";
    } else {
      return "madrugada";
    }
  };

  const obtenerMed = async () => {
    try {
      let response = await axios.get("http://localhost:3300/medicamentos");
      setData(
        response.data.map((medicamento) => ({
          ...medicamento,
          fecha_toma: new Date(medicamento.fecha_toma).toLocaleString(),
          horasProgramadas: JSON.parse(medicamento.horas_toma_programadas),
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error al obtener los medicamentos (frontend):", error);
    }
  };

  const agregarMed = async () => {
    try {
      const newMed = {
        nombre_medicamento: medicine,
        dosis: dose,
        hora_toma: firstHour,
        frecuencia_horas: frequency,
        duracion_tratamiento_dias: duration,
        comentarios: comments,
      };
      
      await axios.post("http://localhost:3300/medicamentos", newMed);
      obtenerMed();
      setMedicine("");
      setDose("");
      setFirstHour("");
      setDuration("");
      setFrequency("");
      setComments("");
      console.log("Datos a enviar al backend:", newMed);
    } catch (error) {
      console.error("Error al agregar el medicamento:", error);
    }
  };

  const eliminarMedicamento = async (medicineId) => {
    try {
      await axios.delete(`http://localhost:3300/medicamentos/${medicineId}`);
      obtenerMed(); // Vuelve a cargar los datos después de eliminar el medicamento
    } catch (error) {
      console.error("Error al eliminar el medicamento:", error);
    }
  };

  return (
    <div>
      <div className=" grid grid-flow-col grid-rows-2 gap-2 pb-2">
        <h2 className="text-center flex items-end justify-center">Nombre</h2>
        <TextField
          type="text"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
        />
        <h2 className="text-center flex items-end justify-center">Dosis</h2>
        <TextField
          type="text"
          value={dose}
          onChange={(e) => setDose(e.target.value)}
        />
        <h2 className="text-center flex items-end justify-center">
          Frecuencia (al dia)
        </h2>
        <TextField
          type="number"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        />
        <h2 className="text-center flex items-end justify-center">
          Duracion del tratamiento (dias)
        </h2>
        <TextField
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <h2 className="text-center flex items-end justify-center">
          Hora inicial de la toma
        </h2>
        <TextField
          type="time"
          value={firstHour}
          onChange={(e) => setFirstHour(e.target.value)}
        />
        <h2 className="text-center flex items-end justify-center">
          Comentarios
        </h2>
        <TextField
          type="text"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>
      <div className="justify-center flex">
        <Button onClick={agregarMed} className="items-end">
          Agregar medicamento
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Etapa del día</TableCell>
              <TableCell>Nombre del medicamento</TableCell>
              <TableCell>Dosis</TableCell>
              <TableCell>Hora de toma programada</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Comentarios</TableCell>
              <TableCell>Configuración</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((medicine, i) => {
              console.log("Medicina:", medicine);

              let horasTomaProgramadas = [];

              if (Array.isArray(medicine.horas_toma_programadas)) {
                console.log(
                  "Horas de toma programadas:",
                  medicine.horas_toma_programadas
                );
                horasTomaProgramadas = medicine.horas_toma_programadas;
              } else if (
                typeof medicine.horas_toma_programadas === "string" &&
                medicine.horas_toma_programadas.trim() !== ""
              ) {
                horasTomaProgramadas = JSON.parse(
                  medicine.horas_toma_programadas
                );
                console.log("Horas de toma programadas:", horasTomaProgramadas);
              }

              if (horasTomaProgramadas.length > 0) {
                return (
                  <TableRow key={i}>
                    <TableCell>
                      {categorizarEtapaDia(horasTomaProgramadas[0])}
                    </TableCell>
                    <TableCell>{medicine.nombre_medicamento}</TableCell>
                    <TableCell>{medicine.dosis}</TableCell>
                    <TableCell>{horasTomaProgramadas.join(", ")}</TableCell>
                    <TableCell>{medicine.fecha_toma}</TableCell>
                    <TableCell>{medicine.comentarios}</TableCell>
                    <TableCell>
                      <Button color="secondary">Editar</Button>
                      <Button
                        color="error"
                        onClick={() => eliminarMedicamento(medicine.id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              } else {
                console.log(
                  "Horas de toma programadas no es un array o está vacío:",
                  medicine.horas_toma_programadas
                );
                return null;
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
    </div>
  );
}

export default TablaMed;
