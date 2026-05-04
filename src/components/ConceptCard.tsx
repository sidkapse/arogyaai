import { motion, type PanInfo } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { ConceptCard as ConceptCardType } from '../lib/content';
import type { AilmentPalette } from '../lib/colors';

type Props = {
  card: ConceptCardType;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  palette: AilmentPalette;
};

export function ConceptCard({ card, index, total, onNext, onPrev, palette }: Props) {
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 80 || info.velocity.x > 400) {
      onPrev();
    } else if (Math.abs(info.offset.x) > 80 || info.velocity.x < -400) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      {/* Progress pips */}
      <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === index ? 24 : 10,
              background: i < index ? palette.hex500 : i === index ? palette.hex500 : '#e2e8f0',
              opacity: i > index ? 0.5 : 1,
            }}
          />
        ))}
      </div>

      {/* Card count */}
      <p className="text-xs font-semibold text-slate-400 -mt-2">
        {index + 1} of {total}
      </p>

      {/* Draggable card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.25}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.02, rotate: 2 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm rounded-3xl overflow-hidden shadow-xl cursor-grab active:cursor-grabbing"
        style={{ background: '#fff' }}
      >
        {/* Coloured top strip */}
        <div
          className="h-2 w-full"
          style={{ background: palette.gradient }}
        />

        {/* Emoji hero */}
        <div
          className="flex items-center justify-center py-8"
          style={{ background: '#fff' }}
        >
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-md"
            style={{
              background: '#fff',
              border: `2px solid ${palette.hex200}`,
            }}
          >
            {card.emoji}
          </div>
        </div>

        {/* Text */}
        <div className="px-6 pb-7 pt-4 bg-white dark:bg-slate-800">
          <h2
            className="text-xl font-extrabold mb-3 text-center leading-tight"
            style={{ color: palette.hex700 }}
          >
            {card.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-center leading-relaxed text-[15px]">
            {card.body}
          </p>
        </div>
      </motion.div>

      {/* CTA buttons */}
      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={onPrev}
          disabled={index === 0}
          className="flex items-center gap-1 rounded-full px-4 py-3 font-semibold text-white shadow-md transition-all text-sm"
          style={{
            background: index === 0 ? '#cbd5e1' : palette.gradient,
            cursor: index === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          <ChevronLeft size={16} />
          Back
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-lg transition-all text-sm"
          style={{ background: palette.gradient }}
        >
          {index + 1 < total ? 'Next' : 'Diet'}
          <ChevronRight size={16} />
        </motion.button>
      </div>

      <p className="text-xs text-slate-400 text-center">swipe ← / → or use buttons</p>
    </div>
  );
}
