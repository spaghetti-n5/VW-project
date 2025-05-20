import { create } from 'zustand';

interface PostStore {
  favorites: number[];
  searchText: string;
  setSearchText: (searchText: string) => void;
  toggleFavorite: (postId: number) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  favorites: [],
  searchText: '',
  setSearchText: (searchText) => set({ searchText }),
  toggleFavorite: (postId) =>
    set((state) => ({
      favorites: state.favorites.includes(postId)
        ? state.favorites.filter((id) => id !== postId)
        : [...state.favorites, postId],
    })),
}));
