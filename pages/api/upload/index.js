import nextConnect from 'next-connect';
import multer from 'multer';

const handler = nextConnect();

handler.use(multer({
    storage: multer.diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
            const fNameLow = file.originalname.toLowerCase();

            console.log(file);

            if (!([ ".png", ".jpg", ".jpeg", ".svg" ].some(a => fNameLow.endsWith(a)))) {
                cb(null, null);
                return;
            }

            cb(null,(new Date()).getTime() + '-' + file.originalname);
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024 // 1 MB
    }
}).fields([{ name: "image", maxCount: 1 }]));

handler.post(async (req, res) => {
    // console.log(req.files);
    // console.log(req.body);

    const filename = req.files.image[0].filename;

    return res.status(200).json({
        file: filename
    });
});

export default handler;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
}
