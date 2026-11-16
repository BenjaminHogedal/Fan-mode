'use client';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Ticket, Shirt, ShoppingBag } from 'lucide-react';
import { assets, getOpponentAsset } from '@/lib/assets';
import { useFanModus } from '@/context/FanModusContext';

export function Button({ children, onClick, secondary = false, icon = true, ...props }) {
  return <motion.button whileTap={{ scale: 0.98 }} className={`button ${secondary ? 'button-secondary' : ''}`} onClick={onClick} {...props}><span>{children}</span>{icon && <ArrowRight size={21} aria-hidden="true" />}</motion.button>;
}
export function Asset({ name, className = '' }) {
  const { match } = useFanModus();
  const asset = name === 'opponent' ? getOpponentAsset(match) : name === 'stadium' ? { src: null, label: match.stadium } : assets[name];
  if (asset?.src) return <span className={`asset-image ${className}`}><Image src={asset.src} alt={asset.label} fill sizes="(max-width: 430px) 100vw, 430px" unoptimized={name === 'opponent'} /></span>;
  if (name === 'stadium') return <Stadium className={className} label={asset.label} />;
  if (name === 'bvb' || name === 'opponent') return <span className={`club-placeholder ${name} ${className}`} aria-label={`${asset.label} — logo placeholder`}>{asset.label}</span>;
  const Icon = { jersey: Shirt, tickets: Ticket, merch: ShoppingBag }[name] || Ticket;
  return <div className={`product-placeholder ${className}`} role="img" aria-label={asset.label}><Icon strokeWidth={1} /><span>ASSET / {name.toUpperCase()}</span></div>;
}
export function Stadium({ className = '' }) {
  const { match } = useFanModus();
  return <svg className={`stadium ${className}`} viewBox="0 0 400 250" fill="none" role="img" aria-label={`${match.stadium} illustration placeholder`}><g stroke="currentColor" strokeWidth="1.2"><path d="M20 118 200 60l180 58-30 78-150 43L50 196Z"/><path d="m20 118 180 52 180-52M50 196l150-47 150 47M200 170v69M45 126l155 45 155-45M60 144l140 41 140-41M57 164l143 42 143-42M54 181l146 44 146-44"/><path d="m94 142 4 54m52-38 3 55m93-55-3 55m53-71-4 54M20 118V93m360 25V93M66 104V52m268 52V52M125 84V32m150 52V32M200 60V12"/><path d="m60 52 12-4m256 4 12-4m-221-16 12-4m138 4 12-4m-87-16 12-4" strokeWidth="7" className="stadium-lights"/><path d="m132 170 68-21 68 21-68 20Z"/><ellipse cx="200" cy="170" rx="17" ry="5"/><path d="M200 149v41"/></g><path d="m35 94 165-53 165 53" stroke="currentColor" strokeWidth="3"/><text x="200" y="125" textAnchor="middle" fill="currentColor" fontSize="11" letterSpacing="6">{match.stadium.toUpperCase()}</text></svg>;
}
export function MatchHeader({ phase = 'MATCHDAY', score = false }) {
  const { match } = useFanModus();
  const hasScore = match.home_score != null && match.away_score != null;
  return <div className="match-header"><p className="eyebrow">{phase}</p><div className="match-clubs"><Asset name="bvb" /><strong>{score && hasScore ? `${match.home_score} : ${match.away_score}` : 'VS'}</strong><Asset name="opponent" /></div><p className="match-names">BORUSSIA DORTMUND <span>{match.opponent_name.toUpperCase()}</span></p></div>;
}
