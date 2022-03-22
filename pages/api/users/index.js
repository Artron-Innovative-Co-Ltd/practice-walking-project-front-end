import nextConnect from 'next-connect';
import { connect as DatabaseConnect } from '../../../src/DatabaseUtility';

const handler = nextConnect();

handler.get(async (req, res) => {
    const db = await DatabaseConnect();

    db.all("SELECT * FROM users", function(err, rows) {
        db.close();

        return res.status(200).json(rows);
    });
});

/* Add user */
handler.post(async (req, res) => {
    const userInfo = Object.assign(
        {
            name: null,
            date_of_birth: null,
            height: null,
        }, 
        req.body
    );
    // console.log(userInfo);

    const db = await DatabaseConnect();

    db.run(
        "INSERT INTO users (name, date_of_birth, height, image) VALUES (?, ?, ?, NULL)",
        [
            userInfo.name,
            userInfo.date_of_birth,
            userInfo.height,
        ],
        function(err) {
            db.get("SELECT last_insert_rowid() as id", function(err, row) {
                db.close();
        
                return res.status(200).json({ id: row?.id });
            });
        }
    );
});

export default handler;