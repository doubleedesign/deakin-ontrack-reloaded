# OnTrack Reloaded: Back-end

## Wording and definitions

The OnTrack API is structured as follows. I have used this terminology in the OnTrack datasource class and the TypeScript types to match the API endpoints.

- **Projects** are like an instance of a unit, an individual enrolment or attempt.
- **Units** are the general definitions of units, like what you would find in the university handbook (as well as other administrative data).

What is useful to a student, a user of this  app, is a combination of data from both of these things. I have used the term **Subject** to represent this. While it's not what we typically refer to them as at Deakin, in terms of the code I find it clearer to use an entirely separate phrase.

Similarly, the OnTrack API also has:

- **Tasks** are data about the individual student's work on a task, such as its status and submission date. They are associated with Projects.
- **Task definitions** are exactly what the name implies - they contain fields like the task name and target date, and are associated with Units.

The combination of which I am calling **Assignments**.

## GraphQL server
Eeek, GraphQL?! Overkill? Maybe. But it's a learning exercise.

Each thing you want to do with data (such as get current units or a list of tasks) has the following key parts:

### Datasources (server level)
The `datasources` are classes that, well, get raw data from a source - such as a REST API or database. For REST APIs for example, this is where you put the endpoints you want to query, each in their own method. One datasource can be used by multiple resolvers and queries.

### Resolvers (server level)
This is where you define what you want to do with the data you fetched from some datasources. With only one data source at the time of writing this, it might be unclear why this is a thing - you _could_ do things like filtering right there in the datasource method that fetches it. But if you have multiple datasources and want to return one unified object, that's where a resolver needs to come in and GraphQL's usefulness is really shown (in my opinion). 

An example of this within this project is calling both the Project and Unit OnTrack API endpoints and returning a unified Subject.

### Schemas (server level) and types
**GraphQL schemas** are the data types you'll be returning from your queries. I use TypeScript so I also have those **types**, which can mirror the GraphQL schema which can be mildly confusing at first. These are found in the `types.ts` file.

The schemas can be defined in a `schema.graphql` file or in a `.ts` file wrapped in `gql` ``` `` ``` after importing `graphql-tag`. I am using the latter because I find it easier to differentiate at a glance between that file and the TypeScript `types.ts` that way given how much overlap there can be.

One difference between the two files/definition sets is that you only include the fields you actually want in the GraphQL schema, whereas you may need TypeScript types (or interfaces, [but don't ask me which you should use](https://www.reddit.com/r/reactjs/comments/14q6nyr/interface_vs_type_what_should_i_use_in/)) that represent the whole object when you don't have control over it (e.g., raw data returned from a REST API).

TypeScript types can be defined at either or both the server or front-end level according to where you need them, but as I have several shared types it makes sense to define these in one place (the server) and make them available using a path mapping in the `compilerOptions` of my front-end `tsconfig`.

### Queries (front-end)

The [React Apollo Client](https://www.apollographql.com/docs/react/) is used in my front-end app to query the GraphQL server on the front-end, making the data available for use in front-end components. The queries themselves are defined in `frontend/src/graphql/queries.ts`, and can be executed using Apollo Client's `useQuery` or `useLazyQuery` depending on the situation. 

Queries can essentially be copied from GraphQL Playground into `queries.ts`.

--- 
## GraphQL Playground

With your server running locally, you can access [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/v2/testing/graphql-playground/) at http://localhost:5000/graphql to test queries. I find it's a good idea to do this before trying to implement them on the front-end, as it helps narrow down where the problem is if something isn't working.
