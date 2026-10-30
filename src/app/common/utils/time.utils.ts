export const toMs = {
  seconds: (n: number) => n * 1000,
  minutes: (n: number) => n * 60 * 1000,
  hours: (n: number) => n * 60 * 60 * 1000,
  days: (n: number) => n * 24 * 60 * 60 * 1000,
};

export const calculateMinutesUntil = (futureDate: Date): number => {
  const now = new Date();
  const diffInMs = futureDate.getTime() - now.getTime();

  if (diffInMs <= 0) {
    return 0;
  }

  return Math.ceil(diffInMs / (1000 * 60));
};
