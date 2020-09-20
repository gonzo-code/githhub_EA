# Github Merge Check External Adaptor

This is a first draft of an external adaptor for a Chainlink Node that enables smart contracts to see if a PR has been merged in Github. 

The Github API documentation can be found here: [Pulls - GitHub Docs](https://docs.github.com/en/rest/reference/pulls#check-if-a-pull-request-has-been-merged)

If a PR has been merged then this external adaptor will return a 404 

If a PR has NOT been merged then this external adaptor will return a 206 

I know that is a bit confusing  ;-) 

## Input Params

- `owner`: The owner of the repo
- `repo`: The name of the repo
- `pnumber`: The pull number for the PR

## Output

```json
{"status":206,"result":23, "jobRunID": 23}
```

## Install Locally

Install dependencies:

```bash
yarn
```

Natively run the application (defaults to port 8080):

### Run

```bash
yarn start
```

## Call the external adapter/API server

```bash
curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 0, "data": { "owner": "octocat", "repo": "hello-world", "pnumber": "42" } }'
```
