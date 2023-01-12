const mysql = require('mysql');

// Database connection 
var con;

const connect = () => {
    con = mysql.createPool({
        connectionLimit: 20,
        host: "localhost",
        user: "root",
        password: "Keefe2012",
        database: "login_system"
    });
};
const db = () => {
    return con;
}
const pQuery = (sql, vars) => {
    return new Promise((resolve, reject) => {
        con.query(sql, vars, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

const IsResultEmpty = (result) => {
    if (result && Array.isArray(result) && result.length > 0)
    {
        return false;
    }
    return true;
}
module.exports = { mysql, pQuery, IsResultEmpty, connect, db};