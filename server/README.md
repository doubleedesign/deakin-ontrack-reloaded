# OnTrack Reloaded: Back-end

## GraphQL server
Eeek, GraphQL?! Overkill? Probably. But it's a learning exercise.

Each thing you want to do with data (such as get current units or a list of tasks) has the following key parts:

### Datasources (server level)
The `datasources` are classes that, well, get raw data from a source - such as a REST API or database. For REST APIs for example, this is where you put the endpoints you want to query, each in their own method. One datasource can be used by multiple resolvers and queries.

### Resolvers (server level)
This is where you define what you want to do with the data you fetched from some datasources. With only one data source at the time of writing this, it might be unclear why this is a thing - you _could_ do things like filtering right there in the datasource method that fetches it. But if you have multiple datasources and want to return one unified object, that's where a resolver needs to come in and GraphQL's usefulness is really shown (in my opinion).

### Schemas (server level) and types
**GraphQL schemas** are the data types you'll be returning from your queries. I use TypeScript so I also have those **types**, which can mirror the GraphQL schema which can be mildly confusing at first. These are found in the `types.ts` file.

The schemas can be defined in a `schema.graphql` file or in a `.ts` file wrapped in `gql` ``` `` ``` after importing `graphql-tag`. I am using the latter because I find it easier to differentiate at a glance between that file and the TypeScript `types.ts` that way given how much overlap there is.

One difference between the two files/definition sets is that you only include the fields you actually want in the GraphQL schema, whereas you may need TypeScript types (or interfaces, [but don't ask me which you should use](https://www.reddit.com/r/reactjs/comments/14q6nyr/interface_vs_type_what_should_i_use_in/)) that represent the whole object when you don't have control over it (e.g., raw data returned from a REST API).

TypeScript types can be defined at either or both the server or front-end level according to where you need them, but as I have several shared types it makes sense to define these in one place (the server) and make them available using a path mapping in the `compilerOptions` of my front-end `tsconfig`.

### Queries (front-end)
// TODO.

--- 
## GraphQL Playground

With your server running locally, you can access [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/v2/testing/graphql-playground/) at http://localhost:5000/graphql to test queries. I find it's a good idea to do this before trying to implement them on the front-end, as it helps narrow down where the problem is if something isn't working.
