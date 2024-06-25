const Pool = require('pg').Pool;

const pool = new Pool({
    user: "messages_app_db_user",
    password: "O3Z78CgPnyxIFSobmW0Reqf4F9iq8Qv8",
    host: "dpg-cpspeuo8fa8c739cb260-a.frankfurt-postgres.render.com",
    port: 5432,
    database: "messages_app_db_b353",
    ssl: true
})

module.exports = pool;

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