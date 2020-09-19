const { Requester, Validator } = require('@chainlink/external-adapter')
const axios = require('axios');

const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input)
  const jobRunID = validator.validated.id

  //const url = 

  //'https://api.github.com/repos/octocat/hello-world/pulls/42/merge' // <-- this should return a 404 as it has not been merged
  //`https://api.github.com/repos/smartcontractkit/chainlink/pulls/3365/merge`// <--- this should return a 204 as it has not been merged
  //



  const ignoreError = true

  const config = {
    url,
    ignoreError
  }

  axios.get(url)
    .then(function (response) {
      response.data.result =  response.status
      callback(204, jobRunID, response)
      //console.log("Response is: " + response)
    })
    .catch(function (error) {
      console.log(error)
      callback(404, jobRunID, error)

    })
    .then(function () {
      console.log("The result is ^")
    });

////////////////////////////////////////////////////////////////////////////////

  // Requester.request(config, customError)
  //   .then(response => {
  //     console.log("BALLLLLLSSSSSSSS")
  //     response.data.result =  Requester.validateResultNumber(response.status)
  //     callback(response.status, Requester.success(jobRunID, response))
  //   })
  //   .catch(error => {
  //     callback(500, Requester.errored(jobRunID, error))
  //   })
////////////////////////////////////////////////////////////////////////////////

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
