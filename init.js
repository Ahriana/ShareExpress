const express = require('express');
const app = express();
const path = require('path');
const helmet = require('helmet');
const http = require('http');
const config = require('./config.json');
const fs = require('fs');
const util = require('util');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/images`);
    },
    filename: (req, file, cb) => {
        cb(null, `image-${Date.now()}.png`);
    },
});

const upload = multer({ storage });

function writeLog(log) {
    if (typeof log === 'object') { log = util.inspect(log); }
    console.log('New Log:', log);
    fs.appendFile('error.log', `${log}\n`, (err) => {
        if (err) throw err;
        console.log('Wrote to log file!');
    });
}

app.use(helmet());
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { name: config.general.serverName });
});

app.get('/view/:id', (req, res) => {
    res.render('view', {
        name: config.general.serverName,
        image: req.params.id,
        fullUrl: config.general.serverPort !== 80 ? `${config.general.serverLocation}:${config.general.serverPort}/view/${req.params.id}` : `${config.general.serverLocation}/view/${req.params.id}`,
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    console.log('file Details:', req.file);
    console.log('Req Details:', req.body);
    if (req.body.key !== config.creds.key) { return res.status(401).send('nope'); }
    res.send(config.general.serverPort !== 80 ? `${config.general.serverLocation}:${config.general.serverPort}/view/${req.file.filename}` : `${config.general.serverLocation}/view/${req.file.filename}`);
});

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(`${__dirname}/pages/404.html`));
});

app.use((err, req, res, next) => {
    writeLog(err);
    return res.status(500).sendFile(path.join(`${__dirname}/pages/500.html`));
});

const server = http.createServer(app);
server.listen(config.general.serverPort);
console.log(`Server started on port ${config.general.serverPort}`);

