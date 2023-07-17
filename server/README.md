# OnTrack Reloaded: Back-end

## Wording and definitions

The OnTrack API is structured as follows. I have used this terminology in the OnTrack datasource class and the TypeScript types to match the API endpoints.

- **Projects** are like an instance of a unit, an individual enrolment or attempt.
- **Units** are the general definitions of units, like what you would find in the university handbook (as well as other administrative data).

I have also set up the server to get enrolment info from DeakinSync so that non-OnTrack units can be listed in the app, as well as links to the CloudDeakin unit sites. This API returns the `CallistaUnit` type (Callista is the software that powers Student Connect). 

What is useful to a student, a user of this  app, is a combination of data from all of these things. I have used the term **Subject** to represent this. While it's not what we typically refer to them as at Deakin, in terms of the code I find it clearer to use an entirely separate phrase.

Similarly, the OnTrack API also has:

- **Tasks** are data about the individual student's work on a task, such as its status and submission date. They are associated with Projects. They are not created until you perform an action such as update the status or submit work. (In the background these actions trigger a `PUT` operation on the Project.) 
- **Task definitions** are exactly what the name implies - they contain fields like the task name and target date, and are associated with Units.

...the combination of which I am calling **Assignments**. 

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

---
## A complete example

I've tried to do some fairly self-contained commits to show the different pieces of adding a new query, but as I often ended up fixing or changing bits later I figured it'd be a good idea to note a complete working example here for future reference. 

These are the steps I take to add a new endpoint/query. You could do some of them in a different order (and I do find I sometimes jump back and forth between steps to get it right), this is just what made the most sense to me as a general approach.

### 1. Here's a datasource I prepared earlier

In `datasources/OnTrack/ontrack.ts`, there are methods that call the same endpoints that the real OnTrack app does at the time of writing. See [Wording and Definitions](#wording-and-definitions) above as well as the `OnTrack` class file itself for more information about what these are.

### 2. Schemas and types

```typescript
// server/src/types.ts

// ... any new types (or modifications to existing types) needed for this new thing
// These are what's used by the resolver functions (and possibly elsewhere)
```

```typescript
// server/src/schema.ts

// ... any new types (or modifications to existing types) needed for this new thing
// The fields here are what's made available to be queried from the front-end 
```


### 3. Resolver

Note that the function name in the resolver (here `allAssignmentsForSubject`) must match the field defined in the `Query` schema in `typeDefs`, and this is also what is used in front-end queries.

```typescript
// server/src/resolvers/assignmentsForSubject.ts
import { Assignment, ServerContext } from '../types';
import { ProjectDetail, UnitDetail, Task, TaskDefinition } from '../datasources/OnTrack/types';
import { GraphQLError } from 'graphql/error';
import pick from 'lodash/pick';
import chalk from 'chalk';

export const getAssignmentsForSubjectResolver = {
	allAssignmentsForSubject: async (_: any, args: any, context: ServerContext): Promise<Assignment[]> => {
		try {
			const projectDetails: ProjectDetail = await context.datasources.onTrack.getProjectDetails(args.projectId);
			const unitDetails: UnitDetail = await context.datasources.onTrack.getUnitDetails(args.unitId);

			return projectDetails.tasks.map((task: Task) => {
				const taskDef: TaskDefinition = unitDetails.task_definitions.find((taskDef: TaskDefinition) => {
					return taskDef.id === task.task_definition_id;
				});

				return {
					unitId: args.unitId,
					projectId: args.projectId,
					...pick(task, ['status', 'submission_date', 'completion_date']),
					...pick(taskDef, ['id', 'due_date', 'abbreviation', 'name', 'description', 'target_date', 'weighting', 'is_graded']),
					maxPoints: taskDef.max_quality_pts,
					awardedPoints: task.quality_pts
				};
			});
		}
		catch (error) {
			console.error(chalk.red(error.message));
			throw new GraphQLError(error.message);
		}
	}
};
```

```typescript
// server/src/schema.ts
export const typeDefs = gql`
	type Query {
		${''/* ...other resolvers */ }
		allAssignmentsForSubject(projectId: Int, unitId: Int): [Assignment]
	}
	
	${''/* ...other types, including any new ones needed for this new thing */ }
`
```

```typescript
// server/src/app.ts
// ...
const graphQLServer = new ApolloServer({
	typeDefs,
	resolvers: {
		Query: {
			//...other resolvers
			...assignmentsForSubjectResolver
		}
	}
});
// ...
```

### 4. Query

#### Example in GraphQL Playground

Note that you would also need to  fill in your `username` and `Auth-Token` in the **Headers** tab at the bottom.

<img width="1280" alt="GQL Playground example" src="https://github.com/doubleedesign/deakin-ontrack-reloaded/assets/563583/844ae6c7-482d-4933-9e5b-e8239c15d6e4">


#### Example usage in React component

```typescript
// frontend/src/graphql/queries.ts
import gql from 'graphql-tag';
import { TypedDocumentNode } from '@apollo/client';
import { Assignment } from '@server/types.ts';

export const ASSIGNMENTS_FOR_SUBJECT_QUERY: TypedDocumentNode<{allAssignmentsForSubject: Assignment[]}> = gql`
    query AssignmentsForSubjectQuery($projectId: Int, $unitId: Int) {
        allAssignmentsForSubject(projectId: $projectId, unitId: $unitId) {
            abbreviation,
            name,
            due_date,
            status
        }
    }
`;
```

```tsx
// frontend/src/components/YourComponent.tsx
import { ASSIGNMENTS_FOR_SUBJECT_QUERY } from 'frontend/src/graphql/queries';
import { AppContext } from './context/AppContextProvider.tsx';
import { useContext, useCallback } from 'react';

export default function YourComponent() {
	const { queryOptions } = useContext(AppContext);
	const [getAssignments] = useLazyQuery(ASSIGNMENTS_FOR_SUBJECT_QUERY, { fetchPolicy: 'no-cache' });

	const handleDataExample = useCallback(async function() {
		// Very basic example, you probably also want to handle errors here as well as do something with the data
		const { data } = await getAssignments(
			{
				variables: { projectId: 12345, unitId: 123 },
				...queryOptions
			}
		);
		console.log(data);
	}, [getAssignments, queryOptions]);
	
	return (
		<>
            <button onClick={handleDataExample}>Click me</button>
        </>
    )
}
```
