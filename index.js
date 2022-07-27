const express = require("express")
const crypto = require("crypto")
const app = express()
const port = 3000

app.use(express.static('public'))

// Upload endpoint
app.get('/empty', function (req, res) {
    res.status(200).send('');
});

app.post('/empty', function (req, res) {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0");
    res.set("Cache-Control", "post-check=0, pre-check=0");
    res.set("Pragma", "no-cache");
    res.set("Connection", "keep-alive");
    res.status(200).send('');
});

// Download endpoint
app.get('/garbage', function (req, res) {
    res.set('Content-Description', 'File Transfer');
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', 'attachment; filename=random.dat');
    res.set('Content-Transfer-Encoding', 'binary');
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.set('Cache-Control', 'post-check=0, pre-check=0', false);
    res.set('Pragma', 'no-cache');
    const requestedSize = (req.query.ckSize || 100);
    let cache = crypto.randomBytes(1048576);
    for (let i = 0; i < requestedSize; i++)
            res.write(cache);
    res.end();
});

app.get('/ipinfo', function (req, res) {
    let requestIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.headers['HTTP_CLIENT_IP'] || req.headers['X-Real-IP'] || req.headers['HTTP_X_FORWARDED_FOR'];
    if (requestIP.substring(0, 7) === "::ffff:") {
        requestIP = requestIP.substring(7)
    }
    res.send(requestIP)
    // request('https://ipinfo.io/' + requestIP + '/json', function (err, body, ipData) {
    //     ipData = JSON.parse(ipData);
    //     if (err) res.send(requestIP);
    //     else {
    //         request('https://ipinfo.io/json', function (err, body, serverData) {
    //             serverData = JSON.parse(serverData);
    //             if (err) res.send(`${requestIP} - ${ipData.org}, ${ipData.country}`);
    //             else if (ipData.loc && serverData.loc) {
    //                 const d = helpers.calcDistance(ipData.loc.split(','), serverData.loc.split(','));
    //                 res.send(`${requestIP} - ${ipData.org}, ${ipData.country} (${d}km)`);
    //             } else {
    //                 res.send(`${requestIP} - ${ipData.org}, ${ipData.country}`);
    //             }
    //         })
    //     }
    // });
});

app.listen(port, () => {
    console.log(`diaginfo listening on port ${port}`)
})