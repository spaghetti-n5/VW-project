import { create } from 'zustand';

interface PostStore {
  searchText: string;
  setSearchText: (searchText: string) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  searchText: '',
  setSearchText: (searchText) => set({ searchText }),
}));
