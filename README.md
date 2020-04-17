# Listing API Stub 

This repo is a stub for the listing api provided by Coldwell Banker Mid-America Group
to listing photo providers. This repo's purpose is to help assist in integrations with
the listing api without a need for a test environment.

## Running locally

The following project can be run on the host machine with node.js.

Steps to get this running locally:

Install your dependencies with `yarn install`

Next, you can start the server by running `node index.js`

The project can also be run through [Docker](https://docs.docker.com/get-docker/) by cloning the repository
locally and running `docker-compose up -d` to start the container in the background. 

Either of these options will start a server up on your host machine, accessible through `localhost:3000`.

Documentation for how the API should be called can be found inside of the `swagger.yaml` 
and can be viewed by pasting the contents of this file into https://editor.swagger.io

There is 1 difference between this stub and the real API. In this stub, you must create a listing by
first POSTing a partial listing to `/api/v1/listings`. This will allow you to have a listing to interact with for listing photo testing.

an example partial request body could look like:

```
{
	"virtual_tour_url": "https://example.com",
	"id": 1234,
	"mls_number": "123456"
}
```

but could be as simple as `{}`