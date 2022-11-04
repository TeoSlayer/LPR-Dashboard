const moment = require('moment');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/db.sqlite');
const port = 3001;
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: './public/images/' });
const cors = require('cors');
const { exec } = require('child_process');
const { spawn } = require('child_process');
const cron = require('node-cron');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/images')));


const createTable = () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            plate TEXT,
            datetime TEXT,
            file TEXT
        )`);
        console.log('Table created');
    });
};



fs.watch('./public/images/', (eventType, filename) => {
    if (filename) {
        console.log(`File ${filename} was ${eventType}`);
        var file = filename.split('.');
        var file_ext = file[file.length - 1];
        if (file_ext == 'jpg') {
            var file_name = file[0];
            const [plate, timestamp, type] = file_name.split('_');
            const date = moment(timestamp.substring(0, 8), 'YYYYMMDD');
            const time = moment(timestamp.substring(8), 'HHmmss');
            const datetime = moment(date).set({ 
                hour: time.hour(),
                minute: time.minute(),
                second: time.second()
            }).toString();
            var file_path = './images/' + filename;
            var sql = `INSERT INTO images (plate, datetime, file) VALUES ('${plate}', '${datetime}', '${file_path}')`;
            console.log(sql);
            db.run(sql);
        }
    }
}  
);


cron.schedule('* * * * *', () => {
    console.log('running a task every minute');

    //checkDuplicates();
    //checkIfUnsyncFile();
});


const checkIfUnsyncFile = () => {
    fs.readdir('./public/images/', (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        var file_name = file.split('.');
        var file_ext = file_name[file_name.length - 1];
        if (file_ext == 'jpg') {
            var file_path = '/images/' + file;
            var sql = `SELECT * FROM images WHERE file = '${file_path}'`;
            db.get(sql, (err, row) => {
                if (err) throw err;
                if (!row) {
                    console.log(file)
                    const [plate, timestamp, type] = file_name.split('_');
                    const date = moment(timestamp.substring(0, 8), 'YYYYMMDD');
                    const time = moment(timestamp.substring(8), 'HHmmss');
                    const datetime = moment(date).set({
                        hour: time.hour(),
                        minute: time.minute(),
                        second: time.second()
                    }).toString();
                    sql = `INSERT INTO images (plate, datetime, file) VALUES ('${plate}', '${datetime}', '${file_path}')`;
                    db.run(sql);
                }
            });
        }
    });
});
};

const checkDuplicates = () => {
    db.serialize(() => {
        db.each(`SELECT * FROM images`, (err, row) => {
            if (err) throw err;
            var file_path = row.file;
            var file_name = file_path.split('/');
            var file = file_name[file_name.length - 1];
            var sql = `SELECT * FROM images WHERE file = '${file_path}'`;
            db.get(sql, (err, row) => {
                if (err) throw err;
                if (row) {
                    console.log(`File ${file} is duplicated`);
                    sql = `DELETE FROM images WHERE file = '${file_path}'`;
                    db.run(sql);
                }
            });
        });
    });
};


app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

app.get('/images', (req, res) => {
    db.all('SELECT * FROM images', (err, rows) => {
        res.json(rows);
    });
}
);

app.post('/images', upload.single('image'), (req, res) => {
    console.log(req.file);
    res.send('File uploaded!');
}
);

app.get('/images/:plate ', (req, res) => {
    const plate = req.params.plate;
    db.all(`SELECT * FROM images WHERE plate = '${plate}'`, (err, rows) => {
        res.json(rows);
    });
}
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    createTable();
}
);

