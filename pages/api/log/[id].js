import nextConnect from 'next-connect';
import { connect as DatabaseConnect } from '../../../src/DatabaseUtility';

const handler = nextConnect();

/* Update user */
handler.put(async (req, res) => {
    const logId = req.query.id;

    const userInfo = Object.assign(
        {}, 
        req.body
    );

    let fieldUpdate = [ ];

    for (const fieldName of [
        "uid",
        "date_of_start",
        "date_of_end",
        "control_log",
        "weight",
        "ended"
    ]) {
        if (typeof userInfo[fieldName] !== "undefined") {
            fieldUpdate.push({ 
                field: fieldName,
                value: userInfo[fieldName]
            });
        }
    }
  
    const db = await DatabaseConnect();

    db.get(
        `UPDATE log SET ${fieldUpdate.map(item => item.field + " = ?")} WHERE id = ?;`,
        fieldUpdate.map(item => item.value).concat([ logId ]),
        function(err) {
            db.close();

            if (err) {
                console.warn(err);
            }
            
            return res.status(200).json(
                fieldUpdate.reduce((obj, item) => Object.assign(obj, { [item.field]: item.value }), {})
            );
        }
    );
});

/* Delete log */
handler.delete(async (req, res) => {
    const userId = req.query.id;

    const db = await DatabaseConnect();

    db.get(
        "DELETE FROM log WHERE id = ?;",
        [
            userId,
        ], 
        function(err) {
            db.close();

            return res.status(200).json({ id: userId });
        }
    );
});

export default handler;
