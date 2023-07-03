import { FormEvent, useCallback, useState } from 'react';

function App() {
	const [username, setUsername] = useState<string>('wardlee');
	const [token, setToken] = useState<string>('');

	const handleCredentials = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const creds = new FormData(event.currentTarget);
		setUsername(creds.get('username') as string);
		setToken(creds.get('token') as string);
	}, []);

	async function handleOntrack() {
		console.log('todo');
	}

	return (
		<>
			<form onSubmit={handleCredentials}>
				<label htmlFor="username">Username</label>
				<input id="username" name="username"/>
				<label htmlFor="token">Auth-Token</label>
				<input id="token" name="token"/>
				<input type="submit" value="Let's go"/>
			</form>

			<button onClick={handleOntrack}>Get data</button>
		</>
	);
}

export default App;
