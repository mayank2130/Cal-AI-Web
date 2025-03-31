export interface FitnessData {
  steps: {
    current: number;
    goal: number;
    history: { date: string; count: number }[];
  };
  calories: {
    burned: number;
    goal: number;
    history: { date: string; count: number }[];
  };
  heartRate: {
    current: number;
    min: number;
    max: number;
    history: { time: string; rate: number }[];
  };
  sleep: {
    hours: number;
    goal: number;
    history: { date: string; hours: number }[];
  };
  water: {
    current: number;
    goal: number;
    history: { date: string; amount: number }[];
  };
}

export const mockFitnessData: FitnessData = {
  steps: {
    current: 8435,
    goal: 10000,
    history: [
      { date: "Mon", count: 9123 },
      { date: "Tue", count: 7456 },
      { date: "Wed", count: 10234 },
      { date: "Thu", count: 8652 },
      { date: "Fri", count: 6789 },
      { date: "Sat", count: 4321 },
      { date: "Sun", count: 8435 },
    ],
  },
  calories: {
    burned: 1250,
    goal: 2000,
    history: [
      { date: "Mon", count: 1450 },
      { date: "Tue", count: 1320 },
      { date: "Wed", count: 1780 },
      { date: "Thu", count: 1560 },
      { date: "Fri", count: 1230 },
      { date: "Sat", count: 890 },
      { date: "Sun", count: 1250 },
    ],
  },
  heartRate: {
    current: 72,
    min: 58,
    max: 142,
    history: [
      { time: "6am", rate: 62 },
      { time: "9am", rate: 78 },
      { time: "12pm", rate: 84 },
      { time: "3pm", rate: 76 },
      { time: "6pm", rate: 88 },
      { time: "9pm", rate: 72 },
    ],
  },
  sleep: {
    hours: 6.5,
    goal: 8,
    history: [
      { date: "Mon", hours: 7.2 },
      { date: "Tue", hours: 6.8 },
      { date: "Wed", hours: 8.1 },
      { date: "Thu", hours: 7.5 },
      { date: "Fri", hours: 5.9 },
      { date: "Sat", hours: 8.4 },
      { date: "Sun", hours: 6.5 },
    ],
  },
  water: {
    current: 1.2,
    goal: 2.5,
    history: [
      { date: "Mon", amount: 1.8 },
      { date: "Tue", amount: 2.1 },
      { date: "Wed", amount: 2.4 },
      { date: "Thu", amount: 1.9 },
      { date: "Fri", amount: 1.6 },
      { date: "Sat", amount: 1.0 },
      { date: "Sun", amount: 1.2 },
    ],
  },
}; 