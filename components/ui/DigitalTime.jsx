const segments = {
  a: '8,0 38,0 32,6 14,6', b: '39,2 39,35 33,30 33,9',
  c: '39,41 39,74 33,67 33,47', d: '8,76 38,76 32,70 14,70',
  e: '1,41 7,47 7,67 1,74', f: '1,2 7,9 7,30 1,35',
  g: '9,35 31,35 37,38 31,41 9,41 3,38',
};
const digits = ['abcdef', 'bc', 'abdeg', 'abcdg', 'bcfg', 'acdfg', 'acdefg', 'abc', 'abcdefg', 'abcdfg'];

export default function DigitalTime({ value, className = '' }) {
  const characters = [...value];
  const width = characters.reduce((sum, char) => sum + (char === ':' ? 23 : 52), 0) - 12;
  let offset = 0;
  return <svg className={`digital-time ${className}`} viewBox={`0 0 ${width} 76`} role="img" aria-label={value}>{characters.map((char, index) => {
    const x = offset;
    offset += char === ':' ? 23 : 52;
    return char === ':' ? <g key={index} transform={`translate(${x}, 0)`}><rect x="0" y="23" width="6" height="6"/><rect x="0" y="48" width="6" height="6"/></g> : <g key={index} transform={`translate(${x}, 0)`}>{Object.entries(segments).map(([key, points]) => <polygon key={key} points={points} opacity={digits[Number(char)]?.includes(key) ? 1 : 0.035}/>)}</g>;
  })}</svg>;
}
