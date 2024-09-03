/*
This file creates a pool which allows us to connect to the hosted database using the parameters provided by Render.
ssl connection error is fixed by adding ssl: true to the pool.
*/
const Pool = require('pg').Pool;

const pool = new Pool({
    user: "messages_app_db_user",
    password: "FfrPB5tQpPNssSlPGwAgIY231jfICzYI",
    host: "dpg-crbhbmaj1k6c738bp4g0-a.frankfurt-postgres.render.com",
    port: 5432,
    database: "messages_app_db_ze74",
    ssl: true
})

module.exports = pool;

//Notes for the localhost case, is case I need to refer to them later
//Working for localhost:
/*const pool = new Pool({
    user: "postgres",
    password: "Password123",
    host: "localhost",
    port: 5432,
    database: "messagingapp"
})

module.exports = pool;*/

/*const pool = new Pool();
module.exports = {
    query: (text, params) => pool.query(text, params),
};*/