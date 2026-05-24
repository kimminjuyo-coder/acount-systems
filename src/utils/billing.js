/**
 * Calculates the rounded duration and cost for transcription tasks based on minutes only.
 * 
 * Rounding rules:
 * - Remaining minutes < 15: round down (e.g., 74 minutes -> 60 minutes)
 * - Remaining minutes >= 15: round up (e.g., 75 minutes -> 90 minutes)
 * - Minimum billing unit is 30 minutes.
 * 
 * Cost rules:
 * - DEPTH: 30m = 30k, 1h = 35k, 1h30m = 42.5k, 2h = 50k, 2h30m = 57k, 3h = 65k. (+$7.5k per 30m beyond 3h)
 * - FGD: 30m = 50k, 1h = 60k, 1h30m = 70k, 2h = 80k, 2h30m = 90k, 3h = 100k. (+$10k per 30m beyond 3h)
 * 
 * @param {Object} params
 * @param {string} params.taskType - 'DEPTH' | 'FGD'
 * @param {number} params.minutes - Recording duration in minutes (integer)
 * @returns {Object} { roundedMinutes, cost }
 */
export function calculateSettlement({ taskType, minutes }) {
  const totalMinutes = Number(minutes);
  
  // Calculate base 30-minute intervals
  const baseIntervals = Math.floor(totalMinutes / 30);
  const remainder = totalMinutes % 30;
  
  let roundedIntervals = baseIntervals;
  // If the remaining minutes are 15 or more, round up to the next 30-minute block
  if (remainder >= 15) {
    roundedIntervals += 1;
  }
  
  // Minimum billing unit is 30 minutes (1 interval)
  if (roundedIntervals === 0) {
    roundedIntervals = 1;
  }
  
  const roundedMinutes = roundedIntervals * 30;
  let cost = 0;
  
  if (taskType === 'DEPTH') {
    if (roundedMinutes <= 30) {
      cost = 30000;
    } else if (roundedMinutes <= 60) {
      cost = 35000;
    } else if (roundedMinutes <= 90) {
      cost = 42500;
    } else if (roundedMinutes <= 120) {
      cost = 50000;
    } else if (roundedMinutes <= 150) {
      cost = 57000;
    } else if (roundedMinutes <= 180) {
      cost = 65000;
    } else {
      const extraIntervals = (roundedMinutes - 180) / 30;
      cost = 65000 + extraIntervals * 7500;
    }
  } else if (taskType === 'FGD') {
    if (roundedMinutes <= 30) {
      cost = 50000;
    } else if (roundedMinutes <= 60) {
      cost = 60000;
    } else if (roundedMinutes <= 90) {
      cost = 70000;
    } else if (roundedMinutes <= 120) {
      cost = 80000;
    } else if (roundedMinutes <= 150) {
      cost = 90000;
    } else if (roundedMinutes <= 180) {
      cost = 100000;
    } else {
      const extraIntervals = (roundedMinutes - 180) / 30;
      cost = 100000 + extraIntervals * 10000;
    }
  }
  
  return {
    roundedMinutes,
    cost
  };
}
