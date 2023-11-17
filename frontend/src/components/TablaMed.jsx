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
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    obtenerMed();
  }, []);

  const categorizarEtapaDia = (horaToma) => {
    const hora = new Date(horaToma).getHours();
  
    if (hora >= 6 && hora < 12) {
      return { etapa: "mañana", color: etapaDiaColores["mañana"] };
    } else if (hora >= 12 && hora < 18) {
      return { etapa: "tarde", color: etapaDiaColores["tarde"] };
    } else if (hora >= 18 && hora < 24) {
      return { etapa: "noche", color: etapaDiaColores["noche"] };
    } else {
      return { etapa: "madrugada", color: etapaDiaColores["madrugada"] };
    }
  };

  const etapaDiaColores = {
    mañana: '#FCBCBC',
    tarde: '#FDECD8',
    noche: '#82E1DB',
    madrugada: '#97B2DD',
  };
  
  

  const obtenerMed = async () => {
    try {
      let response = await axios.get("http://localhost:3300/medicamentos");
      setData(
        response.data.map((medicamento) => ({
          ...medicamento,
          fecha_toma: new Date(medicamento.fecha_toma).toLocaleDateString(),
          horasProgramadas: JSON.parse(medicamento.horas_toma_programadas),
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error al obtener los medicamentos (frontend):", error);
    }
  };

  const obtenerHoraActual = () => {
    const ahora = new Date();
    const hora = ahora.getHours();
    const minutos = ahora.getMinutes();
    return `${hora}:${minutos}`;
  };

  const agregarMed = async () => {
    try {
      const newMed = {
        nombre_medicamento: medicine,
        dosis: dose,
        hora_toma: obtenerHoraActual(),
        frecuencia_horas: frequency,
        duracion_tratamiento_dias: duration,
        comentarios: comments,
      };

      await axios.post("http://localhost:3300/medicamentos", newMed);
      obtenerMed();
      setMedicine("");
      setDose("");
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
      obtenerMed();
    } catch (error) {
      console.error("Error al eliminar el medicamento:", error);
    }
  };

  const marcarIngerido = async (medicamentoId) => {
    try {
      await axios.post(
        `http://localhost:3300/medicamentos/${medicamentoId}/ingerido`
      );
      obtenerMed();
    } catch (error) {
      console.error("Error al marcar como ingerido:", error);
    }
  };

  const marcarNoIngerido = async (medicineId) => {
    try {
      console.log(`Intentando marcar como no ingerido - ID: ${medicineId}`);
      await axios.put(
        `http://localhost:3300/medicamentos/${medicineId}/no-ingerido`
      );
      console.log("Marcado como no ingerido exitosamente");
      obtenerMed();
    } catch (error) {
      console.error("Error al marcar como no ingerido:", error);
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
          Frecuencia (por hora)
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
              <TableCell>Hora y dia de toma programada</TableCell>
              <TableCell>Fecha de crecion</TableCell>
              <TableCell>Comentarios</TableCell>
              <TableCell>Configuración</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((medicine, i) => {
              if (
                typeof medicine.horas_toma_programadas === "string" &&
                medicine.horas_toma_programadas.trim() !== ""
              ) {
                const horasTomaProgramadas = JSON.parse(
                  medicine.horas_toma_programadas
                );

                return horasTomaProgramadas.map((hora, j) => (
                  <TableRow style={{ backgroundColor: categorizarEtapaDia(hora).color }} key={`${i}-${j}`}>
                    <TableCell>{categorizarEtapaDia(hora).etapa}</TableCell>
                    <TableCell>{medicine.nombre_medicamento}</TableCell>
                    <TableCell>{medicine.dosis}</TableCell>
                    <TableCell>{hora}</TableCell>
                    <TableCell>{medicine.fecha_toma}</TableCell>
                    <TableCell>{medicine.comentarios}</TableCell>
                    <TableCell>
                      <Button
                        color="success"
                        onClick={() => marcarIngerido(medicine.id)}
                      >
                        Ingerido
                      </Button>
                      <Button onClick={() => marcarNoIngerido(medicine.id)}>
                        No Ingerido
                      </Button>
                      <Button
                        color="error"
                        onClick={() => eliminarMedicamento(medicine.id)}
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
