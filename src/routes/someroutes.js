const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.writeHead(res.statusCode, {'Content-Type' : 'text/plain'});
    res.end(res.statusCode+ ' ' +res.statusMessage)
});

router.get('/flip/', (req, res) => {
    res.status(200).json({"flip":coinFlip()});
});

router.get('/app/flips/:number', (req, res) => {
    res.status(200);
    const flips = req.params.number || 1;
    const values = coinFlips(flips);
    const rawjson = {
        "raw" : values,
        "summary": countFlips(values)
    };
    res.json(rawjson)
});

router.get('/app/flip/call/heads', (req, res) => {
    res.status(200);
    res.json(flipACoin('heads'));
});

router.get('/app/flip/call/tails', (req, res) => {
    res.status(200);
    res.json(flipACoin('tails'));
});

router.use(function(req, res){
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