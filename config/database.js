var mysql = require("mysql2");

let db_password = ""

const user = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "usermb",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
});

const idp = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "idp_db",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
});

const fix = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "projectfix",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
});

const elec = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "election",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
});

const elec_2 = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "election_2",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
});


const residenz = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "residenz",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
});

const pape = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "pape",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
});

const mbroom = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "mbroom",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
});

const app_score = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "mbapp_score",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
});

const art_asset = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "mb_asset",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
});

const mbfinance = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "mbfinance",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
});


const publicbook = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "pub_test",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
});

const pape_admin = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "pape_admin",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
});

const mb_it = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "mb_it",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
})

const mb_contact = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "mb_contact",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
})

const aunqa = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "aunqa",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
    //dateStrings: true 
})

const asset = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "asset",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0

})

const sci_equipment = mysql.createPool({
    host: "localhost",
    user: "root",
    password: db_password,
    database: "sci_equipment",
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0

})

module.exports = { user_db: user, idp_db: idp, fix_db: fix, elec_db: elec, elec_2_db: elec_2, residenz_db: residenz, pape_db: pape, mbroom_db: mbroom, app_score_db: app_score, art_asset_db: art_asset, finance_db: mbfinance, publicbook_db: publicbook, pape_admin_db: pape_admin, mbit_db: mb_it, mb_contact_db: mb_contact, aunqa_db: aunqa, asset_db: asset, sci_equipment_eb: sci_equipment }