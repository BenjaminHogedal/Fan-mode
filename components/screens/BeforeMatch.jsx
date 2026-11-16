'use client';
import Image from 'next/image';
import { useFanModus } from '@/context/FanModusContext';
import MatchdayMatchup from '@/components/ui/MatchdayMatchup';

export function BvbMenu() {
  const { dispatch, session } = useFanModus();
  const active = session.fanModusStatus === 'active';
  const enterFanModus = () => dispatch({ type: 'NAVIGATE', screen: active ? (session.matchPhase === 'pre-match' ? 'kickoff' : session.matchPhase) : 'intro' });
  return <div className="screen menu-screen matchday-menu">
    <MatchdayMatchup/>
    <h1><span>SPIELTACHS-</span><span>SPIELE</span></h1>
    <div className="matchday-tiles">
      <button className="matchday-tile lineup-tile" disabled>
        <Image className="tile-background" src="/icons/bvb-tile.svg" alt="" width={173} height={172}/>
        <Image className="shirt-art" src="/icons/bvb-shirt.svg" alt="" width={32} height={36}/>
        <Image className="shirt-detail" src="/icons/bvb-shirt-neck.svg" alt="" width={13} height={10}/>
        <span className="tile-label">Startelf-Tipp</span>
      </button>
      <button className="matchday-tile polls-tile" disabled>
        <Image className="tile-background" src="/icons/bvb-tile.svg" alt="" width={173} height={172}/>
        <Image className="poll-art" src="/icons/bvb-poll.svg" alt="" width={38} height={31}/>
        <Image className="poll-tail" src="/icons/bvb-poll-tail.svg" alt="" width={9} height={9}/>
        <span className="poll-question">?!</span>
        <span className="poll-label">Umfragen zum</span>
        <span className="poll-label poll-label-second">Spiel</span>
      </button>
      <button className="matchday-tile fanmodus-tile" onClick={enterFanModus}>
        <Image className="tile-background" src="/icons/bvb-tile.svg" alt="" width={173} height={172}/>
        <Image className="phone-body" src="/icons/bvb-phone.svg" alt="" width={19.6} height={31.6}/>
        <Image className="phone-speaker" src="/icons/bvb-phone-speaker.svg" alt="" width={9} height={2}/>
        <Image className="phone-dot" src="/icons/bvb-phone-dot.svg" alt="" width={3.4} height={3.4}/>
        <Image className="phone-slash" src="/icons/bvb-phone-slash.svg" alt="" width={33} height={44}/>
        <Image className="vodafone-icon" src="/icons/vodafone.svg" alt="" width={20} height={20}/>
        <Image className="vodafone-symbol" src="/icons/vodafone-mark.svg" alt="" width={15} height={13}/>
        <span className="vodafone-label">vodafone</span>
        <span className="fanmodus-label">FanModus</span>
      </button>
    </div>
    <div className="study-project-badge" lang="da"><p>STUDIEPROJEKT · EAAA MULTIMEDIEDESIGN</p><p>Ikke tilknyttet Borussia Dortmund eller Vodafone</p></div>
    <nav className="bvb-tab-bar" aria-label="BVB App-Navigation">
      <Image className="tab-bar-background" src="/icons/bvb-bottom-nav.svg" alt="" width={390} height={80}/>
      <Image className="active-tab-background" src="/icons/bvb-bottom-active.svg" alt="" width={80} height={58}/>
      <button className="tab-button news-button" aria-label="News" disabled>
        <Image className="news-icon" src="/icons/bvb-news.svg" alt="" width={22} height={25}/>
        {[0, 1, 2, 3].map((line) => <Image key={line} className={`news-rule news-rule-${line + 1}`} src="/icons/bvb-news-rule.svg" alt="" width={13.4} height={1.4}/>) }
        <span className="tab-label">News</span>
      </button>
      <button className="tab-button squad-button" aria-label="Kader" disabled>
        <Image className="squad-icon" src="/icons/bvb-squad.svg" alt="" width={31} height={27}/><span className="squad-number">09</span>
        <span className="tab-label">Kader</span>
      </button>
      <button className="tab-button fixtures-button" aria-current="page" aria-label="Spielplan" disabled>
        <Image className="fixtures-icon" src="/icons/bvb-fixtures.svg" alt="" width={26} height={27}/>
        <Image className="fixtures-inner-icon" src="/icons/bvb-fixtures-inner.svg" alt="" width={14} height={15}/><span className="fixtures-number">9</span>
        <span className="tab-label">Spielplan</span>
      </button>
      <button className="tab-button my-bvb-button" aria-label="Mein BVB" disabled>
        <Image className="my-bvb-icon" src="/icons/bvb-my-bvb.svg" alt="" width={33.6} height={31.6}/>
        <Image className="my-bvb-neck" src="/icons/bvb-my-bvb-neck.svg" alt="" width={14} height={9}/>
        <span className="tab-label">Mein BVB</span>
      </button>
      <button className="tab-button more-button" aria-label="Mehr" disabled>
        {[0, 1, 2].map((line) => <Image key={line} className={`more-line more-line-${line + 1}`} src="/icons/bvb-more.svg" alt="" width={23} height={3}/>) }
        <span className="tab-label">Mehr</span>
      </button>
      <Image className="home-indicator" src="/icons/bvb-home-indicator.svg" alt="" width={114} height={4}/>
    </nav>
  </div>;
}
