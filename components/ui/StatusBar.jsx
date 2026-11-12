import { Signal, Wifi, BatteryFull } from 'lucide-react';

export default function StatusBar() {
  return <div className="ios-status-bar" aria-label="Status bar preview: 9:41, full signal, Wi-Fi connected, full battery"><span className="ios-time">9:41</span><div className="ios-status-icons" aria-hidden="true"><Signal size={18} strokeWidth={3}/><Wifi size={18} strokeWidth={2.5}/><BatteryFull size={24} strokeWidth={2}/></div></div>;
}
