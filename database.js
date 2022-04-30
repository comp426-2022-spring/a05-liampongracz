const Database = require('better-sqlite3');

const db = new Database('log.db');

const stmt = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='accesslog';
`);

let row = stmt.get();

if (row === undefined) {
    console.log('Database empty. Will now be initialized.');
    const sqlInit = `
        CREATE TABLE accesslog (id INTEGER PRIMARY KEY,
            remoteaddr TEXT,
            remoteuser TEXT,
            time TIME,
            method TEXT,
            url TEXT,
            protocol TEXT,
            httpversion TEXT,
            secure TEXT,
            status TEXT,
            referer TEXT,
            useragent TEXT);
    `;
    db.exec(sqlInit);
    console.log('Access log database is now initialized.');
} else {
    console.log('Access log exists.');
}

module.exports = db;