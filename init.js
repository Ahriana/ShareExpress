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
        const dir = `${__dirname}/public/images/${req.body.userName}`;
        if (!fs.existsSync(dir)) { fs.mkdirSync(dir); }
        cb(null, dir);
    },
    filename: (req, file, cb) => { cb(null, encodeURI(file.originalname)); },
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

function getURL() {
    if (config.general.isProxy) {
        return config.general.serverLocation;
    } else {
        if (config.general.serverPort === (80 || 443)) { return config.general.serverLocation; }
        return `${config.general.serverLocation}:${config.general.serverPort}`;
    }
}

function failed(req, res, err, code) {
    writeLog(`${code}: ${err}`);
    writeLog(req.body);
    res.status(code).send(err);
}

config.base = getURL();
app.use(helmet());
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => { res.render('index', { name: config.general.serverName }); });

app.get('/view/:user/:id', (req, res) => {
    res.render('view', {
        name: config.general.serverName,
        image: `${req.params.user}/${req.params.id}`,
        user: req.params.user,
        fullImage: `${config.base}/images/${req.params.user}/${req.params.id}`,
    });
});

app.post('/upload', upload.single('file'), (req, res) => {

    if (!req.body.userName) { return failed(req, res, 'invalid user', 401); }
    if (req.body.key !== config.users[req.body.userName].key) { return failed(req, res, 'invalid token', 401); }

    res.send(`${config.base}/view/${req.body.userName}/${req.file.filename}`);
});

app.get('*', (req, res) => { res.status(404).sendFile(path.join(`${__dirname}/pages/404.html`)); });
app.use((err, req, res, next) => { writeLog(err); return res.status(500).sendFile(path.join(`${__dirname}/pages/500.html`)); });

const server = http.createServer(app);
server.listen(config.general.serverPort);
console.log(`Server started on port ${config.general.serverPort}`);

