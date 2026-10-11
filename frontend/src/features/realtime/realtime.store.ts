import { create } from "zustand";

export type RealtimeStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "offline";

const HIGHLIGHT_MS = 1800;

interface RealtimeState {
  status: RealtimeStatus;
  highlights: Record<string, number>;
  setStatus: (status: RealtimeStatus) => void;
  highlight: (id: string) => void;
}

export const useRealtimeStore = create<RealtimeState>()((set) => ({
  status: "offline",
  highlights: {},
  setStatus: (status) => set({ status }),
  highlight: (id) => {
    const stamp = Date.now();
    set((s) => ({ highlights: { ...s.highlights, [id]: stamp } }));

    setTimeout(() => {
      set((s) => {
        if (s.highlights[id] !== stamp) return s;
        const highlights = { ...s.highlights };
        delete highlights[id];
        return { highlights };
      });
    }, HIGHLIGHT_MS);
  },
}));
