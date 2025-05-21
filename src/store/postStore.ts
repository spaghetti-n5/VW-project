import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PostStore {
  favorites: number[];
  searchText: string;
  setSearchText: (searchText: string) => void;
  toggleFavorite: (postId: number) => void;
}

export const usePostStore = create<PostStore>()(
  persist(
    (set) => ({
      favorites: [],
      searchText: '',
      setSearchText: (searchText) => set({ searchText }),
      toggleFavorite: (postId) =>
        set((state) => ({
          favorites: state.favorites.includes(postId)
            ? state.favorites.filter((id) => id !== postId)
            : [...state.favorites, postId],
        })),
    }),
    { name: 'post-store' }
  )
);
