import {OtherLeaderboard} from './OtherLeaderboard'
import {Leaderboard} from "../lib/player";
import { useMediaQuery } from 'react-responsive'

interface Props {
    leaderboards: Leaderboard[]
}

export function OtherLeaderboards({ leaderboards }: Props) {
    const isSm = useMediaQuery({ query: '(min-width: 640px)' })

    const th = (text) => {
        return <th className="text-xs md:text-sm font-medium text-white md:px-6 md:py-4 px-3 py-3">{text}</th>
    }
    return (
        <>
            <table className="table-fixed text-center">
                {leaderboards.length > 0 &&
                <tbody>
                    {leaderboards.map((l: Leaderboard, index: number) => <OtherLeaderboard key={l.name} leaderboard={l} />)}
                </tbody>
                }
            </table>
        </>
    );
}
