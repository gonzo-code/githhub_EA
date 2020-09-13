const { Requester, Validator } = require('@chainlink/external-adapter')


const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input)
  const jobRunID = validator.validated.id

  const url = 'https://api.github.com/repos/octocat/hello-world/pulls/42/merge' // <-- this should return a 404 as it has not been merged
  //`https://api.github.com/repos/smartcontractkit/chainlink/pulls/3365/merge` <--- this should return a 204 as it has not been merged



  const params = {
    //q
    // fsym,
    // tsyms
  }

  const config = {
    url,
    params
  }

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.request(config)
    .then(response => {
      if (response.status == 204) {
        response.data = "Merged"
      }else {
        response.data = "Not Merged"
      }

      console.log(response)
      //callback(response.status, Requester.success(jobRunID, response.status))
      callback(response.status, jobRunID, response)
    })
    .catch(error => {
      callback(404, jobRunID, response.status)
    })
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
