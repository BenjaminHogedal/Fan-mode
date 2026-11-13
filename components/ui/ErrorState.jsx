'use client';
import FigmaScreen, { FigmaSvg } from './FigmaScreen';
import styles from './States.module.css';

const errors = {
  connection: { nodeId: '44:10145', image: 'seated-fan.png', imageNodeId: '161:82', title: 'No connection', copy: 'please check your internet connection and\ntry again', illustration: 'seated' },
  'connection-alt': { nodeId: '44:10146', image: 'standing-fan.png', imageNodeId: '161:79', title: 'No connection', copy: 'please check your internet connection and\ntry again', illustration: 'standing' },
  activation: { nodeId: '44:10147', image: 'ticket.png', imageNodeId: '161:133', title: 'Activation failed', copy: 'we couldn’t activate fan mode.\nplease try again', illustration: 'ticket' },
  location: { nodeId: '44:10147', image: 'ticket.png', imageNodeId: '161:133', title: 'Location required', copy: 'Enable location access to activate\nFanModus at the stadium.', illustration: 'ticket' },
};
export default function ErrorState({ type, onRetry, message }) {
  const error = errors[type];
  const alert = ['activation', 'location'].includes(type);
  return <FigmaScreen nodeId={error.nodeId} label={error.title}>
    <div className={`${styles.illustration} ${styles[error.illustration]}`} data-node-id={error.imageNodeId}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/images/states/${error.image}`} alt="" draggable={false}/>
    </div>
    <div className={styles.errorText} role="alert">
      <div className={styles.errorHeading}><span className={`${styles.blinkIcon} ${alert ? styles.alertIcon : styles.wifiIcon}`} data-node-id={alert ? '355:2025' : '355:1963'} aria-hidden="true"><span className={styles.blinkDefault}><FigmaSvg src={`/images/states/${alert ? 'alert' : 'no-wifi'}.svg`}/></span><span className={styles.blinkDim}><FigmaSvg src={`/images/states/${alert ? 'alert' : 'no-wifi'}-dim.svg`}/></span></span><h1>{error.title}</h1></div>
      <p>{message || error.copy}</p>
    </div>
    <button className={styles.retry} onClick={onRetry}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/states/paper.png" alt="" draggable={false}/><span>try again</span>
    </button>
  </FigmaScreen>;
}
