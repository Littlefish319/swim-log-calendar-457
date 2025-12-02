export interface SwimLog {
  id: string;
  date: string; // ISO Date string YYYY-MM-DD
  distance: number;
  unit: 'm' | 'yd';
  stroke: string;
  duration: string;
  notes: string;
}

export const STROKES = [
  'Freestyle',
  'Breaststroke',
  'Backstroke',
  'Butterfly',
  'IM',
  'Kick',
  'Drill',
  'Mixed'
];