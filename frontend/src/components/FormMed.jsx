import { useState } from "react";

export default function FormMed() {
  const [medicationData, setMedicationData] = useState({
    nombre_medicamento: "",
    dosis: "",
    tipo_dosis: "",
    hora_toma: "",
    fecha_inicio: "",
    fecha_fin: "",
    comentarios: "",
    es_basado_en_sintomas: false,
  });

  const [medicationList, setMedicationList] = useState([]); // Estado para almacenar la lista de medicamentos

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setMedicationData({
      ...medicationData,
      [name]: newValue,
    });
  };

  const handleSaveMedication = () => {
    if (!medicationData.es_basado_en_sintomas) {
      // Si no está basado en ssntomas, verifica si la hora de toma está presente
      if (!medicationData.hora_toma) {
        alert(
          "Debes insertar una hora de toma si no estás basado en síntomas."
        );
        return; // No contina con la operación si no se proporciona la hora de toma
      }
    }
    setMedicationList([...medicationList, medicationData]);
    setMedicationData({
      nombre_medicamento: "",
      dosis: "",
      tipo_dosis: "",
      hora_toma: "",
      fecha_inicio: "",
      fecha_fin: "",
      comentarios: "",
      es_basado_en_sintomas: false,
    });
  };
  return (
    <div className="flex">
      <div className="w-full flex justify-center">
        <div
          className="w-full max-w-md border-2 border-solid p-4 rounded-lg shadow-lg"
          style={{ backgroundColor: "#F1ECE7", color: "black" }}
        >
          <h1 className="text-2xl font-bold mb-4">
            Registro de Horario de Medicamentos
          </h1>
          <div className="gap-4">
            <div>
              <label className="block">Nombre del Medicamento:</label>
              <input
                type="text"
                name="nombre_medicamento"
                value={medicationData.nombre_medicamento}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block">Dosis:</label>
              <input
                type="text"
                name="dosis"
                value={medicationData.dosis}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block">Tipo de Dosis:</label>
              <input
                type="text"
                name="tipo_dosis"
                value={medicationData.tipo_dosis}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block">Hora de Toma:</label>
              <input
                type="time"
                name="hora_toma"
                value={medicationData.hora_toma}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block">Fecha de Inicio:</label>
              <input
                type="date"
                name="fecha_inicio"
                value={medicationData.fecha_inicio}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block">Fecha de Fin:</label>
              <input
                type="date"
                name="fecha_fin"
                value={medicationData.fecha_fin}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="col-span-2">
              <label className="block">Comentarios:</label>
              <textarea
                name="comentarios"
                value={medicationData.comentarios}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="col-span-2">
              <label className="block">Basado en Síntomas:</label>
              <input
                type="checkbox"
                name="es_basado_en_sintomas"
                checked={medicationData.es_basado_en_sintomas}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button
            onClick={handleSaveMedication}
            className="mt-4 p-2 text-black rounded-md"
            style={{ backgroundColor: "#F2AA1F", color: "black" }}
          >
            Guardar
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold">Registros de Medicamentos:</h2>
        <ul>
          {medicationList.map((medication, index) => (
            <li key={index}>
              <strong>Nombre del Medicamento:</strong>{" "}
              {medication.nombre_medicamento}
              <br />
              <strong>Dosis:</strong> {medication.dosis}
              <br />
              <strong>Tipo de Dosis:</strong> {medication.tipo_dosis}
              <br />
              <strong>Hora de Toma:</strong> {medication.hora_toma}
              <br />
              <strong>Fecha de Inicio:</strong> {medication.fecha_inicio}
              <br />
              <strong>Fecha de Fin:</strong> {medication.fecha_fin}
              <br />
              <strong>Comentarios:</strong> {medication.comentarios}
              <br />
              <strong>Basado en Síntomas:</strong>{" "}
              {medication.es_basado_en_sintomas ? "Sí" : "No"}
              <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
