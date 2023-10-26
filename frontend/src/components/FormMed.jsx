// MedicationForm.jsx

import { useState } from 'react';

function MedicationForm() {
  const [medication, setMedication] = useState({
    name: '',
    description: '',
    frequency: '',
    startTime: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMedication({
      ...medication,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos al backend para su procesamiento
  };

  return (
    <div>
      <h1>Formulario de Medicamentos</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del Medicamento:</label>
          <input
            type="text"
            name="name"
            value={medication.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            name="description"
            value={medication.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Frecuencia de Toma:</label>
          <input
            type="text"
            name="frequency"
            value={medication.frequency}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Hora de Inicio:</label>
          <input
            type="text"
            name="startTime"
            value={medication.startTime}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Guardar Medicamento</button>
      </form>
    </div>
  );
}

export default MedicationForm;
