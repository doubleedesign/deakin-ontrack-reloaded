# Custom Deakin OnTrack client

## Server

### Eeek, GraphQL?! 

Overkill? Probably. But it's a learning exercise.

## Front-End

More to come.

### Getting your OnTrack auth token

You can find the auth token by logging into OnTrack with your browser dev tools open and either:
- going to the Network tab and inspecting the request headers for any of the API calls, or 
- going to the Storage tab and finding the token in the `doubtfire_user` object.

Or, you can semi-automate this process using a browser extension such as [GreaseMonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) or [TamperMonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) to run a custom script to automatically copy it to the clipboard when you load or refresh OnTrack. Here's the one I use with GreaseMonkey:

```js
const data = window.localStorage.getItem('doubtfire_user'); 
const token = JSON.parse(data).authenticationToken;
navigator.clipboard.writeText(token);
alert("Copied auth token: " + token);
```
