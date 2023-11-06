import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const initialData = {
  mañana: [],
  mediodia: [],
  tarde: [],
  noche: [],
  cuandoSeaNecesario: [],
};

const groupColors = {
  mañana: '#ef9a9a',
  mediodia: '#e6ee9c',
  tarde: '#a5d6a7',
  noche: '#80cbc4',
  cuandoSeaNecesario: '#9fa8da',
};

function TablaMed() {
  const [data, setData] = useState(initialData);
  const [medicine, setMedicine] = useState('');
  const [dose, setDose] = useState('');
  const [hour, setHour] = useState('');
  const [comments, setComments] = useState('');

  const addMedicine = () => {
    if (hour === '') {
      const newData = {
        ...data,
        cuandoSeaNecesario: [
          ...data.cuandoSeaNecesario,
          { medicine, dose, hour, date: new Date(), comments },
        ],
      };
      setData(newData);
    } else {
      const timeOfDay = getTimeOfDay(hour);
      if (timeOfDay) {
        const newData = {
          ...data,
          [timeOfDay]: [...data[timeOfDay], { medicine, dose, hour, date: new Date(), comments }],
        };
        setData(newData);
      }
    }

    setMedicine('');
    setDose('');
    setHour('');
    setComments('');
  };

  const getTimeOfDay = (hour) => {
    const parsedHour = parseInt(hour, 10);
  
    if (isNaN(parsedHour)) {
      return 'cuandoSeaNecesario';
    } else if (parsedHour >= 6 && parsedHour < 12) {
      return 'mañana';
    } else if (parsedHour >= 12 && parsedHour < 17) {
      return 'mediodia';
    } else if (parsedHour >= 17 && parsedHour < 20) {
      return 'tarde';
    } else if (parsedHour >= 20 || parsedHour < 6) {
      return 'noche';
    }
    return 'cuandoSeaNecesario';
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hora del día</TableCell>
              <TableCell>Nombre del medicamento</TableCell>
              <TableCell>Dosis</TableCell>
              <TableCell>Hora de la toma</TableCell>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Comentarios</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(data).map(([timeOfDay, medicines]) =>
              medicines.map((medicine, i) => (
                <TableRow key={i} style={{ backgroundColor: groupColors[timeOfDay] }}>
                  <TableCell>{timeOfDay}</TableCell>
                  <TableCell>{medicine.medicine}</TableCell>
                  <TableCell>{medicine.dose}</TableCell>
                  <TableCell>{medicine.hour}</TableCell>
                  <TableCell>{medicine.date.toString()}</TableCell>
                  <TableCell>{medicine.comments}</TableCell>
                </TableRow>
              )))
            }
          </TableBody>
        </Table>
      </TableContainer>
      <TextField
        label="Nombre del medicamento"
        value={medicine}
        onChange={(e) => setMedicine(e.target.value)}
      />
      <TextField
        label="Dosis"
        value={dose}
        onChange={(e) => setDose(e.target.value)}
      />
      <TextField
        label="Hora de la toma"
        value={hour}
        onChange={(e) => setHour(e.target.value)}
      />
      <TextField
        label="Comentarios"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />
      <Button onClick={addMedicine}>Agregar medicamento</Button>
    </div>
  );
}

export default TablaMed;
