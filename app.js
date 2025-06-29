const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.get('/', (req, res) => {
    fs.readdir('public/uploads', (err, files) => {
        if (err) return res.send('Unable to scan files!');
        res.render('index', { files });
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.redirect('/');
});

app.post('/delete', express.urlencoded({ extended: true }), (req, res) => {
    const filePath = path.join(__dirname, 'public/uploads', req.body.filename);
    fs.unlink(filePath, err => {
        if (err) return res.send('Failed to delete file!');
        res.redirect('/');
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
