const express = require('express')
const app = express()
const port = 1337

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data/query.json', 'utf8'));

app.post('/graphql', (req, res) => {
    res.send(data)
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))