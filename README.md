# New England Ranked Slippi Leaderboard

Code powering https://benjaminsg.github.io/NESlippiLeaderboard/#/

Original forked from [@grantismo](https://github.com/grantismo)'s [CO Slippi Leaderboard](https://github.com/Grantismo/CoSlippiLeaderboard)

Includes styles taken from [@poyo-ssb](https://github.com/poyo-ssb)'s [WA Slippi Leaderboard](https://slippi.poyo.dev/) and [@spirrit](https://github.com/spirrit)'s [UK Slippi Leaderboard](https://spirrit.github.io/UKSlippiLeaderboard/#/)

## My additions

- Support for static tags (take a different google form question and merge the data with the fetched data from Slippi)
- Mobile-aware UX (slight sizing and padding adjustments, fewer data columns)
- Rank names changed to only display on image hover
- Ratings rounded to tenths place like on main Slippi leaderboard

## Technologies

- Typescript
- [Webpack@5](https://webpack.js.org/) as module bundler
- [Eslint](http://eslint.org/) for linting
- [Tailwind](https://tailwindcss.com/) for css


Fork of [reacts-pages-boilerplate](https://github.com/rtivital/react-pages-boilerplate)

## How it works

The leaderboard is built from two programs:
* [[src/](https://github.com/benjaminsg/NESlippiLeaderboard/tree/master/src)] A static react website which displays player data 
* [[cron/](https://github.com/benjaminsg/NESlippiLeaderboard/tree/master/cron)] A cron job which pulls connect codes from a google sheet, player data from slippi, and writes that data to json files in `cron/data/`, and then redeploys the static site.

## Caveats

* The undocumented slippi api this depends on may break at any time
* This project takes extra consideration to avoid slamming the slippi servers with api calls, please be considerate of this.
* Logic for determining ranks may become out of sync with the official slippi rank logic
* GitHub actions frequently has outages which will caused missed leaderboard updates
* In order for the leaderboard to work as expected the google sheet must be maintained and regularly cleaned. If tags are not matching up with player data, this is likely the reason (maybe I'll add validations for this at some points in the future?). Look out for the following:
  * Duplicate connect codes
  * Connect codes which have been deleted/changed since being added to the spreadsheet
  * Misinputed/incorrect Slippi connect codes

## Getting started

Optional setup advice:
- Host the code and cron job on an Ubuntu AWS EC2 instance. It's easy to setup there and the instance usage is small enough to stay within the AWS free tier.

- Clone `git clone https://github.com/rtivital/react-pages-boilerplate` or [download](https://github.com/rtivital/react-pages-boilerplate/archive/master.zip) this repository.
- (Optional) Run `nvm use 18.12.0`. This will ensure that you are running the supported version of Node.js. You can nvm installation instructions [here](https://github.com/creationix/nvm).
- Install dependencies: `yarn`
- Run the project: `npm start`
- Set your repoPath in settings.js and  "homepage" in package.json to your github pages url (e.g. https://benjaminsg.github.io/NESlippiLeaderboard/)
- Create a google form to collect player tags from your region. ![image](https://user-images.githubusercontent.com/911232/207989907-256100e3-c215-4699-9ae7-655d5345cbd4.png)
- Link your google form to a google sheet ![image](https://user-images.githubusercontent.com/911232/207990065-aadc0a30-2561-46b7-a46e-0742af601cec.png)
- Follow directions in https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account to create a service account and credentials to read from the google sheet. Save your creds json file to `secrets/creds.json`
- Change `spreadsheetID` in settings.js to your google sheet ID
- Edit your crontab to run the cron job every 30 minutes. On linux `crontab -e`

Example crontab:
```
# m h  dom mon dow   command
*/30 * * * * /bin/bash /home/grantismo/code/CoSlippiLeaderboard/cron/run.sh
```

## Settings

[settings.js](./settings.js) file includes all important settings that should be used to setup deployments to gh-pages:

- **title** – Base application title
- **cname** – Adds CNAME file that allows to use custom domain names with gh-pages
- **repoPath** – username.github.io/repoPath for react router to recognize gh-pages paths
- **spreadsheetID** - ID for google sheet containing player connect codes. `https://docs.google.com/spreadsheets/d/[YOUR ID]`

## scripts

- `npm start` – starts development server with webpack-dev-server
- `npm run build` – builds project to production
- `npm run deploy` – builds and deploys project to Github pages
- `./cron/run.sh` - manually runs the cron job
