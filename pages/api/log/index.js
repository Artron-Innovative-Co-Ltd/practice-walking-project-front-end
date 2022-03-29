import nextConnect from 'next-connect';
import { connect as DatabaseConnect } from '../../../src/DatabaseUtility';

const handler = nextConnect();

handler.get(async (req, res) => {
    const { uid } = req.query;

    const db = await DatabaseConnect();

    db.all("SELECT * FROM log WHERE uid = ?", [ uid ], function(err, rows) {
        db.close();

        return res.status(200).json(rows);
    });
});

/* Add user */
handler.post(async (req, res) => {
    const { uid } = req.query;

    const logInfo = Object.assign(
        {
            date_of_start: null,
            weight: null,
        }, 
        req.body
    );
    // console.log(userInfo);

    const db = await DatabaseConnect();

    db.run(
        "INSERT INTO log (uid, date_of_start, date_of_end, control_log, weight) VALUES (?, ?, NULL, NULL, ?)",
        [
            uid,
            logInfo.date_of_start,
            logInfo.weight,
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