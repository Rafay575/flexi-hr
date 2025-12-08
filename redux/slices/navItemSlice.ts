import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NavItemId = number;

export interface NavItemState {
  activeNavItemId: NavItemId;
}

const DEFAULT_NAV_ITEM_ID: NavItemId = 1;

// Safely read initial value from localStorage
const getInitialNavItemId = (): NavItemId => {
  if (typeof window === 'undefined') {
    // In case this runs in SSR / non-browser env
    return DEFAULT_NAV_ITEM_ID;
  }

  try {
    const stored = window.localStorage.getItem('activeNavItemId');
    if (!stored) return DEFAULT_NAV_ITEM_ID;

    const parsed = Number.parseInt(stored, 10);
    return Number.isNaN(parsed) ? DEFAULT_NAV_ITEM_ID : parsed;
  } catch {
    // If anything goes wrong, fall back to default
    return DEFAULT_NAV_ITEM_ID;
  }
};

const initialState: NavItemState = {
  activeNavItemId: getInitialNavItemId(),
};

const navItemSlice = createSlice({
  name: 'navItem',
  initialState,
  reducers: {
    setActiveNavItem(state, action: PayloadAction<NavItemId>) {
      state.activeNavItemId = action.payload;

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('activeNavItemId', String(action.payload));
      }
    },
    resetActiveNavItem(state) {
      state.activeNavItemId = DEFAULT_NAV_ITEM_ID;

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('activeNavItemId');
      }
    },
  },
});

export const { setActiveNavItem, resetActiveNavItem } = navItemSlice.actions;
export default navItemSlice.reducer;
