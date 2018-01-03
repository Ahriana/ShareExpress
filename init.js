const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const http = require('http');
const config = require('./config.json');
const fs = require('fs');
const util = require('util');
const multipart = require('connect-multiparty');

function writeLog(log) {
    if (typeof log === 'object') { log = util.inspect(log) }
    console.log('New Log:', log);
    fs.appendFile('error.log', `${log}\n`, (err) => {
        if (err) throw err;
        console.log('Wrote to log file!');
    });
}

app.use(helmet());
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multipart());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { name: config.general.serverName });
});

app.get('/view/:id', (req, res) => {
    res.render('view', { name: config.general.serverName });
});

app.post('/upload', (req, res) => {
    //writeLog(`userkey: ${req.body.key}`);
    //writeLog(`filename: ${req.body.name}`);
    //writeLog(`filename: ${req.file}`);
    // writeLog(req.files.file);

    res.status(200).send('thonk');
});

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(`${__dirname}/pages/404.html`));
});

app.use((err, req, res, next) => {
    writeLog(err)
    return res.status(500).sendFile(path.join(`${__dirname}/pages/500.html`));
});

const server = http.createServer(app);
server.listen(config.general.serverPort);
console.log(`Server started on port ${config.general.serverPort}`);

