import { Player } from './player'
import GrandMasterIcon from '../../images/ranks/GrandMaster.svg';
import Master1Icon from '../../images/ranks/MasterI.svg';
import Master2Icon from '../../images/ranks/MasterII.svg';
import Master3Icon from '../../images/ranks/MasterIII.svg';
import Diamond1Icon from '../../images/ranks/DiamondI.svg';
import Diamond2Icon from '../../images/ranks/DiamondII.svg';
import Diamond3Icon from '../../images/ranks/DiamondIII.svg';
import Platinum3Icon from '../../images/ranks/PlatinumIII.svg';
import Platinum2Icon from '../../images/ranks/PlatinumII.svg';
import Platinum1Icon from '../../images/ranks/PlatinumI.svg';
import Gold3Icon from '../../images/ranks/GoldIII.svg';
import Gold2Icon from '../../images/ranks/GoldII.svg';
import Gold1Icon from '../../images/ranks/GoldI.svg';
import Silver3Icon from '../../images/ranks/SilverIII.svg';
import Silver2Icon from '../../images/ranks/SilverII.svg';
import Silver1Icon from '../../images/ranks/SilverI.svg';
import Bronze3Icon from '../../images/ranks/BronzeIII.svg';
import Bronze2Icon from '../../images/ranks/BronzeII.svg';
import Bronze1Icon from '../../images/ranks/BronzeI.svg';
import NoneIcon from '../../images/ranks/None.svg';
import PendingIcon from '../../images/ranks/Pending.svg';

interface Rank {
  isRank(player: Player): boolean
  name: string
  bgClass: string
  iconUrl?: string
}

class NoneRankDesktop implements Rank {
  public name = "None"
  public iconUrl = NoneIcon
  public bgClass = LIGHT_STONE_GRADIENT_BG

  isRank(player: Player) {
    return setCount(player) === 0;
  }
}

class NoneRankMobile implements Rank {
  public name = "None"
  public iconUrl = NoneIcon
  public bgClass = LIGHT_STONE_SOLID_BG

  isRank(player: Player) {
    return setCount(player) === 0;
  }
}

const setCount = (player: Player) => {
  return player.rankedNetplayProfile.wins +
    player.rankedNetplayProfile.losses;
}

const MIN_RANK_SETS = 5;

class PendingRankDesktop implements Rank {
  public name = "Pending"
  public iconUrl = PendingIcon
  public bgClass = DARK_STONE_GRADIENT_BG

  isRank(player: Player) {
    const totalSets = setCount(player)
    return 0 < totalSets && totalSets < MIN_RANK_SETS;
  }
}

class PendingRankMobile implements Rank {
  public name = "Pending"
  public iconUrl = PendingIcon
  public bgClass = DARK_STONE_SOLID_BG

  isRank(player: Player) {
    const totalSets = setCount(player)
    return 0 < totalSets && totalSets < MIN_RANK_SETS;
  }
}

class StandardRank implements Rank {
  constructor(
    public name: string,
    private lowerBound: number,
    private upperBound: number,
    public bgClass: string,
    public iconUrl?: string,
  ) {}

  isRank(player: Player) {
    if(setCount(player) < MIN_RANK_SETS) {
      return false
    }
    const rating = player.rankedNetplayProfile.ratingOrdinal;
    return this.lowerBound <= rating && rating <= this.upperBound;
  }
}

class GrandMasterDesktop extends StandardRank {
  constructor() {
    super('Grandmaster', 2191.75, Infinity, SLATE_GRADIENT_BG, GrandMasterIcon)
  }

  isRank(player: Player) {
    const hasRating = super.isRank(player);
    if(!hasRating) {
      return false;
    }
    return player.rankedNetplayProfile.dailyGlobalPlacement !== null
      || player.rankedNetplayProfile.dailyRegionalPlacement !== null;
  }
}

class GrandMasterMobile extends StandardRank {
  constructor() {
    super('Grandmaster', 2191.75, Infinity, SLATE_SOLID_BG, GrandMasterIcon)
  }

  isRank(player: Player) {
    const hasRating = super.isRank(player);
    if(!hasRating) {
      return false;
    }
    return player.rankedNetplayProfile.dailyGlobalPlacement !== null
        || player.rankedNetplayProfile.dailyRegionalPlacement !== null;
  }
}

const ORANGE_GRADIENT_BG = 'bg-gradient-to-r from-[#6e441a]';
const SLATE_GRADIENT_BG = 'bg-gradient-to-r from-gray-900';
const YELLOW_GRADIENT_BG = 'bg-gradient-to-r from-[#614c01]';
const SKY_GRADIENT_BG = 'bg-gradient-to-r from-teal-900';
const BLUE_GRADIENT_BG = 'bg-gradient-to-r from-[#232d94]';
const INDIGO_GRADIENT_BG = 'bg-gradient-to-r from-indigo-900';
const LIGHT_STONE_GRADIENT_BG = 'bg-gradient-to-r from-stone-500'
const DARK_STONE_GRADIENT_BG = 'bg-gradient-to-r from-stone-700'

const ORANGE_SOLID_BG = 'bg-orange-900';
const SLATE_SOLID_BG = 'bg-slate-800';
const YELLOW_SOLID_BG = 'bg-yellow-900';
const SKY_SOLID_BG = 'bg-sky-900';
const BLUE_SOLID_BG = 'bg-blue-900';
const INDIGO_SOLID_BG = 'bg-indigo-900';
const LIGHT_STONE_SOLID_BG = 'bg-stone-500'
const DARK_STONE_SOLID_BG = 'bg-stone-700'

export const RANKS_DESKTOP = [
  new NoneRankDesktop(),
  new PendingRankDesktop(),
  new StandardRank('Bronze I', 0, 765.42, ORANGE_GRADIENT_BG, Bronze1Icon),
  new StandardRank('Bronze II', 765.43, 913.71, ORANGE_GRADIENT_BG, Bronze2Icon),
  new StandardRank('Bronze III', 913.72, 1054.86, ORANGE_GRADIENT_BG, Bronze3Icon),
  new StandardRank('Silver I', 1054.87, 1188.87, SLATE_GRADIENT_BG, Silver1Icon),
  new StandardRank('Silver II', 1188.88, 1315.74, SLATE_GRADIENT_BG, Silver2Icon),
  new StandardRank('Silver III', 1315.75, 1435.47, SLATE_GRADIENT_BG, Silver3Icon),
  new StandardRank('Gold I', 1435.48, 1548.06, YELLOW_GRADIENT_BG, Gold1Icon),
  new StandardRank('Gold II', 1548.07, 1653.51, YELLOW_GRADIENT_BG, Gold2Icon),
  new StandardRank('Gold III', 1653.52, 1751.82, YELLOW_GRADIENT_BG, Gold3Icon),
  new StandardRank('Platinum I', 1751.83, 1842.99, SKY_GRADIENT_BG, Platinum1Icon),
  new StandardRank('Platinum II', 1843, 1927.02, SKY_GRADIENT_BG, Platinum2Icon),
  new StandardRank('Platinum III', 1927.03, 2003.91, SKY_GRADIENT_BG, Platinum3Icon),
  new StandardRank('Diamond I', 2003.92, 2073.66, BLUE_GRADIENT_BG, Diamond1Icon),
  new StandardRank('Diamond II', 2073.67, 2136.27, BLUE_GRADIENT_BG, Diamond2Icon),
  new StandardRank('Diamond III', 2136.28, 2191.74, BLUE_GRADIENT_BG, Diamond3Icon),
  new StandardRank('Master I', 2191.75, 2274.99, INDIGO_GRADIENT_BG, Master1Icon),
  new StandardRank('Master II', 2275, 2350, INDIGO_GRADIENT_BG, Master2Icon),
  new StandardRank('Master III', 2350, Infinity, INDIGO_GRADIENT_BG, Master3Icon),
  new GrandMasterDesktop()
]

export const RANKS_MOBILE = [
  new NoneRankMobile(),
  new PendingRankMobile(),
  new StandardRank('Bronze I', 0, 765.42, ORANGE_SOLID_BG, Bronze1Icon),
  new StandardRank('Bronze II', 765.43, 913.71, ORANGE_SOLID_BG, Bronze2Icon),
  new StandardRank('Bronze III', 913.72, 1054.86, ORANGE_SOLID_BG, Bronze3Icon),
  new StandardRank('Silver I', 1054.87, 1188.87, SLATE_SOLID_BG, Silver1Icon),
  new StandardRank('Silver II', 1188.88, 1315.74, SLATE_SOLID_BG, Silver2Icon),
  new StandardRank('Silver III', 1315.75, 1435.47, SLATE_SOLID_BG, Silver3Icon),
  new StandardRank('Gold I', 1435.48, 1548.06, YELLOW_SOLID_BG, Gold1Icon),
  new StandardRank('Gold II', 1548.07, 1653.51, YELLOW_SOLID_BG, Gold2Icon),
  new StandardRank('Gold III', 1653.52, 1751.82, YELLOW_SOLID_BG, Gold3Icon),
  new StandardRank('Platinum I', 1751.83, 1842.99, SKY_SOLID_BG, Platinum1Icon),
  new StandardRank('Platinum II', 1843, 1927.02, SKY_SOLID_BG, Platinum2Icon),
  new StandardRank('Platinum III', 1927.03, 2003.91, SKY_SOLID_BG, Platinum3Icon),
  new StandardRank('Diamond I', 2003.92, 2073.66, BLUE_SOLID_BG, Diamond1Icon),
  new StandardRank('Diamond II', 2073.67, 2136.27, BLUE_SOLID_BG, Diamond2Icon),
  new StandardRank('Diamond III', 2136.28, 2191.74, BLUE_SOLID_BG, Diamond3Icon),
  new StandardRank('Master I', 2191.75, 2274.99, INDIGO_SOLID_BG, Master1Icon),
  new StandardRank('Master II', 2275, 2350, INDIGO_SOLID_BG, Master2Icon),
  new StandardRank('Master III', 2350, Infinity, INDIGO_SOLID_BG, Master3Icon),
  new GrandMasterMobile()
]

export function getRankDesktop(player: Player) {
  for(let i = RANKS_DESKTOP.length - 1; i >= 0; i--) {
    if(RANKS_DESKTOP[i].isRank(player)) {
      return RANKS_DESKTOP[i]
    }
  }
  return new NoneRankDesktop()
}

export function getRankMobile(player: Player) {
  for(let i = RANKS_MOBILE.length - 1; i >= 0; i--) {
    if(RANKS_MOBILE[i].isRank(player)) {
      return RANKS_MOBILE[i]
    }
  }
  return new NoneRankMobile()
}