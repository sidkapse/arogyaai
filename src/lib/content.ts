import diabetes from '../content/diabetes.json';
import thyroid from '../content/thyroid.json';
import cholesterol from '../content/cholesterol.json';
import bp from '../content/bp.json';
import fattyLiver from '../content/fatty-liver.json';
import kidneyStones from '../content/kidney-stones.json';
import gallStones from '../content/gall-stones.json';
import uti from '../content/uti.json';
import pcod from '../content/pcod-pcos.json';

export type AilmentId =
  | 'diabetes'
  | 'thyroid'
  | 'cholesterol'
  | 'bp'
  | 'fatty-liver'
  | 'kidney-stones'
  | 'gall-stones'
  | 'uti'
  | 'pcod-pcos';

export type ConceptCard = {
  id: string;
  title: string;
  body: string;
  emoji: string;
};

export type FoodItem = {
  name: string;
  emoji: string;
  note?: string;
};

export type QuizQuestion = {
  id: string;
  type: 'mcq' | 'tf';
  q: string;
  options: string[];
  correct: number; // index
  why: string;
};

export type AilmentContent = {
  id: AilmentId;
  title: string;
  tagline: string;
  hero: string; // emoji or path
  color: string; // tailwind color e.g. 'emerald'
  oneLiner: string;
  cards: ConceptCard[];
  doEat: FoodItem[];
  dontEat: FoodItem[];
  lifestyle: string[];
  redFlags: string[];
  quiz: QuizQuestion[];
};

export const AILMENTS: AilmentContent[] = [
  diabetes,
  thyroid,
  cholesterol,
  bp,
  fattyLiver,
  kidneyStones,
  gallStones,
  uti,
  pcod,
] as unknown as AilmentContent[];

export const AILMENT_MAP: Record<AilmentId, AilmentContent> = Object.fromEntries(
  AILMENTS.map((a) => [a.id, a]),
) as Record<AilmentId, AilmentContent>;

export function getAilment(id: string): AilmentContent | undefined {
  return AILMENT_MAP[id as AilmentId];
}
