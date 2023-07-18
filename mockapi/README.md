# OnTrack Reloaded: Mock API

⚠️ **This is incomplete.** At the time of writing, I have not yet accounted for the addition of DeakinSync and CloudDeakin datasources.

This is a REST API for development use. It contains fake data that models the kind of data the OnTrack API returns, which can be useful for developing and testing with randomised but predictable data rather than only your own enrolments.

Currently, the provided data contains (and the generator is set up to create) four current unit enrolments, with task definitions made up of a mixture of "good" examples (subjective, I know) and units with common problems. 
- 2x units with a pretty standard amount of tasks and grade levels with descriptive names 
- 1x unit with nondescript task names ("Task 1.1P", "Task 1.2P", etc)
- 1x unit with 30 tasks (an example of too many, IMO).

## How to use

`npm run dev` to run and watch with Nodemon. The URL and list of endpoints will be shown in your terminal.

Because they are all GET requests, you _can_ just view them in the browser. Using [Postman](https://www.postman.com/api-platform/api-client/) to test and debug rotues is recommended but not essential (it's good practice, and you can save your queries).

### Modifying the data

The `src/data.json` file was generated using `src/generate.ts`. You can modify the data generation functions in the latter file, and then regenerate the JSON by running `npm run generate`. 

If you modify `data.json` directly, your changes will be overwritten if you run `npm run generate` again.

If you add more units to the `unitNames` file/array and regenerate, the additional units will be created with a "pretty standard" task definition set. The third and fourth units get the "nondescript task names" and "too many tasks" definition sets. (So if you remove units to have more than 4, you will miss out on those examples accordingly.)

## How it works

The mock API is built using [JSON Server](https://github.com/typicode/json-server) with custom routes.

The custom routes are necessary because the project object fields returned at `api/projects` are different from the individual object fields returned at `api/projects/:id`. JSON Server's default routing would use the `projects` key in the `db` for both. 

