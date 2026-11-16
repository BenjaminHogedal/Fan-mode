import { Suspense } from 'react';
import { connection } from 'next/server';
import LoadingState from '@/components/ui/LoadingState';
import FanModusApp from '@/components/FanModusApp';
import DesktopViewport from '@/components/ui/DesktopViewport';
import { supabase } from '@/lib/supabase';

async function MatchData() {
  let match = null;
  let matchError;
  try {
    await connection();
    if (!supabase) throw new Error('Supabase environment variables are missing.');

    const { data, error } = await supabase
      .from('matches')
      .select('id, opponent_name, opponent_short, opponent_logo, kickoff, stadium, home_score, away_score')
      .gte('kickoff', new Date().toISOString())
      .order('kickoff', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    match = data;
    if (!match) matchError = 'No upcoming matches found.';
  } catch {
    matchError = 'Could not load match data. Please try again.';
  }
  return <FanModusApp match={match} matchError={matchError} />;
}

export default function Home() {
  return <DesktopViewport><Suspense fallback={<LoadingFallback />}><MatchData /></Suspense></DesktopViewport>;
}

function LoadingFallback() {
  return <div className="app-shell"><div className="loading-state-host"><LoadingState /></div></div>;
}
