import { create } from "zustand";

type PlatformStore = {
  selectedCapability: string | null;
  setSelectedCapability: (capability: string | null) => void;
};

export const usePlatformStore = create<PlatformStore>((set) => ({
  selectedCapability: null,
  setSelectedCapability: (selectedCapability) => set({ selectedCapability }),
}));
