import nextConnect from 'next-connect';
import { connect as DatabaseConnect } from '../../../src/DatabaseUtility';

const handler = nextConnect();

/* Get user detail */
handler.get(async (req, res) => {
    const userId = req.query.id;

    const db = await DatabaseConnect();

    db.get(
        "SELECT * FROM users WHERE id = ? LIMIT 1;", 
        [ 
            userId
        ], function(err, row) {
            db.close();

            return res.status(200).json(row);
        }
    );
});

/* Update user */
handler.put(async (req, res) => {
    const userId = req.query.id;

    const userInfo = Object.assign(
        {}, 
        req.body
    );

    let fieldUpdate = [ ];

    for (const fieldName of [
        "name",
        "date_of_birth",
        "height",
        "image"
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
        `UPDATE users SET ${fieldUpdate.map(item => item.field + " = ?")} WHERE id = ?;`,
        fieldUpdate.map(item => item.value).concat([ userId ]),
        function(err) {
            db.close();

            if (err) {
                console.warn(err);
            }
            
            return res.status(200).json(
                arr.reduce((obj, item) => Object.assign(obj, { [item.field]: item.value }), {})
            );
        }
    );
});

/* Delete user */
handler.delete(async (req, res) => {
    const userId = req.query.id;

    const db = await DatabaseConnect();

    db.get(
        "DELETE FROM users WHERE id = ?;",
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
