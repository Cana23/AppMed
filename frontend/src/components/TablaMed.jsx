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
          fecha_inicial: new Date(medicamento.fecha_inicial),
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
        hora_inicial: firstHour,
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

  const eliminarFila = async (medicineId, horaTomaId) => {
    try {
      console.log("HoraTomaId a eliminar:", horaTomaId); // Agrega este console.log para verificar el valor de horaTomaId
      await axios.delete(
        `http://localhost:3300/medicamentos/${medicineId}/horas/${horaTomaId}`
      );
      obtenerMed(); // Vuelve a cargar los datos después de eliminar la hora
    } catch (error) {
      console.error("Error al eliminar la hora:", error);
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
          Frecuencia (horas)
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
              if (Array.isArray(medicine.horas_toma_programadas)) {
                console.log(
                  "Horas de toma programadas:",
                  medicine.horas_toma_programadas
                );
                return medicine.horas_toma_programadas.map((horaToma, j) => (
                  <TableRow key={`${i}-${j}`}>
                    <TableCell>{categorizarEtapaDia(horaToma)}</TableCell>
                    <TableCell>{medicine.nombre_medicamento}</TableCell>
                    <TableCell>{medicine.dosis}</TableCell>
                    <TableCell>{horaToma}</TableCell>
                    <TableCell>{medicine.fecha_toma}</TableCell>
                    <TableCell>{medicine.comentarios}</TableCell>
                    <TableCell>
                      <Button color="secondary">Editar</Button>
                      <Button color="error">Eliminar</Button>
                    </TableCell>
                  </TableRow>
                ));
              } else if (
                typeof medicine.horas_toma_programadas === "string" &&
                medicine.horas_toma_programadas.trim() !== ""
              ) {
                const horasTomaProgramadas = JSON.parse(
                  medicine.horas_toma_programadas
                );
                console.log("Horas de toma programadas:", horasTomaProgramadas);
                return horasTomaProgramadas.map((horaToma, j) => (
                  <TableRow key={`${i}-${j}`}>
                    <TableCell>{categorizarEtapaDia(horaToma)}</TableCell>
                    <TableCell>{medicine.nombre_medicamento}</TableCell>
                    <TableCell>{medicine.dosis}</TableCell>
                    <TableCell>{horaToma}</TableCell>
                    <TableCell>{medicine.fecha_toma}</TableCell>
                    <TableCell>{medicine.comentarios}</TableCell>
                    <TableCell>
                      <Button color="secondary">Editar</Button>
                      <Button
                        color="error"
                        onClick={() => {
                          console.log("Medicine.id:", medicine.id);
                          console.log("HoraToma:", horaToma);
                          console.log(
                            "HoraToma.id:",
                            horaToma ? horaToma.id : "No tiene ID"
                          );
                          eliminarFila(
                            medicine.id,
                            horaToma ? horaToma.id : undefined
                          );
                        }}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ));
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
