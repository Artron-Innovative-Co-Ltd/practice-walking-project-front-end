import nextConnect from 'next-connect';
import mime from 'mime';
import path from 'path';
import fs from 'fs';

const handler = nextConnect();

handler.get(async (req, res) => {
    const fileName = req.query.name;

    const fullFilePath = path.resolve("./uploads", fileName);

    if (fs.existsSync(fullFilePath)) {
        res.writeHead(200, { 
            "Content-Type": mime.getType(fullFilePath) 
        });

        fs.createReadStream(fullFilePath).pipe(res);
    } else {
        res.status(404).send(fullFilePath + " not found.");
    }
});

handler.delete(async (req, res) => {
    const fileName = req.query.name;

    const fullFilePath = path.resolve("./uploads", fileName);

    if (fs.existsSync(fullFilePath)) {
        fs.unlinkSync(fullFilePath);
    }

    res.status(200).send("OK");
});

export default handler;
