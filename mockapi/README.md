# OnTrack Reloaded: Mock API

This is a REST API for development use. It contains fake data that models the kind of data the OnTrack API returns, which can be useful for developing and testing with randomised but predictable data rather than only your own enrolments.

## How to use

`npm run dev` to run and watch with Nodemon. The URL and list of endpoints will be shown in your terminal.

Because they are all GET requests, you _can_ just view them in the browser. Using [Postman](https://www.postman.com/api-platform/api-client/) to test and debug rotues is recommended but not essential (it's good practice, and you can save your queries).

### Modifying the data

You can modify the data generation in `mockapi/src/data.ts`.

## How it works

The mock API is built using [JSON Server](https://github.com/typicode/json-server) with custom routes.

The custom routes are necessary because the project object fields returned at `api/projects` are different from the individual object fields returned at `api/projects/:id`. JSON Server's default routing would use the `projects` key in the `db` for both. 

