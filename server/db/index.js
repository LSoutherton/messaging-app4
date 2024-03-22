const Pool = require('pg').Pool;

const pool = new Pool({
    user: "messages_app_db_user",
    password: "faW4re1QZdgBoRIIJmwqekU2SqPxOa9v",
    host: "cnub3nkf7o1s73avvm00-a.frankfurt-postgres.render.com",
    port: 5432,
    database: "messages_app_db",
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