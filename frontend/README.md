## OnTrack Reloaded: Front-end 

Yeah, it's Yet Another React app. I would have liked to take Vue out for another spin but found it was a bit tricky to get Apollo Client working with it and get up to speed on how to do what I wanted quickly enough - I started building this in Week 0 of a trimester. I use React at work, so I'm a lot more familiar with it and some of the learnings from this project are more immediately applicable this way.

If you want to build your own front-end with another library or framework, you totally could. The `server` part of this repo runs standalone, so you could replace my `frontend` folder with your own app. I'd like to say it's on the roadmap to build multiple front-end apps using different libraries/frameworks and study the pros and cons, but I think we all know I won't have time for that any time soon, so I'd love to see what you come up with if you build your own!

## Types

Please see [Wording and Definitions](../server/README.md) in the server README for the rationale behind the naming of the `Subject` and `Assignment` types used for the front-end. 

## GraphQL Queries

Queries can be added and used like the below example. Note that this assumes a resolver for `currentSubjects` already exists.

```typescript
// src/frontend/graphql/queries.ts
import gql from 'graphql-tag';
import { TypedDocumentNode } from '@apollo/client';
import { Assignment, Subject } from '@server/types.ts';

export const CURRENT_SUBJECTS_QUERY: TypedDocumentNode<{currentSubjects: Subject[]}> = gql`
    query CurrentSubjectsQuery {
        currentSubjects {
            unitCode,
	        name,
	        targetGrade
        }
    }
`;
```

```tsx
// frontend/src/components/YourComponent.tsx
import { CURRENT_SUBJECTS_QUERY } from 'frontend/src/graphql/queries';
import { AppContext } from './context/AppContextProvider.tsx';
import { useContext, useCallback } from 'react';

export default function YourComponent() {
	const { queryOptions } = useContext(AppContext);
	const [getCurrentSubjects] = useLazyQuery(CURRENT_SUBJECTS_QUERY, { fetchPolicy: 'no-cache' });

	const handleDataExample = useCallback(async function() {
		// Very basic example, you probably also want to handle errors here as well as do something with the data
		const { data } = await getCurrentSubjects(queryOptions);
		console.log(data);
	}, [getCurrentSubjects, queryOptions]);

	return (
		<>
			<button onClick={handleDataExample}>Click me</button>
		</>
	)
}
```

With the server running, you can go to GraphQL Playground at http://localhost:5000/graphql to see and experiment with the currently available schema, queries, and fields.

Please see the [server README](../server/README.md) for full details on how to implement new queries.
