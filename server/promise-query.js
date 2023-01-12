const mysql = require('mysql');

// Database connection 
var con;

const connect = () => {
    con = mysql.createConnection({
        host: "166.62.75.128",
        user: "ktprog2",
        password: "Keefe2012",
        database: "BPA2023_Jumper"
    });
    con.connect(function(err) {
        console.log("In Connect");
        if (err) { throw err };
    });
};
const db = () => {
    console.log("Returning con");
    return con;
}
const pQuery = (sql, vars) => {
    return new Promise((resolve, reject) => {
        con.query(sql, vars, (err, result) => {
            console.log("In Query");
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