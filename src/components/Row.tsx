import React from 'react';
import { Player } from '../lib/player'
import {getRankDesktop, getRankMobile} from '../lib/ranks'
import { Characters } from './Characters'
import 'react-tooltip/dist/react-tooltip.css'
import {Tooltip} from "react-tooltip";
import {useMediaQuery} from "react-responsive";

interface Props {
  player: Player
}

export function Row({ player }: Props) {

  const codeToId = (code: string) => {
    const parts = code.split('#')
    return `${parts[0].toLowerCase()}-${parts[1]}`
  }

  const codeToUrlSlug = (code: string) => {
    return `https://slippi.gg/user/${codeToId(code)}` 
  }

  const changeIndicator = (change: number, indicators: string[]) => {
    return <span className={`px-1 md:text-sm text-xs ${change > 0 ? 'text-green-500': 'text-red-500'}`}>
     {change > 0? indicators[0]: indicators[1]}{Math.abs(change)}
   </span>
  }

  const changeArrow = (change: number) => {
    return changeIndicator(change, ['▲ ', '▼ '])

  }

  const changePlusMinus = (change: number) => {
    return changeIndicator(change, ['+', '-'])
  }

  const getRankChange = (player: Player) => {
    if (!player.oldRankedNetplayProfile || !player.oldRankedNetplayProfile.rank) {
      return null;
    }
    return player.oldRankedNetplayProfile.rank - player.rankedNetplayProfile.rank;
  }

  const getRatingChange = (player: Player) => {
    if (!player.oldRankedNetplayProfile || !player.oldRankedNetplayProfile.ratingOrdinal) {
      return null;
    }
    return Math.floor(player.rankedNetplayProfile.ratingOrdinal - player.oldRankedNetplayProfile.ratingOrdinal);
  }

  const playerRankDesktop = getRankDesktop(player);
  const playerRankMobile = getRankMobile(player);
  const isActive = playerRankDesktop.name !== 'None';
  const totalSets = player.rankedNetplayProfile.wins + player.rankedNetplayProfile.losses;
  const totalGames = player.rankedNetplayProfile.characters.reduce((acc, val)=> acc + val.gameCount, 0);
  const rankChange = getRankChange(player);
  const ratingChange = getRatingChange(player);
  const rankId = playerRankDesktop.name + codeToId(player.connectCode.code)

  const isSm = useMediaQuery({ query: '(min-width: 640px)' })

  if (window.innerWidth > 600) {
    return (
        <tr className={`${playerRankDesktop.bgClass} no-border`}>
          <td className="md:text-2xl text-gray-300 md:px-6 md:py-4 md:p-1 whitespace-nowrap bottom-border">
            <div><b>{isActive && `${player.rankedNetplayProfile.rank}`}</b></div>
            {Boolean(rankChange) && changeArrow(rankChange)} </td>
          <td className="text-gray-100 md:px-6 md:py-4 p-1 whitespace-nowrap text-center overflow-hidden md:max-w-full max-w-[7rem] text-elipses bottom-border">
            <b><a className="md:text-xl text-sm max-w-xs text-gray-300 hover:text-gray-500 hover:underline"
                  href={codeToUrlSlug(player.connectCode.code)}>{player.leaderboardName}</a></b>
            <div
                className="text-gray-300 text-xs overflow-auto no-bar font-poyodash">{player.displayName} / {player.connectCode.code}</div>
          </td>
          <td className="md:text-xl text-sm text-gray-900 md:px-6 md:py-4 p-1 whitespace-nowrap bottom-border">

            {playerRankDesktop.iconUrl &&
            <div className="flex items-center justify-center" id={rankId} data-tooltip-content={playerRankDesktop.name}>
              <img className="md:h-12 md:w-12 h-6 w-6 drop-shadow" src={playerRankDesktop.iconUrl}/>
            </div>}
            <Tooltip className="text-sm" anchorId={rankId}/>
            <div className="text-gray-300 md:text-sm text-xs font-poyodash">
              {isActive && (Math.round(player.rankedNetplayProfile.ratingOrdinal * 10) / 10)}
              {isActive && Boolean(ratingChange) && changePlusMinus(ratingChange)}
            </div>
          </td>
          <td className="md:text-sm text-xs text-gray-300 md:px-6 md:py-4 py-1  md:max-w-[18rem] max-w-[3rem] bottom-border">
            <Characters player={player} totalGames={totalGames}/>
          </td>
          <td className="md:text-xl text-gray-300 text-sm md:px-6 md:py-4 md:p-1 whitespace-nowrap overflow-auto no-bar bottom-border">
            <b>{Boolean(totalGames) && <><span className="text-green-500">{player.rankedNetplayProfile.wins ?? 0}</span><span
                className="md:p-1">/</span>
              <span className="text-red-500">{player.rankedNetplayProfile.losses ?? 0}</span>
            </>}</b>
          </td>
        </tr>
    );
  } else {
    return (
        <tr className={`${playerRankMobile.bgClass} no-border`}>
          <td className="md:text-2xl text-gray-300 md:px-6 md:py-4 md:p-1 whitespace-nowrap bottom-border">
            <div><b>{isActive && `${player.rankedNetplayProfile.rank}`}</b></div>
            {Boolean(rankChange) && changeArrow(rankChange)} </td>
          <td className="text-gray-100 md:px-6 md:py-4 p-1 whitespace-nowrap text-center overflow-auto no-bar md:max-w-full max-w-[7rem] text-elipses bottom-border">
            <b><a className="md:text-xl max-w-xs text-gray-300 hover:text-gray-500 hover:underline"
                  href={codeToUrlSlug(player.connectCode.code)}>{player.leaderboardName}</a></b>
            <div
                className="text-gray-300 text-xs overflow-auto no-bar font-poyodash">{player.displayName} / {player.connectCode.code}</div>
          </td>
          <td className="md:text-xl text-sm text-gray-900 md:px-6 md:py-4 p-1 whitespace-nowrap bottom-border">

            {playerRankDesktop.iconUrl &&
            <div className="flex items-center justify-center" id={rankId} data-tooltip-content={playerRankMobile.name}>
              <img className="md:h-12 md:w-12 h-10 w-10 drop-shadow" src={playerRankMobile.iconUrl}/>
            </div>}
            <Tooltip className="text-sm" anchorId={rankId}/>
            <div className="text-gray-300 md:text-sm text-sm font-poyodash">
                {isActive && (Math.round(player.rankedNetplayProfile.ratingOrdinal * 10) / 10)}
            </div>
          </td>
        </tr>
    );
  }
}
