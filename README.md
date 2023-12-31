# <img src="https://github.com/doubleedesign/deakin-ontrack-reloaded/blob/master/frontend/public/ontrack-reloaded.svg" width="50" alt="" style="position:relative; top:10px"> OnTrack Reloaded

Custom client to view data from Deakin University's OnTrack assessment system, used for IT and CS units. **Now with a sprinkling of DeakinSync & CloudDeakin data!**

I'm building this as a learning exercise and to find ways to view and track my course progress and upcoming assessment information that work better for me than the current OnTrack interface. 

A bit about how it's built and how it works: 
- [Wording and Definitions](server/README.md#wording-and-definitions)
- [GraphQL Server](server/README.md)
  - [Datasources](server/README.md#datasources-server-level)
  - [Resolvers](server/README.md#resolvers-server-level)
  - [Schemas and types](server/README.md#schemas-server-level-and-types)
  - [Front-end queries](server/README.md#queries-front-end)
  - [A complete example](server/README.md#a-complete-example)
- [Front-end app](frontend/README.md)
- [Mock API](mockapi/README.md) (for demonstration, development, and testing purposes)

Other important information:
- [Making your own version](#making-your-own-version)
- [Warranty (lack thereof)](#warranty-lack-thereof)

---
## How to use 

>  :warning: :warning: :warning:
> 
> **This application is NOT production ready and should only be used locally / in a private environment.**
> **It downloads and saves data about the individual user's work** and thus publishing it live online in its current state is a **massive privacy issue.**
> Other students would be able to see your data (and override it with theirs) depending whose credentials are being used; in the event of lack of valid credentials it falls back to using the cached JSON.
> 
> :warning: :warning: :warning:

**Prerequisites:** Node, an IDE, and a web browser.

1. Fork this repo.
2. Clone your fork on your machine.
3. In a terminal, un `npm install` from the root of the project (it uses [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces))
4. In the terminal, go into the server folder with `cd server` and run `npm run dev` to run with the real APIs and your current enrolment, or `npm run test` to run with a selection of past units (to be replaced with the [Mock API](mockapi/README.md) when I finish it)
    - Optionally, go to http://localhost:5000 in your browser to use [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/v2/testing/graphql-playground/)
5. In a second terminal window, go into the frontend folder with `cd frontend` and run `npm run dev`
   - Open the URL shown in your terminal.

### Getting your auth tokens

#### OnTrack
You can find the auth token by logging into OnTrack with your browser dev tools open and either:
- going to the Network tab and inspecting the request headers for any of the API calls, or
- going to the Storage tab and finding the token in the `doubtfire_user` object in local storage.

Or, you can semi-automate this process using a browser extension such as [GreaseMonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) or [TamperMonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) to run a custom script to automatically copy it to the clipboard when you load or refresh OnTrack. Here's the one I use with GreaseMonkey:

```js
// ==UserScript==
// @name     Copy OnTrack auth token to clipboard
// @version  1
// @match 	 https://ontrack.deakin.edu.au/*
// ==/UserScript==

const data = window.localStorage.getItem('doubtfire_user'); 
const token = JSON.parse(data).authenticationToken;
navigator.clipboard.writeText(token);
alert("Copied auth token: " + token);
```

#### DeakinSync
Works very similarly to getting the OnTrack token, except you're looking for an `Authorization: Bearer ####` header or the `auth_token` value in session storage. Or you can use GreaseMonkey/TamperMonkey for this too: 
```js
// ==UserScript==
// @name     Copy DeakinSync bearer token to clipboard
// @version  1
// @match 	 https://sync.deakin.edu.au/*
// ==/UserScript==

const token = window.sessionStorage.getItem('access_token'); 
navigator.clipboard.writeText(token);
alert("Copied bearer token: " + token);
```

#### CloudDeakin (aka D2L/Brightspace)
You cango into the network tab and find the most recent `token` request on the D2L subdomain and get the token itself from the response, or look for `D2L.Fetch.Tokens` in local storage and get the bit you need. You can do the latter with GreaseMonkey/TamperMonkey: 
```js
// ==UserScript==
// @name     Copy CloudDeakin bearer token to clipboard
// @version  1
// @match 	 https://d2l.deakin.edu.au/*
// ==/UserScript==

const data = window.localStorage.getItem('D2L.Fetch.Tokens'); 
const token = Object.values(JSON.parse(data));
navigator.clipboard.writeText(token[0].access_token);
alert("Copied bearer token: " + token[0].access_token);
```
**Note:** I have had issues with the token in local storage being expired. Explicitly ogging right out of CloudDeakin and back in again seems to be the most reliable way to get a new token.

### Making your own version

⚠️⚠️⚠️
**Please see the note under "How to use" about NOT publishing this app online in is current state due to data privacy issues.** In its current state, this app is ONLY suitable for use in a local/private environment.

You are welcome to fork this repo and modify it to find your own way of managing your OnTrack units, and I would love to see what you come up with! Alternatively if you pretty much use my app as-is but have any suggestions or fixes/tweaks, pull requests are also welcome.

There is a work-in-progress [Mock API](mockapi/README.md) included that you can use for developing with fake data. (However, I have done a LOT of work using my real data since I last worked on the mock API, so it's...probably not even close to complete and usable yet.)

✏️ If you would like to use this repo as a starting point for your own app, I would really appreciate it if you definitely actually _fork_ it (don't download and copy) on GitHub. This is so it will show up in the list of forks and I (and others) can learn from your work as well, and can form part of giving me due credit by making what you used from my project clear in the commit history.


---
## Warranty (lack thereof)

While I will respond to GitHub issues to the best of my ability when I have capacity to do so, please understand that this is a side project primarily built for personal use and published a) to showcase some of my skills and b) in the hope that it may assist fellow students. 

This project is published as-is, with absolutely no warranty whatsoever, no guarantee of support, no guarantees about its functionality or data completeness, and no guarantee that changes to this app will be backwards-compatible (i.e., no promise that forks won't break if my changes are pulled into them).

This project does noes not replicate all functionality of OnTrack. I accept no responsibility for missed tasks or assessment information if you use this app. It is your responsibility to check the official OnTrack app regularly to make sure you have the latest and complete information.

With that fine print out of the way, go forth and reload! 
