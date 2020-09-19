const { Requester, Validator } = require('@chainlink/external-adapter')
const axios = require('axios');

const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}


const customParams = {
  owner: ['owner', 'master', 'coin'],
  repo: ['repo', 'to', 'repository'],
  pnumber: true
}

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data

   const validator = new Validator(callback, input, customParams)
   const jobRunID = validator.validated.id

   const owns = validator.validated.data.owner
   const repos = validator.validated.data.repo
   const pnumber = validator.validated.data.pnumber


  const url = `https://api.github.com/repos/${owns}/${repos}/pulls/${pnumber}/merge`

  //'https://api.github.com/repos/octocat/hello-world/pulls/42/merge' // <-- this should return a 404 as it has not been merged
  //`https://api.github.com/repos/smartcontractkit/chainlink/pulls/3365/merge`// <--- this should return a 204 as it has not been merged


const params = {
  owns,
  repos,
  pnumber
}

  const ignoreError = true

  const config = {
    url,
    params,
    ignoreError
  }

  axios.get(url)
    .then(function (response) {
      response.data.result =  response.status
      callback(206, jobRunID, response)
      //For what
    })
    .catch(function (error) {
      console.log(error)
      callback(404, jobRunID, error)
    })
    .then(function () {
      console.log("The result is ^")
    });


}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
