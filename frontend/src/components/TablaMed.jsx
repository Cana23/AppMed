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
/*
const initialData = {
  manana: [],
  mediodia: [],
  tarde: [],
  noche: [],
  cuandoSeaNecesario: [],
};

const groupColors = {
  manana: "#ef9a9a",
  mediodia: "#e6ee9c",
  tarde: "#a5d6a7",
  noche: "#80cbc4",
  cuandoSeaNecesario: "#9fa8da",
};
*/
function TablaMed() {
  const [data, setData] = useState([]);
  const [medicine, setMedicine] = useState("");
  const [dose, setDose] = useState("");
  const [hour, setHour] = useState("");
  const [date, setDate] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    obtenerMed();
  }, []);

  const obtenerMed = async () => {
    try {
      let response = await axios.get("http://localhost:3300/medicamentos");
      setData(response.data);
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
        hora_toma: hour,
        fecha_toma: date,
        comentarios: comments,
      };
      await axios.post("http://localhost:3300/medicamentos", newMed);
      obtenerMed();
      setMedicine("");
      setDose("");
      setHour("");
      setDate("");
      setComments("");
    } catch (error) {
      console.error("Error al agregar el medicamento:", error);
    }
  };

  return (
    <div>
      <div className=" grid grid-flow-col grid-rows-2 gap-2 pb-2">
        <h2 className="text-center flex items-end justify-center">TEST</h2>
        <TextField
          label="Nombre del medicamento"
          type="text"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
        />
        <h2 className="text-center flex items-end justify-center">TEST</h2>
        <TextField
          label="Dosis"
          type="text"
          value={dose}
          onChange={(e) => setDose(e.target.value)}
        />
        <h2 className="text-center flex items-end justify-center">TEST</h2>
        <TextField
          className="w-60"
          label="Frecuencia de la toma (horas)"
          type="time"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
        />
        <h2 className="text-center flex items-end justify-center">TEST</h2>
        <TextField
          className="w-60"
          label="Fecha (por cuantos dias se toma)"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <h2 className="text-center flex items-end justify-center">TEST</h2>
        <TextField
          label="Comentarios"
          type="text"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        </div>
          <div className="justify-center flex">
          <Button onClick={agregarMed} className="items-end">Agregar medicamento</Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hora del día</TableCell>
              <TableCell>Nombre del medicamento</TableCell>
              <TableCell>Dosis</TableCell>
              <TableCell>Hora de la toma</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Comentarios</TableCell>
              <TableCell>Configuracion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((medicine, i) => (
              <TableRow key={i}>
                <TableCell>Placeholder</TableCell>
                <TableCell>{medicine.nombre_medicamento}</TableCell>
                <TableCell>{medicine.dosis}</TableCell>
                <TableCell>{medicine.hora_toma}</TableCell>
                <TableCell>{medicine.fecha_toma}</TableCell>
                <TableCell>{medicine.comentarios}</TableCell>
                <TableCell>
                  <Button color="secondary">Editar</Button>
                  <Button color="error">Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
    </div>
  );
}

export default TablaMed;
