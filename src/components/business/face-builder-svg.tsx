'use client';

import React from 'react';

type HairStyle = 'short' | 'long' | 'ponytail' | 'ancient' | 'bob' | 'curly';
type FaceShape = 'round' | 'oval' | 'square' | 'heart';
type Expression = 'smile' | 'cool' | 'gentle' | 'serious' | 'mysterious';
type EyebrowStyle = 'jian' | 'liuye' | 'cuping' | 'wan';
type EyeShape = 'round' | 'danfeng' | 'taohua' | 'xiacui';
type MouthStyle = 'weixiao' | 'baochun' | 'houcun' | 'yingtao';
type Accessory = 'none' | 'roundGlasses' | 'squareGlasses';
type EarringStyle = 'none' | 'stud' | 'hoop';
type CollarStyle = 'round' | 'vneck' | 'turtleneck' | 'ancientCross';
type NoseType = 'small' | 'tall' | 'round' | 'delicate';

// ================================================================
// Particles
// ================================================================
export function renderParticles(color: string) {
  const particles = [
    { cx: 30, cy: 40, r: 1.5, delay: '0s', dur: '3s' },
    { cx: 200, cy: 30, r: 1, delay: '1s', dur: '4s' },
    { cx: 210, cy: 180, r: 1.2, delay: '0.5s', dur: '3.5s' },
    { cx: 25, cy: 170, r: 1, delay: '1.5s', dur: '4.5s' },
    { cx: 100, cy: 15, r: 2, delay: '2s', dur: '5s' },
    { cx: 170, cy: 195, r: 1.5, delay: '0.8s', dur: '3.8s' },
  ];
  return (
    <g>
      {particles.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={color} opacity="0.3">
          <animate attributeName="opacity" values="0.1;0.35;0.1" dur={p.dur} begin={p.delay} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${p.cy - 5};${p.cy + 5};${p.cy - 5}`} dur={p.dur} begin={p.delay} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  );
}

// ================================================================
// Shoulders & Neck & Collar
// ================================================================
export function renderShoulders(collar: CollarStyle, skinColor: string, isMale: boolean, accent: string) {
  const fillColor = isMale ? '#4a5565' : '#5c6b7a';
  const neckBase = isMale ? 'M112 145 L115 175 L125 175 L128 145' : 'M113 145 L116 172 L124 172 L127 145';

  const collarColors: Record<CollarStyle, { fill: string; accent: string }> = {
    round: { fill: isMale ? '#4a5565' : '#5c6b7a', accent },
    vneck: { fill: isMale ? '#3a4555' : '#4c5b6a', accent },
    turtleneck: { fill: isMale ? '#5a6575' : '#6c7b8a', accent },
    ancientCross: { fill: isMale ? '#2d3a4a' : '#3d4a5a', accent: '#d4a574' },
  };
  const c = collarColors[collar];

  return (
    <g>
      <path d="M50 185 Q70 170 95 175 L115 175 L125 175 L145 175 Q170 170 190 185 L195 240 L45 240 Z" fill={c.fill} opacity="0.8" />
      <path d={neckBase} fill={skinColor} />
      {collar === 'round' && <path d="M108 152 Q120 162 132 152" fill="none" stroke={c.accent} strokeWidth="1.2" strokeOpacity="0.4" />}
      {collar === 'vneck' && <path d="M110 152 L120 168 L130 152" fill="none" stroke={c.accent} strokeWidth="1.2" strokeOpacity="0.5" />}
      {collar === 'turtleneck' && <path d="M106 148 L106 160 Q120 166 134 160 L134 148 Q120 156 106 148" fill={c.fill} stroke={c.accent} strokeWidth="0.8" strokeOpacity="0.3" />}
      {collar === 'ancientCross' && (
        <g>
          <path d="M95 155 L120 175 L145 155" fill="none" stroke={c.accent} strokeWidth="1.5" strokeOpacity="0.5" />
          <path d="M100 158 L120 170 L110 180" fill="none" stroke="#d4a574" strokeWidth="1" strokeOpacity="0.4" />
        </g>
      )}
      <path d="M60 185 Q90 172 120 175 Q150 172 180 185" fill="none" stroke="white" strokeWidth="0.4" strokeOpacity="0.08" />
    </g>
  );
}

// ================================================================
// Hair — Back layer
// ================================================================
export function renderHairBack(style: HairStyle, _isMale: boolean, color: string) {
  if (style === 'short' || style === 'bob' || style === 'curly') return null;
  if (style === 'long') return (
    <g>
      <path d="M64 60 Q50 130 58 175 Q60 182 65 175 Q70 120 70 60" fill={color} />
      <path d="M170 60 Q184 130 178 175 Q176 182 171 175 Q168 120 168 60" fill={color} />
    </g>
  );
  if (style === 'ponytail') return (
    <path d="M100 70 Q108 120 105 178 Q103 184 110 182 Q113 178 112 120 Q115 70 115 70" fill={color} />
  );
  if (style === 'ancient') return (
    <g>
      <path d="M58 55 Q40 110 55 170" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <path d="M182 55 Q200 110 185 170" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
    </g>
  );
  return null;
}

// ================================================================
// Hair — Front layer
// ================================================================
export function renderHairFront(style: HairStyle, isMale: boolean, color: string) {
  switch (style) {
    case 'short':
      return (
        <g>
          <ellipse cx="120" cy="45" rx="56" ry="40" fill={color} />
          <rect x="66" y="32" width="108" height="28" rx="14" fill={color} />
          {isMale && <rect x="72" y="28" width="96" height="16" rx="4" fill={color} />}
          <path d="M80 38 Q90 34 100 38" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.15" />
          <path d="M110 35 Q120 30 130 35" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.15" />
          <path d="M140 38 Q150 34 160 38" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.15" />
        </g>
      );
    case 'long':
      return (
        <g>
          <ellipse cx="120" cy="42" rx="54" ry="38" fill={color} />
          <rect x="66" y="30" width="108" height="26" rx="13" fill={color} />
          <line x1="120" y1="32" x2="120" y2="50" stroke="white" strokeWidth="0.4" strokeOpacity="0.1" />
          <path d="M90 42 Q85 38 88 32" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.12" />
          <path d="M150 42 Q155 38 152 32" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.12" />
        </g>
      );
    case 'ponytail':
      return (
        <g>
          <ellipse cx="120" cy="40" rx="50" ry="36" fill={color} />
          <rect x="70" y="28" width="100" height="22" rx="11" fill={color} />
          <rect x="100" y="60" width="40" height="6" rx="3" fill="#fbbf24" opacity="0.6" />
        </g>
      );
    case 'ancient':
      return (
        <g>
          <ellipse cx="120" cy="44" rx="48" ry="34" fill={color} />
          <rect x="72" y="32" width="96" height="22" rx="11" fill={color} />
          <circle cx="85" cy="78" r="5" fill="#fbbf24" />
          <circle cx="155" cy="78" r="5" fill="#fbbf24" />
          <line x1="85" y1="78" x2="155" y2="78" stroke="#fbbf24" strokeWidth="1.5" />
          <path d="M75 50 Q80 46 85 50" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.15" />
          <path d="M155 50 Q160 46 165 50" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.15" />
        </g>
      );
    case 'bob':
      return (
        <g>
          <ellipse cx="120" cy="44" rx="52" ry="36" fill={color} />
          <path d="M66 55 Q62 95 70 112 Q74 114 76 108 Q72 90 72 55" fill={color} />
          <path d="M170 55 Q174 95 166 112 Q162 114 160 108 Q164 90 164 55" fill={color} />
          <rect x="66" y="30" width="108" height="24" rx="12" fill={color} />
        </g>
      );
    case 'curly':
      return (
        <g>
          <ellipse cx="120" cy="46" rx="56" ry="42" fill={color} />
          <circle cx="74" cy="36" r="18" fill={color} />
          <circle cx="98" cy="30" r="20" fill={color} />
          <circle cx="125" cy="29" r="21" fill={color} />
          <circle cx="150" cy="32" r="19" fill={color} />
          <circle cx="166" cy="38" r="16" fill={color} />
          <circle cx="86" cy="38" r="15" fill={color} />
          <circle cx="140" cy="36" r="16" fill={color} />
        </g>
      );
    default:
      return null;
  }
}

// ================================================================
// Hair highlight overlay
// ================================================================
export function renderHairHighlight(style: HairStyle, _isMale: boolean) {
  const highlights: Record<HairStyle, React.ReactElement | null> = {
    short: <ellipse cx="120" cy="38" rx="40" ry="18" fill="white" opacity="0.06" />,
    long: <ellipse cx="120" cy="35" rx="38" ry="16" fill="white" opacity="0.06" />,
    ponytail: <ellipse cx="120" cy="33" rx="36" ry="14" fill="white" opacity="0.06" />,
    ancient: <ellipse cx="120" cy="38" rx="34" ry="14" fill="white" opacity="0.06" />,
    bob: <ellipse cx="120" cy="38" rx="38" ry="16" fill="white" opacity="0.06" />,
    curly: <ellipse cx="120" cy="36" rx="30" ry="12" fill="white" opacity="0.06" />,
  };
  return highlights[style] || null;
}

// ================================================================
// Face shape path helper
// ================================================================
export function getFacePath(shape: FaceShape): string {
  const paths: Record<FaceShape, string> = {
    round: 'M58 104 Q58 55 120 52 Q182 55 182 104 Q182 158 120 164 Q58 158 58 104',
    oval: 'M62 102 Q62 52 120 48 Q178 52 178 102 Q178 156 120 162 Q62 156 62 102',
    square: 'M58 82 L58 82 Q58 58 120 54 Q182 58 182 82 L182 152 Q182 162 120 164 Q58 162 58 152 Z',
    heart: 'M120 56 Q156 32 178 60 Q188 78 178 98 L120 168 L62 98 Q52 78 62 60 Q84 32 120 56',
  };
  return paths[shape];
}

// ================================================================
// Face
// ================================================================
export function renderFace(shape: FaceShape, skinColor: string) {
  return <path d={getFacePath(shape)} fill={skinColor} />;
}

// ================================================================
// Eyebrows — 4 styles
// ================================================================
export function renderEyebrows(style: EyebrowStyle, eyeColor: string) {
  const paths: Record<EyebrowStyle, { left: string; right: string }> = {
    jian: { left: 'M68 76 Q80 70 92 74', right: 'M148 74 Q160 70 172 76' },
    liuye: { left: 'M70 78 Q80 72 90 76 Q82 74 72 78', right: 'M150 76 Q160 72 170 78 Q162 74 152 76' },
    cuping: { left: 'M68 76 L92 76', right: 'M148 76 L172 76' },
    wan: { left: 'M68 78 Q80 72 92 78', right: 'M148 78 Q160 72 172 78' },
  };
  const { left, right } = paths[style];
  return (
    <g>
      <path d={left} fill="none" stroke={eyeColor} strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.75" />
      <path d={right} fill="none" stroke={eyeColor} strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.75" />
    </g>
  );
}

// ================================================================
// Eyes — 4 shapes + 5 expressions, with pupils and highlights
// ================================================================
export function renderEyes(shape: EyeShape, expr: Expression, eyeColor: string) {
  // Define eye contours based on shape
  const contourMap: Record<EyeShape, { leftCx: number; rightCx: number; cy: number; rx: number; ry: number }> = {
    round: { leftCx: 84, rightCx: 156, cy: 104, rx: 14, ry: 16 },
    danfeng: { leftCx: 82, rightCx: 158, cy: 104, rx: 16, ry: 8 },
    taohua: { leftCx: 84, rightCx: 156, cy: 104, rx: 13, ry: 13 },
    xiacui: { leftCx: 84, rightCx: 156, cy: 106, rx: 13, ry: 14 },
  };

  const c = contourMap[shape];
  const eyeContour = (cx: number) => {
    if (shape === 'danfeng') {
      return `M${cx - c.rx} ${c.cy} Q${cx} ${c.cy - c.ry - 3} ${cx + c.rx} ${c.cy}`;
    }
    if (shape === 'xiacui') {
      return `M${cx - c.rx} ${c.cy - 4} Q${cx} ${c.cy + c.ry} ${cx + c.rx} ${c.cy - 4}`;
    }
    return `M${cx - c.rx} ${c.cy - 3} Q${cx} ${c.cy - c.ry - 3} ${cx + c.rx} ${c.cy - 3} Q${cx} ${c.cy + c.ry} ${cx - c.rx} ${c.cy - 3}`;
  };

  // Expression affects pupil position and eyelid
  const exprMod: Record<Expression, { pupilY: number; isClosed: boolean; squint: number }> = {
    smile: { pupilY: c.cy, isClosed: false, squint: 0 },
    cool: { pupilY: c.cy - 1, isClosed: false, squint: 2 },
    gentle: { pupilY: c.cy, isClosed: false, squint: 1 },
    serious: { pupilY: c.cy, isClosed: false, squint: 0 },
    mysterious: { pupilY: c.cy + 1, isClosed: false, squint: 1 },
  };

  const mod = exprMod[expr];
  const pupilR = shape === 'danfeng' ? 3.5 : 4.5;

  return (
    <g>
      {/* Left eye */}
      <g>
        {/* Eyelashes — top lid */}
        {!mod.isClosed && (
          <>
            <path d={`M${c.leftCx - c.rx + 2} ${c.cy - c.ry - 2} Q${c.leftCx - c.rx + 3} ${c.cy - c.ry - 4} ${c.leftCx - c.rx + 4} ${c.cy - c.ry - 2}`}
              fill="none" stroke={eyeColor} strokeWidth="1" strokeOpacity="0.5" />
            <path d={`M${c.leftCx + c.rx - 2} ${c.cy - c.ry - 2} Q${c.leftCx + c.rx - 3} ${c.cy - c.ry - 4} ${c.leftCx + c.rx - 4} ${c.cy - c.ry - 2}`}
              fill="none" stroke={eyeColor} strokeWidth="1" strokeOpacity="0.5" />
          </>
        )}
        {/* Eye white */}
        <ellipse cx={c.leftCx} cy={c.cy} rx={c.rx} ry={c.ry} fill="white" opacity="0.9" />
        {/* Iris / pupil */}
        <ellipse cx={c.leftCx} cy={mod.pupilY} rx={pupilR} ry={pupilR + 1} fill={eyeColor} />
        <ellipse cx={c.leftCx} cy={mod.pupilY} rx={pupilR - 1.5} ry={pupilR - 1} fill="#111" />
        {/* Pupil highlight — vivid key */}
        <circle cx={c.leftCx + 2} cy={mod.pupilY - 2.5} r={2} fill="white" opacity="0.85" />
        <circle cx={c.leftCx - 1.5} cy={mod.pupilY + 1} r={0.8} fill="white" opacity="0.5" />
        {/* Eye contour */}
        <path d={eyeContour(c.leftCx)} fill="none" stroke={eyeColor} strokeWidth="1.5" strokeOpacity="0.7" />
        {/* Squint (eye smile) */}
        {mod.squint > 0 && (
          <path d={`M${c.leftCx - c.rx} ${c.cy - mod.squint} Q${c.leftCx} ${c.cy - c.ry + mod.squint} ${c.leftCx + c.rx} ${c.cy - mod.squint}`}
            fill="none" stroke={eyeColor} strokeWidth="1" strokeOpacity="0.3" />
        )}
      </g>
      {/* Right eye */}
      <g>
        {!mod.isClosed && (
          <>
            <path d={`M${c.rightCx - c.rx + 2} ${c.cy - c.ry - 2} Q${c.rightCx - c.rx + 3} ${c.cy - c.ry - 4} ${c.rightCx - c.rx + 4} ${c.cy - c.ry - 2}`}
              fill="none" stroke={eyeColor} strokeWidth="1" strokeOpacity="0.5" />
            <path d={`M${c.rightCx + c.rx - 2} ${c.cy - c.ry - 2} Q${c.rightCx + c.rx - 3} ${c.cy - c.ry - 4} ${c.rightCx + c.rx - 4} ${c.cy - c.ry - 2}`}
              fill="none" stroke={eyeColor} strokeWidth="1" strokeOpacity="0.5" />
          </>
        )}
        <ellipse cx={c.rightCx} cy={c.cy} rx={c.rx} ry={c.ry} fill="white" opacity="0.9" />
        <ellipse cx={c.rightCx} cy={mod.pupilY} rx={pupilR} ry={pupilR + 1} fill={eyeColor} />
        <ellipse cx={c.rightCx} cy={mod.pupilY} rx={pupilR - 1.5} ry={pupilR - 1} fill="#111" />
        <circle cx={c.rightCx + 2} cy={mod.pupilY - 2.5} r={2} fill="white" opacity="0.85" />
        <circle cx={c.rightCx - 1.5} cy={mod.pupilY + 1} r={0.8} fill="white" opacity="0.5" />
        <path d={eyeContour(c.rightCx)} fill="none" stroke={eyeColor} strokeWidth="1.5" strokeOpacity="0.7" />
        {mod.squint > 0 && (
          <path d={`M${c.rightCx - c.rx} ${c.cy - mod.squint} Q${c.rightCx} ${c.cy - c.ry + mod.squint} ${c.rightCx + c.rx} ${c.cy - mod.squint}`}
            fill="none" stroke={eyeColor} strokeWidth="1" strokeOpacity="0.3" />
        )}
      </g>
    </g>
  );
}

// ================================================================
// Nose — 4 types
// ================================================================
export function renderNose(type: NoseType, eyeColor: string) {
  const nosePaths: Record<NoseType, string> = {
    small: 'M116 112 L116 120 Q120 122 124 120 L124 112',
    tall: 'M115 110 L115 123 Q120 126 125 123 L125 110',
    round: 'M114 112 Q117 118 120 120 Q123 118 126 112',
    delicate: 'M116 112 L118 119 Q120 121 122 119 L124 112',
  };
  return (
    <g>
      <path d={nosePaths[type]} fill="none" stroke={eyeColor} strokeWidth="1" strokeOpacity="0.2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

// ================================================================
// Mouth — 4 styles with lip color + expressions
// ================================================================
export function renderMouth(style: MouthStyle, expr: Expression) {
  const baseY = 133;
  // Base mouth shapes
  const mouthBase: Record<MouthStyle, string> = {
    weixiao: `M110 ${baseY} Q120 ${baseY + 8} 130 ${baseY}`,
    baochun: `M112 ${baseY} Q120 ${baseY + 2} 128 ${baseY}`,
    houcun: `M108 ${baseY} Q120 ${baseY + 10} 132 ${baseY}`,
    yingtao: `M113 ${baseY} Q120 ${baseY + 6} 127 ${baseY}`,
  };

  // Expression modifiers
  const exprMod: Record<Expression, { curve: number; fillOpacity: number; isOpen: boolean }> = {
    smile: { curve: 0, fillOpacity: 0.6, isOpen: false },
    cool: { curve: -2, fillOpacity: 0.4, isOpen: false },
    gentle: { curve: 2, fillOpacity: 0.5, isOpen: false },
    serious: { curve: 0, fillOpacity: 0.4, isOpen: false },
    mysterious: { curve: 1, fillOpacity: 0.55, isOpen: true },
  };

  const mod = exprMod[expr];
  const lipColor = '#e8536c';
  const lipDark = '#c2416c';

  if (style === 'baochun') {
    // Simple thin line for thin lips
    return (
      <path d={`M112 ${baseY + mod.curve} L128 ${baseY + mod.curve}`}
        fill="none" stroke={lipColor} strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
    );
  }

  return (
    <g>
      {/* Upper lip */}
      <path d={mouthBase[style]}
        fill={`url(#lipGrad)`} stroke={lipDark} strokeWidth="0.8" strokeOpacity="0.3" />
      {/* Lower lip fill */}
      <path d={`M109 ${baseY} Q120 ${baseY + 8 + mod.curve} 131 ${baseY}`}
        fill={lipColor} fillOpacity={mod.fillOpacity * 0.5} />
      {/* Lip gloss highlight */}
      <path d={`M114 ${baseY + 1} Q120 ${baseY + 4} 126 ${baseY + 1}`}
        fill="none" stroke="white" strokeWidth="0.8" strokeOpacity="0.2" strokeLinecap="round" />
    </g>
  );
}

// ================================================================
// Glasses
// ================================================================
export function renderGlasses(accessory: Accessory, accent: string) {
  if (accessory === 'none') return null;

  const frameColor = '#334155';
  const lensOpacity = 0.08;

  if (accessory === 'roundGlasses') {
    return (
      <g>
        <circle cx="84" cy="104" r="18" fill={accent} opacity={lensOpacity} />
        <circle cx="156" cy="104" r="18" fill={accent} opacity={lensOpacity} />
        <circle cx="84" cy="104" r="18" fill="none" stroke={frameColor} strokeWidth="2.5" />
        <circle cx="156" cy="104" r="18" fill="none" stroke={frameColor} strokeWidth="2.5" />
        <line x1="102" y1="104" x2="138" y2="104" stroke={frameColor} strokeWidth="2" />
        <line x1="66" y1="102" x2="62" y2="94" stroke={frameColor} strokeWidth="2" strokeLinecap="round" />
        <line x1="174" y1="102" x2="178" y2="94" stroke={frameColor} strokeWidth="2" strokeLinecap="round" />
        {/* Lens reflections */}
        <path d="M76 96 Q80 92 84 96" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
        <path d="M148 96 Q152 92 156 96" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
      </g>
    );
  }

  if (accessory === 'squareGlasses') {
    return (
      <g>
        <rect x="66" y="88" width="36" height="32" rx="4" fill={accent} opacity={lensOpacity} />
        <rect x="138" y="88" width="36" height="32" rx="4" fill={accent} opacity={lensOpacity} />
        <rect x="66" y="88" width="36" height="32" rx="4" fill="none" stroke={frameColor} strokeWidth="2.5" />
        <rect x="138" y="88" width="36" height="32" rx="4" fill="none" stroke={frameColor} strokeWidth="2.5" />
        <line x1="102" y1="104" x2="138" y2="104" stroke={frameColor} strokeWidth="2" />
        <line x1="66" y1="102" x2="60" y2="94" stroke={frameColor} strokeWidth="2" strokeLinecap="round" />
        <line x1="174" y1="102" x2="180" y2="94" stroke={frameColor} strokeWidth="2" strokeLinecap="round" />
        <path d="M74 96 L82 96" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
        <path d="M146 96 L154 96" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" />
      </g>
    );
  }

  return null;
}

// ================================================================
// Earrings
// ================================================================
export function renderEarrings(style: EarringStyle, accent: string, _isMale: boolean) {
  if (style === 'none') return null;

  const earX = 56;
  const earY = 110;

  return (
    <g>
      {style === 'stud' && (
        <>
          <circle cx={earX} cy={earY} r="3" fill={accent} opacity="0.8" />
          <circle cx={earX} cy={earY} r="1.2" fill="white" opacity="0.5" />
          <circle cx={184} cy={earY} r="3" fill={accent} opacity="0.8" />
          <circle cx={184} cy={earY} r="1.2" fill="white" opacity="0.5" />
        </>
      )}
      {style === 'hoop' && (
        <>
          <circle cx={earX} cy={earY + 5} r="6" fill="none" stroke={accent} strokeWidth="2" opacity="0.8" />
          <circle cx={earX} cy={earY - 1} r="2" fill={accent} opacity="0.8" />
          <circle cx={184} cy={earY + 5} r="6" fill="none" stroke={accent} strokeWidth="2" opacity="0.8" />
          <circle cx={184} cy={earY - 1} r="2" fill={accent} opacity="0.8" />
        </>
      )}
    </g>
  );
}
