import { render, screen, fireEvent, waitFor, within, cleanup } from '@testing-library/react';
import PostsPage from '../pages/PostsPage';
import * as api from '../utils/api';
import { samplePosts } from '../utils/samplePost';
import { MemoryRouter } from 'react-router-dom';
import { usePostStore } from '../store/postStore';

// Mock Zustand store
jest.mock('../store/postStore', () => ({
  usePostStore: jest.fn(),
}));
const mockUsePostStore = usePostStore as unknown as jest.Mock;

beforeEach(() => {
  jest.spyOn(api, 'fetchPosts').mockResolvedValue(samplePosts);
  jest
    .spyOn(api, 'addPost')
    .mockResolvedValue({ id: 101, title: 'New Post', body: 'New Body', userId: 1 });
  jest
    .spyOn(api, 'editPost')
    .mockResolvedValue({ id: 1, title: 'Updated Post', body: 'Updated Body', userId: 1 });
  jest.spyOn(api, 'deletePost').mockResolvedValue();

  // Mock Zustand store
  mockUsePostStore.mockReturnValue({
    favorites: [],
    toggleFavorite: jest.fn(),
    searchText: '',
    setSearchText: jest.fn(),
  });
});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('PostsPage Component', () => {
  describe('Initial Rendering and Loading', () => {
    test('displays loading state initially on All Posts', async () => {
      render(
        <MemoryRouter initialEntries={['/VW-project']}>
          <PostsPage />
        </MemoryRouter>
      );
      expect(screen.getByText('Loading posts...')).toBeInTheDocument();
      await waitFor(() => expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument());
    });

    test('renders All Posts page with posts and UI elements', async () => {
      render(
        <MemoryRouter initialEntries={['/VW-project']}>
          <PostsPage />
        </MemoryRouter>
      );
      await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());
      const tableView = screen.getByTestId('table-view');
      await waitFor(() => expect(within(tableView).getByText('Post 1')).toBeInTheDocument());

      expect(screen.getByText('All posts')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Add Post/i })).toBeInTheDocument();
      expect(within(tableView).getByText('Post 1')).toBeInTheDocument();
      expect(within(tableView).getByText('Post 10')).toBeInTheDocument();
      expect(within(tableView).queryByText('Post 11')).not.toBeInTheDocument();
      expect(api.fetchPosts).toHaveBeenCalled();
    });

    test('renders Favorites page without Add Post button', async () => {
      mockUsePostStore.mockReturnValue({
        favorites: [1, 2],
        toggleFavorite: jest.fn(),
        searchText: '',
        setSearchText: jest.fn(),
      });
      render(
        <MemoryRouter initialEntries={['/VW-project/favorites']}>
          <PostsPage />
        </MemoryRouter>
      );
      await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());
      const tableView = screen.getByTestId('table-view');
      await waitFor(() => expect(within(tableView).getByText('Post 1')).toBeInTheDocument());

      expect(screen.getByText('Favorites posts')).toBeInTheDocument();
      expect(within(tableView).getByText('Post 1')).toBeInTheDocument();
      expect(within(tableView).getByText('Post 2')).toBeInTheDocument();
      expect(within(tableView).queryByText('Post 3')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Add Post/i })).not.toBeInTheDocument();
      expect(api.fetchPosts).toHaveBeenCalled();
    });
  });

  describe('Post Actions', () => {
    test('delete post removes it from the table on All Posts', async () => {
      render(
        <MemoryRouter initialEntries={['/VW-project']}>
          <PostsPage />
        </MemoryRouter>
      );
      await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());
      const tableView = screen.getByTestId('table-view');
      await waitFor(() => expect(within(tableView).getByText('Post 1')).toBeInTheDocument());

      const deleteButtons = within(tableView).getAllByRole('button', { name: /Delete/i });
      fireEvent.click(deleteButtons[0]);
      await waitFor(() => expect(within(tableView).queryByText('Post 1')).not.toBeInTheDocument());

      expect(within(tableView).queryByText('Post 1')).not.toBeInTheDocument();
      expect(within(tableView).getByText('Post 2')).toBeInTheDocument();
      expect(api.deletePost).toHaveBeenCalledWith(1);
    });

    test('displays error message on failed delete post on desktop', async () => {
      window.innerWidth = 1200;
      jest.spyOn(api, 'deletePost').mockRejectedValueOnce(new Error('API error'));
      render(
        <MemoryRouter initialEntries={['/VW-project']}>
          <PostsPage />
        </MemoryRouter>
      );
      await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());
      const tableView = screen.getByTestId('table-view');
      await waitFor(() => expect(within(tableView).getByText('Post 1')).toBeInTheDocument());

      const deleteButtons = within(tableView).getAllByRole('button', { name: /Delete/i });
      fireEvent.click(deleteButtons[0]);
      await waitFor(() =>
        expect(screen.getByText('Failed to delete post. Please try again.')).toBeInTheDocument()
      );

      expect(within(tableView).getByText('Post 1')).toBeInTheDocument();
      expect(api.deletePost).toHaveBeenCalledWith(1);

      const dismissButton = screen.getByRole('button', { name: /Dismiss/i });
      fireEvent.click(dismissButton);
      expect(
        screen.queryByText('Failed to delete post. Please try again.')
      ).not.toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    test('sorting by ID descending with column header on desktop', async () => {
      window.innerWidth = 1200;
      render(
        <MemoryRouter initialEntries={['/VW-project']}>
          <PostsPage />
        </MemoryRouter>
      );
      await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());
      const tableView = screen.getByTestId('table-view');
      await waitFor(() => expect(within(tableView).getByText('Post 1')).toBeInTheDocument());

      const idHeader = within(tableView).getByRole('columnheader', { name: /ID/i });
      fireEvent.click(idHeader);
      await waitFor(() => expect(within(tableView).getByText('Post 11')).toBeInTheDocument());

      expect(within(tableView).getByText('Post 11')).toBeInTheDocument();
      expect(within(tableView).getByText('Post 2')).toBeInTheDocument();
      expect(within(tableView).queryByText('Post 1')).not.toBeInTheDocument();
    });

    test('sorting by ID descending on mobile', async () => {
      window.innerWidth = 600;
      render(
        <MemoryRouter initialEntries={['/VW-project']}>
          <PostsPage />
        </MemoryRouter>
      );
      await waitFor(() => expect(screen.getByTestId('card-view')).toBeInTheDocument());
      const cardView = screen.getByTestId('card-view');
      await waitFor(() => expect(within(cardView).getByText('Post 1')).toBeInTheDocument());

      const sortIdButton = screen.getByRole('button', { name: /Sort by ID/i });
      fireEvent.click(sortIdButton);
      await waitFor(() => expect(within(cardView).getByText('Post 11')).toBeInTheDocument());

      expect(within(cardView).getByText('Post 11')).toBeInTheDocument();
      expect(within(cardView).getByText('Post 2')).toBeInTheDocument();
      expect(within(cardView).queryByText('Post 1')).not.toBeInTheDocument();
    });

    test('sort buttons visible on mobile', async () => {
      window.innerWidth = 600;
      render(
        <MemoryRouter initialEntries={['/VW-project']}>
          <PostsPage />
        </MemoryRouter>
      );
      await waitFor(() => expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getByTestId('card-view')).toBeInTheDocument());

      expect(screen.getByRole('button', { name: /Sort by ID/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sort by Title/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sort by Body/i })).toBeInTheDocument();
    });

    test('sort buttons hidden on desktop', async () => {
      window.innerWidth = 1200;
      render(
        <MemoryRouter initialEntries={['/VW-project']}>
          <PostsPage />
        </MemoryRouter>
      );
      await waitFor(() => expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());

      expect(screen.queryByRole('button', { name: /Sort by ID/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Sort by Title/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Sort by Body/i })).not.toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    test('renders card layout on mobile', async () => {
      window.innerWidth = 600;
      render(
        <MemoryRouter initialEntries={['/VW-project']}>
          <PostsPage />
        </MemoryRouter>
      );
      await waitFor(() => expect(screen.getByTestId('card-view')).toBeInTheDocument());
      const cardView = screen.getByTestId('card-view');
      await waitFor(() => expect(within(cardView).getByText('Post 1')).toBeInTheDocument());

      // Verify card view has role="grid" and caption
      expect(cardView).toHaveAttribute('role', 'grid');
      expect(cardView).toHaveAttribute('aria-labelledby', 'posts-table-mobile');
      expect(screen.getByText('Posts table mobile')).toHaveClass('visuallyHidden');

      // Verify 10 cards (rows)
      const cards = within(cardView).getAllByRole('row');
      expect(cards.length).toBe(10);

      // Verify first card content and actions
      const firstCard = cards[0];
      expect(within(firstCard).getByText('1')).toBeInTheDocument();
      expect(within(firstCard).getByText('Post 1')).toBeInTheDocument();
      expect(within(firstCard).getByText('Body 1')).toBeInTheDocument();

      // Verify action buttons
      expect(within(firstCard).getByRole('button', { name: /View/i })).toBeInTheDocument();
      expect(within(firstCard).getByRole('button', { name: /Edit/i })).toBeInTheDocument();
      expect(within(firstCard).getByRole('button', { name: /Delete/i })).toBeInTheDocument();
    });
  });

  describe('Modal Interactions', () => {
    test('view modal opens correctly', async () => {
      window.innerWidth = 1200;
      render(
        <MemoryRouter initialEntries={['/VW-project']}>
          <PostsPage />
        </MemoryRouter>
      );
      await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());
      const tableView = screen.getByTestId('table-view');
      await waitFor(() => expect(within(tableView).getByText('Post 1')).toBeInTheDocument());

      const viewButtons = within(tableView).getAllByRole('button', { name: /View/i });
      fireEvent.click(viewButtons[0]);
      await waitFor(() => expect(screen.getByText('Post Details')).toBeInTheDocument());

      const modal = screen.getByRole('dialog');
      const modalScope = within(modal);
      expect(modalScope.getByText('Post 1')).toBeInTheDocument();
      expect(modalScope.getByText('Body 1')).toBeInTheDocument();
    });

    test('edit modal opens and submits updated post', async () => {
      render(
        <MemoryRouter initialEntries={['/VW-project']}>
          <PostsPage />
        </MemoryRouter>
      );
      await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());
      const tableView = screen.getByTestId('table-view');
      await waitFor(() => expect(within(tableView).getByText('Post 1')).toBeInTheDocument());

      const editButtons = within(tableView).getAllByRole('button', { name: /Edit/i });
      fireEvent.click(editButtons[0]);
      await waitFor(() => expect(screen.getByText('Edit Post')).toBeInTheDocument());

      const titleInput = screen.getByLabelText('Title');
      const bodyInput = screen.getByLabelText('Body');
      const updateButton = screen.getByRole('button', { name: /Update/i });

      fireEvent.change(titleInput, { target: { value: 'Updated Post' } });
      fireEvent.change(bodyInput, { target: { value: 'Updated Body' } });
      fireEvent.click(updateButton);
      await waitFor(() => expect(screen.queryByText('Edit Post')).not.toBeInTheDocument());

      expect(api.editPost).toHaveBeenCalledWith(1, {
        title: 'Updated Post',
        body: 'Updated Body',
        id: 1,
        userId: 1,
      });
    });

    test('add modal opens and submits new post at the top', async () => {
      render(
        <MemoryRouter initialEntries={['/VW-project']}>
          <PostsPage />
        </MemoryRouter>
      );
      await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());
      const tableView = screen.getByTestId('table-view');
      await waitFor(() => expect(within(tableView).getByText('Post 1')).toBeInTheDocument());

      const addButton = screen.getByRole('button', { name: /Add Post/i });
      fireEvent.click(addButton);
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();
        expect(within(modal).getByText('Add Post')).toBeInTheDocument();
      });

      const titleInput = screen.getByLabelText('Title');
      const bodyInput = screen.getByLabelText('Body');
      const createButton = screen.getByRole('button', { name: /Create/i });

      fireEvent.change(titleInput, { target: { value: 'New Post' } });
      fireEvent.change(bodyInput, { target: { value: 'New Body' } });
      fireEvent.click(createButton);
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

      expect(api.addPost).toHaveBeenCalledWith({
        title: 'New Post',
        body: 'New Body',
        userId: 1,
        id: 0,
      });

      const firstRow = within(tableView).getAllByRole('row')[1];
      expect(within(firstRow).getByText('New Post')).toBeInTheDocument();
      expect(within(firstRow).getByText('New Body')).toBeInTheDocument();
    });
  });
  describe('Search Filtering', () => {
    test('filters posts by search text', async () => {
      mockUsePostStore.mockReturnValue({
        favorites: [],
        toggleFavorite: jest.fn(),
        searchText: 'Post 1',
        setSearchText: jest.fn(),
      });
      render(
        <MemoryRouter initialEntries={['/VW-project']}>
          <PostsPage />
        </MemoryRouter>
      );
      await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());
      const tableView = screen.getByTestId('table-view');
      await waitFor(() => expect(within(tableView).getByText('Post 1')).toBeInTheDocument());

      expect(within(tableView).getByText('Post 1')).toBeInTheDocument();
      expect(within(tableView).getByText('Post 11')).toBeInTheDocument();
      expect(within(tableView).queryByText('Post 2')).not.toBeInTheDocument();
    });
  });
});
