import React, { useEffect, useState } from 'react';
import { Table } from '../../Table';
import { Player } from '../../../lib/player'
import { OtherLeaderboards } from "../../OtherLeaderboards";
import playersOld from '../../../../cron/data/players-old.json';
import playersNew from '../../../../cron/data/players-new.json';
import timestamp from '../../../../cron/data/timestamp.json';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // import plugin
import * as settings from '../../../../settings'
dayjs.extend(relativeTime)


const setCount = (player: Player) => {
  return player.rankedNetplayProfile.wins +
    player.rankedNetplayProfile.losses;
}

const otherLeaderboards = [
    { code: "us_az", name: "Arizona", url: "https://joemama0s.github.io/AZSlippiLeaderboard/#/" },
    { code: "us_ar", name: "Arkansas", url: "https://smaneil.github.io/ArSlippiLeaderboard/#/" },
    { code: "ca_bc", name: "British Columbia", url: "https://slippi.saika.ca/" },
    { code: "us_co", name: "Colorado", url: "https://grantismo.github.io/CoSlippiLeaderboard/#/" },
    { code: "us_in", name: "Indiana", url: "https://freemanb2.github.io/InSlippiLeaderboard/#/" },
    { code: "us_ia", name: "Iowa", url: "https://teolandon.github.io/IaSlippiLeaderboard/#/" },
    { code: "us_mo", name: "Missouri", url: "https://timtempor.github.io/MOSlippiLeaderboard/#/" },
    { code: "us_norcal", name: "Norcal", url: "https://costasford.github.io/NorcalSlippiLeaderboard/#/" },
    { code: "us_nm", name: "New Mexico", url: "https://izzythecubemaster.github.io/NMSlippiLeaderboard/#/" },
    { code: "ca_qc", name: "Quebec", url: "https://tokage2000.github.io/QCSlippiLeaderboard/#/" },
    { code: "uk_ab", name: "Scotland", url: "https://melee-leaderboards.github.io/Scotland/" },
    { code: "us_sd", name: "Siouxland", url: "https://melangestillraces.github.io/SiouxlandSlippiLeaderboard/#/" },
    { code: "south_america", name: "South America", url: "https://caioicy.github.io/slippi-leaderboard-sa/#/" },
    { code: "us_tx", name: "Texas", url: "https://timothysdavis00.github.io/TXSlippiLeaderboard/#/" },
    { code: "us_wa", name: "Washington", url: "https://slippi.poyo.dev/" },
    { code: "uk", name: "United Kingdom", url: "https://spirrit.github.io/UKSlippiLeaderboard/#/" },
];

const sortAndPopulatePlayers = (players: Player[]) => {
  players = players.filter((p)=> setCount(p))
    .concat(players.filter((p)=> !setCount(p)));
  players.forEach((player: Player, i: number) => {
    if(setCount(player) > 0) {
      player.rankedNetplayProfile.rank = i + 1
    }
  })
  return players
}

export default function HomePage() {

  const rankedPlayersOld = sortAndPopulatePlayers(playersOld)
  const oldPlayersMap = new Map(
    rankedPlayersOld.map((p) => [p.connectCode.code, p]));
  
  const players = sortAndPopulatePlayers(playersNew);
  players.forEach((p) => {
    const oldData = oldPlayersMap.get(p.connectCode.code)
    if(oldData) {
      p.oldRankedNetplayProfile = oldData.rankedNetplayProfile
    }
  })

  // continuously update
  const updatedAt = dayjs(timestamp.updated);
  const [updateDesc, setUpdateDesc] = useState(updatedAt.fromNow())
  useEffect(() => {
    const interval = setInterval(
      () => setUpdateDesc(updatedAt.fromNow()), 1000*60);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center h-screen p-8 font-proximaNova">
        <h1 className="text-3xl m-4 text-center text-white font-proximaNova">
            <b>{settings.title}</b>
        </h1>
      <div className="p-1 text-gray-300"> Updated {updateDesc}</div>
      <Table players={players} />
        <div className="navigation">
            <p>Other leaderboards</p>
            <ul>
                <OtherLeaderboards leaderboards={otherLeaderboards} />
            </ul>
        </div>
      <div className="p-4 text-gray-300 flex flex-col font-proximaNova">
        <div>Built by Hufff (Benji) using blorppppp's CO Leaderboard</div>
      </div>
    </div>
  );
}
