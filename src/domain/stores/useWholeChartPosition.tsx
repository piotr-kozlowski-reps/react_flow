import { create } from "zustand";
import type { Position } from "../types";

interface WholeChartPosition {
  chartPosition: Position;

  setPosition: (position: Position) => void;
  getPosition: () => Position;
}

const useWholeChartPosition = create<WholeChartPosition>((set, get) => ({
  //state
  chartPosition: {
    currentX: 0,
    currentY: 0,
  },

  //actions
  setPosition: (position: Position) => {
    set({ chartPosition: position });
  },
  getPosition: () => {
    return get().chartPosition;
  },
}));

export default useWholeChartPosition;
