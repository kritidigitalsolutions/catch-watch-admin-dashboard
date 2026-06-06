import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDark: localStorage.getItem('cw-theme') === 'dark' || !localStorage.getItem('cw-theme'),
  toggleTheme: () =>
    set((state) => {
      const newDark = !state.isDark;
      localStorage.setItem('cw-theme', newDark ? 'dark' : 'light');
      if (newDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { isDark: newDark };
    }),
  setTheme: (mode) =>
    set(() => {
      const isDark = mode === 'dark';
      localStorage.setItem('cw-theme', mode);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { isDark };
    }),
  initTheme: () => {
    const saved = localStorage.getItem('cw-theme');
    const isDark = saved === 'dark' || !saved;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return isDark;
  },
}));

export default useThemeStore;
