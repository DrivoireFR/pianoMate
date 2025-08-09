export const PITCH_CLASS_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

export function nameToPitchClass(name) {
  const idx = PITCH_CLASS_NAMES.indexOf(name);
  if (idx === -1) throw new Error(`Unknown pitch class: ${name}`);
  return idx;
}

export function getScalePitchClasses(tonicPc, mode) {
  const intervals = mode === 'minor'
    ? [0, 2, 3, 5, 7, 8, 10] // natural minor
    : [0, 2, 4, 5, 7, 9, 11]; // major
  return new Set(intervals.map(semi => (tonicPc + semi) % 12));
}

function rotateArray(arr, startIndex) {
  return arr.slice(startIndex).concat(arr.slice(0, startIndex));
}

function computeScaleSemitonesFromTonic(mode) {
  return mode === 'minor'
    ? [0, 2, 3, 5, 7, 8, 10]
    : [0, 2, 4, 5, 7, 9, 11];
}

function chordQualityForDegree(mode, degreeIndex) {
  // degreeIndex: 0..6
  // Qualities for triads in major and natural minor
  if (mode === 'major') {
    return ['M', 'm', 'm', 'M', 'M', 'm', 'dim'][degreeIndex];
  } else {
    // natural minor
    return ['m', 'dim', 'M', 'm', 'm', 'M', 'M'][degreeIndex];
  }
}

function romanNumeralForDegree(mode, degreeIndex) {
  const romans = ['I','II','III','IV','V','VI','VII'];
  const quality = chordQualityForDegree(mode, degreeIndex);
  if (quality === 'dim') return romans[degreeIndex] + '°';
  return quality === 'M' ? romans[degreeIndex] : romans[degreeIndex].toLowerCase();
}

export function getDiatonicChords(tonicPc, mode) {
  const scaleSemis = computeScaleSemitonesFromTonic(mode);
  // Build triads using scale degrees 0,2,4 (stacking thirds)
  const chords = [];
  for (let deg = 0; deg < 7; deg++) {
    const triadDegrees = [deg, (deg + 2) % 7, (deg + 4) % 7];
    const chordPitchClasses = new Set(triadDegrees.map(di => (tonicPc + scaleSemis[di]) % 12));
    chords.push({
      degreeIndex: deg,
      roman: romanNumeralForDegree(mode, deg),
      pitchClasses: chordPitchClasses,
    });
  }
  return chords;
}

export function formatChordName(tonicPc, mode, degreeIndex) {
  const scaleSemis = computeScaleSemitonesFromTonic(mode);
  const rootPc = (tonicPc + scaleSemis[degreeIndex]) % 12;
  const quality = chordQualityForDegree(mode, degreeIndex);
  const rootName = PITCH_CLASS_NAMES[rootPc];
  if (quality === 'dim') return `${rootName}°`;
  if (quality === 'M') return `${rootName}`; // implicit major
  return `${rootName}m`;
}