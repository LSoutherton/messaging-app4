const Pool = require('pg').Pool;

const pool = new Pool({
    user: "messages_app_db_user",
    password: "AKAMVbgY6OebRHOpEDA1HBtZ3bYLxaJc",
    host: "dpg-cqh8s5qj1k6c739jc1rg-a.frankfurt-postgres.render.com",
    port: 5432,
    database: "messages_app_db_v5j9",
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