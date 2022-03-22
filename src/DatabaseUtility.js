const sqlite3 = require('sqlite3').verbose();
const path = require('path');

export async function connect() {
    const file = path.resolve(process.cwd(), process.env.DATABASE_FILE);
    const db = new sqlite3.Database(file);
    // console.log(file);

    db.getPromise = (sql, param) => 
        new Promise((resolve, rejact) => 
            db.get(sql, param, (error, row) => 
                error ? rejact(error) : resolve(row)
        )
    );

    db.allPromise = (sql, param) => 
        new Promise((resolve, rejact) => 
            db.all(sql, param, (error, row) => 
                error ? rejact(error) : resolve(row)
        )
    );

    return new Promise((resolve, rejact) => db.serialize(() => resolve(db)));
}

