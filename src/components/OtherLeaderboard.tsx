import React from 'react';
import {Leaderboard} from '../lib/player'

import CanadaBC from '../../images/flags/Ca_bc.svg';
import CanadaQC from '../../images/flags/Ca_qc.svg';
import SouthAmerica from '../../images/flags/South_america.svg';
import UK from '../../images/flags/Uk.svg';
import UKScotland from '../../images/flags/Uk_ab.svg';
import USArkansas from '../../images/flags/Us_ar.svg';
import USArizona from '../../images/flags/Us_az.svg';
import USColorado from '../../images/flags/Us_co.svg';
import USIowa from '../../images/flags/Us_ia.svg';
import USIndiana from '../../images/flags/Us_in.svg';
import USMissouri from '../../images/flags/Us_mo.svg';
import USNewMexico from '../../images/flags/Us_nm.svg';
import USNorcal from '../../images/flags/Us_norcal.svg';
import USSiouxland from '../../images/flags/Us_sd.svg';
import USTexas from '../../images/flags/Us_tx.svg';
import USWashington from '../../images/flags/Us_wa.svg';

interface Props {
    leaderboard: Leaderboard
}

const leaderboardCodeToIcon = new Map([
    ['Ca_bc', CanadaBC],
    ['Ca_qc', CanadaQC],
    ['South_america', SouthAmerica],
    ['Uk', UK],
    ['Uk_ab', UKScotland],
    ['Us_ar', USArkansas],
    ['Us_az', USArizona],
    ['Us_co', USColorado],
    ['Us_ia', USIowa],
    ['Us_in', USIndiana],
    ['Us_mo', USMissouri],
    ['Us_nm', USNewMexico],
    ['Us_norcal', USNorcal],
    ['Us_sd', USSiouxland],
    ['Us_tx', USTexas],
    ['Us_wa', USWashington]
]);

export function OtherLeaderboard({ leaderboard }: Props) {

    const icon = leaderboardCodeToIcon.get(leaderboard.code)

    return (
        <a href={leaderboard.url} target="_blank">
            <li><img src={icon} className="flag"/> {leaderboard.name}</li>
        </a>

    );
}
