import React from 'react';
import {Leaderboard} from '../lib/player'

interface Props {
    leaderboard: Leaderboard
}

export function OtherLeaderboard({ leaderboard }: Props) {

    const leaderboardFlag = "/images/flags/" + leaderboard.code + ".svg";

    return (
        <a href={leaderboard.url} target="_blank">
            <li><img src={leaderboardFlag} className="flag"/> {leaderboard.name}</li>
        </a>

    );
}
