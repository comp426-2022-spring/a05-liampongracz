const express = require('express')
const morgan = require('morgan')
const minimist = require('minimist')
const app = express()
const fs = require('fs')
const db = require("./src/services/database.js")
const res = require('express/lib/response')

const args = minimist(process.argv.slice(2))
args["help", "port", "debug", "log"]

const help = (`
server.js [options]
--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.
--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.
--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.
--help	Return this message and exit.
`)

if (args.help || args.h) {
    console.log(help)
    process.exit(0)
}

// port default to 5555
const port = args.port || process.env.PORT || 5000;
const debug = (args.debug == "true");
const log = (args.log != "false");

app.use(express.json())
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }))

const server = app.listen(port, () => {
    console.log('App is running on port %PORT%'.replace('%PORT%', port))
})

//Log user interaction to database
if (log == true) {
    const WRITESTREAM = fs.createWriteStream('access.log', { flags: 'a' });
    app.use(morgan('combined', { stream: WRITESTREAM }));
}

app.use((req, res, next) => {
    let logData = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }
    const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(logData.remoteaddr, logData.remoteuser, logData.time, logData.method, logData.url, logData.protocol, logData.httpversion, logData.status, logData.referer, logData.useragent);
    next();
})

// const express = require('express')
// const app = express()

// const db = require("./database.js")
// const args = require('minimist')(process.argv.slice(2))

// const port = args['port'] || 5000
// const debug = args['debug'] || false
// const log = args['log'] || true

// const fs = require('fs')
// const morgan = require('morgan')

// app.use(express.json())
// app.use(express.static('./public'))
// app.use(express.urlencoded({ extended:true }))

// const server = app.listen(port, () => {
//     console.log('App listening on port %PORT%'.replace('%PORT%',port))
// });

// if (args['help']) {
//     console.log(`server.js [options]

//     --port	Set the port number for the server to listen on. Must be an integer
//                 between 1 and 65535.
  
//     --debug	If set to 'true', creates endlpoints /app/log/access/ which returns
//                 a JSON access log from the database and /app/error which throws 
//                 an error with the message "Error test successful." Defaults to 
//                 'false'.
  
//     --log		If set to false, no log files are written. Defaults to true.
//                 Logs are always written to database.
  
//     --help	Return this message and exit.
//     `);
//     process.exit(0);
// }

// if (log) {
//     const WRITESTREAM = fs.createWriteStream('access.log', {flags: 'a'})
//     app.use(morgan('combined',{ stream: WRITESTREAM }))
// }


if (debug) {
    app.get('/app/log/access', (req, res) => {
        try {
            const stmt = db.prepare(`SELECT * FROM accesslog`).all();
            res.status(200).json(stmt);
        } catch {
            console.error(e);
        }
    });
    app.get('/app/error', (req, res) => {
        throw new Error('Error test successful.');
    });
}

// app.use( (req, res, next) => {
//     let logdata = {
//         remoteaddr: req.ip,
//         remoteuser: req.user,
//         time: Date.now(),
//         method: req.method,
//         url: req.url,
//         protocol: req.protocol,
//         httpversion: req.httpVersion,
//         secure: req.secure,
//         status: res.statusCode,
//         referer: req.headers['referer'],
//         useragent: req.headers['user-agent']
//     };
//     const stmt = db.prepare(`
//         INSERT INTO accesslog (remoteaddr,
//         remoteuser,
//         time,
//         method,
//         url,
//         protocol,
//         httpversion,
//         secure,
//         status,
//         referer,
//         useragent) values (?,?,?,?,?,?,?,?,?,?,?);
//     `);
//     const info = stmt.run(logdata.remoteaddr,
//         logdata.remoteuser,
//         logdata.time,
//         logdata.method,
//         logdata.url,
//         logdata.protocol,
//         logdata.httpversion,
//         logdata.secure,
//         logdata.status,
//         logdata.referer,
//         logdata.useragent);
//     next();
// })

app.get('/app/', (req, res) => {
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.writeHead(res.statusCode, {'Content-Type' : 'text/plain'});
    res.end(res.statusCode+ ' ' +res.statusMessage)
});

app.get('/app/flip/', (req, res) => {
    res.status(200);
    const ans = coinFlip();
    const flipResult = {"flip" : ans};
    res.json(flipResult);
});

app.post('/app/flips/', (req, res, next) => {
    const flips = coinFlips(req.body.number);
    const count = countFlips(flips);
    res.status(200).json({"raw":flips,"summary":count})
});

app.post('/app/flip/call/', (req, res, next) => {
    res.status(200);
    res.json(flipACoin(req.body.guess));
});

app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});

function coinFlip() {
    const rand = Math.random()
    if (rand < 0.5){
      return "heads"
    } else {
      return "tails"
    }
  }
 
  function coinFlips(flips) {
    const result = []
    for(let i = 0 ; i < flips ; i++) {
      const rand = Math.random()
      if (rand < 0.5){
        result[i] = "heads"
      } else {
        result[i] = "tails"
      }
    }
    return result
  }
 
  function countFlips(array) {
    let heads = 0
    let tails = 0
    for(let i = 0 ; i < array.length ; i++) {
      if (array[i] == 'heads') {
        heads++
      }
      else {
        tails++
      }
    }
    if (tails == 0) {
      return  {
        'heads': heads
      }
    } else if (heads == 0) {
      return  {
        'tails': tails
      }
    }
    return  {
      'heads': heads,
      'tails': tails
    }
  }

  function flipACoin(call) {
    const rand = Math.random()
    let flip = ''
    if (rand < 0.5){
      flip = "heads"
    } else {
      flip = "tails"
    }
    let result = ''
    if (call == flip){
      result = 'win'
    } else {
      result = 'lose'
    }
    return {
      'call': call,
      'flip': flip,
      'result': result
    }
  }