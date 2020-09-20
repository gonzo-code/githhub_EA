const createRequest = require('./index').createRequest

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.EA_PORT || 8080

app.use(bodyParser.json())

app.post('/', (req, res) => {
  console.log('POST Data: ', req.body)
  createRequest(req.body, (statusCode, jobRunID) => {
    console.log('jobRunID: ', jobRunID)
    console.log('statusCode: ', statusCode)
    res.status(200).json({
      jobRunID: jobRunID,
      data: { result: statusCode }
    })
    /// ^ I am using the status here to identify if a merge has happened or not
  })
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
