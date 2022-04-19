export const clamp = (num, min, max) => {
  return Math.min(max, Math.max(min, num));
};

export const scale = (num, inMin, inMax, outMin, outMax) => {
  if (inMin == outMin && inMax == outMax) return num;
  const scaled = ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  return clamp(scaled, outMin, outMax);
};
