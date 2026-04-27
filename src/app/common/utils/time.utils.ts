export const calculateMinutesUntil = (futureDate: Date): number => {
  const now = new Date();
  const diffInMs = futureDate.getTime() - now.getTime();
  return Math.ceil(diffInMs / (1000 * 60));
};
