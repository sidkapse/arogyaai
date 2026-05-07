import enDiabetes from '../content/diabetes.json';
import enThyroid from '../content/thyroid.json';
import enCholesterol from '../content/cholesterol.json';
import enBp from '../content/bp.json';
import enFattyLiver from '../content/fatty-liver.json';
import enKidneyStones from '../content/kidney-stones.json';
import enGallStones from '../content/gall-stones.json';
import enUti from '../content/uti.json';
import enPcod from '../content/pcod-pcos.json';

import hiDiabetes from '../content/hi/diabetes.json';
import hiThyroid from '../content/hi/thyroid.json';
import hiCholesterol from '../content/hi/cholesterol.json';
import hiBp from '../content/hi/bp.json';
import hiFattyLiver from '../content/hi/fatty-liver.json';
import hiKidneyStones from '../content/hi/kidney-stones.json';
import hiGallStones from '../content/hi/gall-stones.json';
import hiUti from '../content/hi/uti.json';
import hiPcod from '../content/hi/pcod-pcos.json';

import { useSettings, type Language } from '../store/settings';

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
  correct: number;
  why: string;
};

export type AilmentContent = {
  id: AilmentId;
  title: string;
  tagline: string;
  hero: string;
  color: string;
  oneLiner: string;
  cards: ConceptCard[];
  doEat: FoodItem[];
  dontEat: FoodItem[];
  lifestyle: string[];
  redFlags: string[];
  quiz: QuizQuestion[];
};

const EN: AilmentContent[] = [
  enDiabetes, enThyroid, enCholesterol, enBp, enFattyLiver,
  enKidneyStones, enGallStones, enUti, enPcod,
] as unknown as AilmentContent[];

const HI: AilmentContent[] = [
  hiDiabetes, hiThyroid, hiCholesterol, hiBp, hiFattyLiver,
  hiKidneyStones, hiGallStones, hiUti, hiPcod,
] as unknown as AilmentContent[];

const MAP_EN: Record<AilmentId, AilmentContent> = Object.fromEntries(EN.map((a) => [a.id, a])) as Record<AilmentId, AilmentContent>;
const MAP_HI: Record<AilmentId, AilmentContent> = Object.fromEntries(HI.map((a) => [a.id, a])) as Record<AilmentId, AilmentContent>;

function pick(lang: Language) {
  return lang === 'hi' ? { list: HI, map: MAP_HI } : { list: EN, map: MAP_EN };
}

/** Hook — returns localised array of all ailments */
export function useAllAilments(): AilmentContent[] {
  const lang = useSettings((s) => s.language);
  return pick(lang).list;
}

/** Hook — returns localised single ailment by id */
export function useAilmentContent(id: AilmentId | string | undefined): AilmentContent | undefined {
  const lang = useSettings((s) => s.language);
  if (!id) return undefined;
  return pick(lang).map[id as AilmentId];
}

/** Non-hook: get list in current language (use sparingly, e.g. outside React) */
export function getAllAilments(): AilmentContent[] {
  const lang = useSettings.getState().language;
  return pick(lang).list;
}

/** Non-hook: get single ailment in current language */
export function getAilment(id: string): AilmentContent | undefined {
  const lang = useSettings.getState().language;
  return pick(lang).map[id as AilmentId];
}

/** Returns English ailment id list (for stable iteration) */
export const AILMENT_IDS: AilmentId[] = EN.map((a) => a.id);
