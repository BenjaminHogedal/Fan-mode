import { Suspense } from 'react';
import { connection } from 'next/server';
import LoadingState from '@/components/ui/LoadingState';
import FanModusApp from '@/components/FanModusApp';
import { supabase } from '@/lib/supabase';

async function MatchData() {
  try {
    await connection();
    if (!supabase) throw new Error('Supabase environment variables are missing.');

    const { data: match, error } = await supabase
      .from('matches')
      .select('id, opponent_name, opponent_short, opponent_logo, kickoff, stadium, home_score, away_score')
      .gte('kickoff', new Date().toISOString())
      .order('kickoff', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!match) {
      return <FanModusApp match={null} matchError="No upcoming matches found." />;
    }

    return <FanModusApp match={match} />;
  } catch {
    return <FanModusApp match={null} matchError="Could not load match data. Please try again." />;
  }
}

export default function Home() {
  return <Suspense fallback={<LoadingState />}><MatchData /></Suspense>;
}
