'use client';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Ticket, ShoppingBag, Crown, Ellipsis } from 'lucide-react';
import { useFanModus } from '@/context/FanModusContext';
import { Button, Asset } from '@/components/ui/Primitives';
import Modal from '@/components/ui/Modal';
import MatchdayMatchup from '@/components/ui/MatchdayMatchup';
import FanModusWordmark from '@/components/ui/FanModusWordmark';

export function BvbMenu() {
  const { dispatch, session } = useFanModus();
  const [preview, setPreview] = useState(null);
  const closePreview = useCallback(() => setPreview(null), []);
  const active = session.fanModusStatus === 'active';
  const enterFanModus = () => dispatch({ type: 'NAVIGATE', screen: active ? (session.matchPhase === 'pre-match' ? 'kickoff' : session.matchPhase) : 'intro' });
  return <div className="screen menu-screen matchday-menu">
    <MatchdayMatchup/>
    <h1><span>SPIELTACHS-</span><span>SPIELE</span></h1>
    <div className="matchday-tiles">
      <button className="matchday-tile lineup-tile" onClick={() => setPreview('Startelf-Tipp')}>
        <Image className="tile-background" src="/icons/bvb-tile.svg" alt="" width={173} height={172}/>
        <Image className="shirt-art" src="/icons/bvb-shirt.svg" alt="" width={32} height={36}/>
        <Image className="shirt-detail" src="/icons/bvb-shirt-neck.svg" alt="" width={13} height={10}/>
        <span className="tile-label">Startelf-Tipp</span>
      </button>
      <button className="matchday-tile polls-tile" onClick={() => setPreview('Umfragen zum Spiel')}>
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
    <nav className="bvb-tab-bar" aria-label="BVB App-Navigation">
      <Image className="tab-bar-background" src="/icons/bvb-bottom-nav.svg" alt="" width={390} height={80}/>
      <Image className="active-tab-background" src="/icons/bvb-bottom-active.svg" alt="" width={80} height={58}/>
      <button className="tab-button news-button" aria-label="News" onClick={() => setPreview('News')}>
        <Image className="news-icon" src="/icons/bvb-news.svg" alt="" width={22} height={25}/>
        {[0, 1, 2, 3].map((line) => <Image key={line} className={`news-rule news-rule-${line + 1}`} src="/icons/bvb-news-rule.svg" alt="" width={13.4} height={1.4}/>) }
        <span className="tab-label">News</span>
      </button>
      <button className="tab-button squad-button" aria-label="Kader" onClick={() => setPreview('Kader')}>
        <Image className="squad-icon" src="/icons/bvb-squad.svg" alt="" width={31} height={27}/><span className="squad-number">09</span>
        <span className="tab-label">Kader</span>
      </button>
      <button className="tab-button fixtures-button" aria-current="page" aria-label="Spielplan" onClick={() => setPreview(null)}>
        <Image className="fixtures-icon" src="/icons/bvb-fixtures.svg" alt="" width={26} height={27}/>
        <Image className="fixtures-inner-icon" src="/icons/bvb-fixtures-inner.svg" alt="" width={14} height={15}/><span className="fixtures-number">9</span>
        <span className="tab-label">Spielplan</span>
      </button>
      <button className="tab-button my-bvb-button" aria-label="Mein BVB" onClick={() => setPreview('Mein BVB')}>
        <Image className="my-bvb-icon" src="/icons/bvb-my-bvb.svg" alt="" width={33.6} height={31.6}/>
        <Image className="my-bvb-neck" src="/icons/bvb-my-bvb-neck.svg" alt="" width={14} height={9}/>
        <span className="tab-label">Mein BVB</span>
      </button>
      <button className="tab-button more-button" aria-label="Mehr" onClick={() => setPreview('Mehr')}>
        {[0, 1, 2].map((line) => <Image key={line} className={`more-line more-line-${line + 1}`} src="/icons/bvb-more.svg" alt="" width={23} height={3}/>) }
        <span className="tab-label">Mehr</span>
      </button>
      <Image className="home-indicator" src="/icons/bvb-home-indicator.svg" alt="" width={114} height={4}/>
    </nav>
    {preview && <Modal title={preview} onClose={closePreview}><div className="menu-feature-preview"><h2>{preview}</h2><p>This part of the BVB app is a placeholder in this prototype. Explore the complete FanModus matchday experience.</p><Button onClick={enterFanModus}>OPEN FANMODUS</Button><button className="text-button" onClick={() => setPreview(null)}>BACK TO MATCHDAY</button></div></Modal>}
  </div>;
}

export function HowItWorks() {
  const { dispatch } = useFanModus();
  const steps = [['ACTIVATE', 'AT THE STADIUM', 'Turn on FanModus when you are at Westfalenstadion.'], ['KEEP IT AWAY', null, 'Leave your phone in your pocket.'], ['COLLECT ENTRIES', null, 'Earn entries for every phone-free minute.']];
  return <div className="screen how-screen">
    <Asset name="stand" className="scene-backdrop"/><FanModusWordmark/>
    <div className="how-title"><h1>HOW IT<br/>WORKS</h1><div className="scribble-underline" aria-hidden="true"/></div>
    <div className="reference-steps">{steps.map(([title, secondLine, text], i) => <div className="reference-step" key={title}><span className="circled-step">{i + 1}</span><div><h2><span>{title}</span>{secondLine && <span>{secondLine}</span>}</h2><p>{text}</p></div></div>)}</div>
    <div className="bottom-actions"><button className="paper-button arrow-paper" aria-label="Continue to prizes" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'prizes' })}><ArrowRight size={108} strokeWidth={1}/></button></div>
  </div>;
}

export function Prizes() {
  const { dispatch } = useFanModus();
  const [allPrizes, setAllPrizes] = useState(false);
  const closePrizes = useCallback(() => setAllPrizes(false), []);
  return <div className="screen prizes-screen">
    <FanModusWordmark/>
    <div className="prizes-title"><Crown size={57} strokeWidth={1.7} aria-hidden="true"/><h1>WIN PRIZES</h1></div>
    <p className="prize-intro">The longer you stay phone-free,<br/>the higher your chance of winning.</p>
    <div className="jersey-hero"><Asset name="jersey"/><span className="jersey-caption">SIGNED<br/>JERSEY</span></div>
    <div className="reward-categories"><div><Ticket size={24}/><span>Match<br/>tickets</span></div><div><ShoppingBag size={24}/><span>BVB<br/>merch</span></div><div><Ellipsis size={26}/><span>And more</span></div></div>
    <button className="text-button all-prizes-button" onClick={() => setAllPrizes(true)}>SEE ALL PRIZES</button>
    <div className="bottom-actions"><button className="editorial-cta" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'activation' })}>GET MATCH READY <ArrowRight size={35}/></button></div>
    {allPrizes && <Modal title="MATCHDAY REWARDS" onClose={closePrizes}><div className="all-prizes-list">{[['jersey', 'Signed BVB jersey'], ['tickets', 'Match tickets'], ['merch', 'Exclusive BVB merchandise']].map(([name, label]) => <div key={name}><Asset name={name}/><h2>{label}</h2></div>)}<p className="fine-print">Illustrative prizes. No real prize draw takes place in this prototype.</p><Button onClick={() => setAllPrizes(false)}>BACK TO PRIZES</Button></div></Modal>}
  </div>;
}
