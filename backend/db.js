const mysql = require('mysql');

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "medicamentos_db"
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error("Error conectandose a la base de datos: ", err);
        return;
    }
    console.log("Conexion segura a la base de datos.")
});

module.exports = connection;