'use client';
import { WifiOff, MapPinOff, CircleAlert } from 'lucide-react';
import { Button, Eyebrow } from './Primitives';
const errors = {
  connection: [WifiOff, 'CONNECTION LOST', 'Please check your connection and try again.'],
  activation: [CircleAlert, 'ACTIVATION FAILED', 'We couldn’t activate FanModus. Please try again.'],
  location: [MapPinOff, 'LOCATION REQUIRED', 'Enable location access to activate FanModus at the stadium.'],
};
export default function ErrorState({ type, onRetry, onClose, message }) {
  const [Icon, title, text] = errors[type];
  return <div className="error-content" role="alert"><Icon size={54} strokeWidth={1}/><Eyebrow>A LITTLE INTERRUPTION</Eyebrow><h1 className="medium-title">{title}</h1><p>{message || text}</p><Button onClick={onRetry}>TRY AGAIN</Button><button className="text-button" onClick={onClose}>BACK TO EXPERIENCE</button></div>;
}
