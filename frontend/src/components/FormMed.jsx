import { useState } from "react";

const CalculadoraDeTomaDePastillas = () => {
  const [medicamento, setMedicamento] = useState("");
  const [dosis, setDosis] = useState('');
  const [frecuencia, setFrecuencia] = useState("");
  const [horaInicial, setHoraInicial] = useState("");
  const [cantidadDias, setCantidadDias] = useState("");
  const [horasDeToma, setHorasDeToma] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const horas = calcularHorasDeToma(frecuencia, horaInicial, cantidadDias);
    setHorasDeToma(horas);
  };

  function calcularHorasDeToma(frecuencia, horaInicial, cantidadDias) {
    const horasPorDia = 24;
    const milisegundosPorHora = 60 * 60 * 1000;
    const [hora, minuto] = horaInicial.split(":");
    const horaInicialMs = new Date().setHours(
      parseInt(hora),
      parseInt(minuto),
      0,
      0
    );

    const horasDeToma = [];

    for (let dia = 0; dia < cantidadDias; dia++) {
      const diaActualMs =
        horaInicialMs + dia * horasPorDia * milisegundosPorHora;
      for (let hora = 0; hora < frecuencia; hora++) {
        const horaTomaMs =
          diaActualMs + hora * (horasPorDia / frecuencia) * milisegundosPorHora;
        const horaToma = new Date(horaTomaMs);
        horasDeToma.push(
          horaToma.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }
    }

    return horasDeToma;
  }

  return (
    <div className="flex flex-col text-white bg-secondary w-full h-full p-4">
      <h1 className="text-2xl font-montserrat font-bold py-1">
        Formulario de registro de medicina
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center py-3">
          <label>
            <p className="font-bold text-center">Nombre del medicamento: </p>
            <input
              className="bg-terniary border border-black px-2"
              type="text"
              value={medicamento}
              onChange={(e) => setMedicamento(e.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-center py-3">
          <label>
            <p className="font-bold text-center">Dosis (cantidad y tipo de): </p>
            <input
              className="bg-terniary border border-black px-2"
              type="text"
              value={dosis}
              onChange={(e) => setDosis(e.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-center py-3">
          <label>
            <p className="font-bold text-center">Frecuencia: </p>
            <input
              className="bg-terniary border border-black px-2"
              type="number"
              value={frecuencia}
              onChange={(e) => setFrecuencia(e.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-center py-3">
          <label>
            <p className="font-bold text-center">Hora inicial: </p>
            <input
              className="bg-terniary border border-black px-2"
              type="time"
              value={horaInicial}
              onChange={(e) => setHoraInicial(e.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-center py-3">
          <label>
            <p className="font-bold text-center">Cantidad de dias: </p>
            <input
              className="bg-terniary border border-black px-2"
              type="number"
              value={cantidadDias}
              onChange={(e) => setCantidadDias(e.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-center py-3">
          <button
            type="submit"
            className="text-black bg-other border border-black p-1"
          >
            Calcular
          </button>
        </div>
      </form>
      <div className="flex flex-col justify-center py-3">
        <h2 className="font-bold font-montserrat">
          Horas de toma de pastillas:
        </h2>
        <h1>Nombre del medicamento: {medicamento}</h1>
        <h1>Dosis: {dosis}</h1>
        {horasDeToma.map((hora, index) => (
          <p key={index}>
            Día {Math.floor(index / frecuencia) + 1}, Hora{" "}
            {(index % frecuencia) + 1}: {hora}
          </p>
        ))}
      </div>
    </div>
  );
};

export default CalculadoraDeTomaDePastillas;
