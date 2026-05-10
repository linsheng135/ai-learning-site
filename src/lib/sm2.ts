export function sm2(
  quality: number,
  repetitions: number,
  easeFactor: number,
  interval: number
): { easeFactor: number; interval: number; repetitions: number; nextReview: string } {
  let newEF = easeFactor;
  let newInterval = interval;
  let newReps = repetitions;

  if (quality >= 3) {
    if (newReps === 0) {
      newInterval = 1;
    } else if (newReps === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newReps += 1;
  } else {
    newReps = 0;
    newInterval = 1;
  }

  newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  const nextReview = new Date(Date.now() + newInterval * 86400000).toISOString();

  return { easeFactor: newEF, interval: newInterval, repetitions: newReps, nextReview };
}

export function getDueCards<T extends { easeFactor: number; interval: number; repetitions: number; nextReview: string }>(
  cards: T[]
): T[] {
  const now = new Date();
  return cards.filter((c) => new Date(c.nextReview) <= now);
}
