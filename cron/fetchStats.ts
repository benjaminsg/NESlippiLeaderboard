import { getPlayerDataThrottled } from './slippi'
import { GoogleSpreadsheet } from 'google-spreadsheet';
import creds from '../secrets/creds.json';
import * as syncFs from 'fs';
import * as path from 'path';
import util from 'util';
import * as settings from '../settings'

import { exec } from 'child_process';
const fs = syncFs.promises;
const execPromise = util.promisify(exec);

// var playerCodes = [
//     "HUFFF#0", "IBDW#0", "AMSA#0"
// ];

const getSheetData = async (): Promise<string[][]> => {
  const doc = new GoogleSpreadsheet(settings.spreadsheetID);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0];
  const rows = (await sheet.getRows()); // remove header row, changed to 0 from 1
  const codes = [...new Set(rows.map((r) => r._rawData[1]).filter(r => r !== ''))] as string[]
  const tags = [...new Set(rows.map((r) => r._rawData[2]).filter(r => r !== ''))] as string[]
  return [codes, tags]
};

const getPlayers = async () => {
  const sheetData = await getSheetData()
  const codes = sheetData[0]
  const tags = sheetData[1]
  console.log(`Found ${codes.length} player codes`)
  const allData = codes.map(code => getPlayerDataThrottled(code))
  const results = await Promise.all(allData.map(p => p.catch(e => e)));
  const validResults = results.filter(result => !(result instanceof Error));
  const unsortedPlayers = validResults
    .filter((data: any) => data?.data?.getUser)
    .map((data: any) => data.data.getUser);
  // uncomment to print all display names
  // var displayNames = unsortedPlayers.map(function(player) {
  //   return player.displayName;
  // });
  if(unsortedPlayers.length != tags.length) {
    console.log("Error retrieving player data. Received data of length " + unsortedPlayers.length.toString() + " but " +
        "tag list is of length " + tags.length.toString())
    return []
  }
  const unsortedPlayersWithTags = unsortedPlayers.map((obj, i) => ({ ...obj, leaderboardName: tags[i]}))
  return unsortedPlayersWithTags.sort((p1, p2) =>
    p2.rankedNetplayProfile.ratingOrdinal - p1.rankedNetplayProfile.ratingOrdinal)
}

async function main() {
  console.log('Starting player fetch.');
  const players = await getPlayers();
  if(!players.length) {
    console.log('Error fetching player data. Terminating.')
    return
  }
  console.log('Player fetch complete.');
  // rename original to players-old
  const newFile = path.join(__dirname, 'data/players-new.json')
  const oldFile = path.join(__dirname, 'data/players-old.json')
  const timestamp = path.join(__dirname, 'data/timestamp.json')

  await fs.rename(newFile, oldFile)
  console.log('Renamed existing data file.');
  await fs.writeFile(newFile, JSON.stringify(players));
  await fs.writeFile(timestamp, JSON.stringify({updated: Date.now()}));
  console.log('Wrote new data file and timestamp.');
  console.log('Deploying.');
  const rootDir = path.normalize(path.join(__dirname, '..'))
  console.log(rootDir)
  // if no current git changes
  const { stdout, stderr } = await execPromise(`git -C ${rootDir} status --porcelain`);
  if(stdout || stderr) {
    console.log('Pending git changes... aborting deploy');
    return
  }
  const { stdout: stdout2, stderr: stderr2 } = await execPromise(`npm run --prefix ${rootDir} deploy`);
  console.log(stdout2);
  if(stderr2) {
    console.error(stderr2);
  }
  console.log('Deploy complete.');
}

main();
