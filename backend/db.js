const { createConnection } = require('mysql');

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "medicamentos_db"
};

const db = createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error("Error conectandose a la base de datos: ", err);
        return;
    }
    console.log("Conexion segura a la base de datos.")
});

module.exports = db; 
