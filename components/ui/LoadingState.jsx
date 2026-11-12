'use client';
import { useEffect, useState } from 'react';
import { Asset } from './Primitives';
export default function LoadingState() {
  const [slow, setSlow] = useState(false);
  useEffect(() => { const id = setTimeout(() => setSlow(true), 5000); return () => clearTimeout(id); }, []);
  return <div className="screen centered loading-screen" role="status"><Asset name="stadium"/><h1>WARMING<br/><span>UP...</span></h1><p>{slow ? 'The connection is taking longer than usual.' : 'We’re getting things ready for you.'}</p><div className="loading-dots" aria-hidden="true"><i/><i/><i/></div></div>;
}
