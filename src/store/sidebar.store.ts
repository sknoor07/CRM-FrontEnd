import { create } from "zustand";

interface SidebarState {
  desktopOpen: boolean;
  mobileOpen: boolean;
  toggleDesktop: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  desktopOpen: true,
  mobileOpen: false,

  toggleDesktop: () => set((state) => ({ desktopOpen: !state.desktopOpen })),
  toggleMobile: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
  closeMobile: () => set({ mobileOpen: false }),
}));
