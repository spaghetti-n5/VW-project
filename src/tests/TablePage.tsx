import { render, screen, fireEvent, waitFor, within, cleanup } from '@testing-library/react';
import TablePage from '../pages/TablePage';
import * as api from '../utils/api';
import { samplePosts } from '../utils/samplePost';

beforeEach(() => {
  jest.spyOn(api, 'fetchPosts').mockResolvedValue(samplePosts);
  jest
    .spyOn(api, 'addPost')
    .mockResolvedValue({ id: 101, title: 'New Post', body: 'New Body', userId: 1 });
  jest
    .spyOn(api, 'editPost')
    .mockResolvedValue({ id: 1, title: 'Updated Post', body: 'Updated Body', userId: 1 });
  jest.spyOn(api, 'deletePost').mockResolvedValue();
});

// cleanup mocks and ensure the DOM is reset after each test
afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

test('displays loading state initially', async () => {
  render(<TablePage />);
  expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument());
});

test('renders TablePage component', async () => {
  render(<TablePage />);

  await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());
  const tableView = screen.getByTestId('table-view');
  await waitFor(() => expect(within(tableView).getByText('Post 1')).toBeInTheDocument());

  expect(screen.getByText('All posts')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Search by any field...')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Add Post/i })).toBeInTheDocument();
  expect(within(tableView).getByText('Post 1')).toBeInTheDocument();
  expect(within(tableView).getByText('Post 10')).toBeInTheDocument();
  expect(within(tableView).queryByText('Post 11')).not.toBeInTheDocument();
  expect(api.fetchPosts).toHaveBeenCalled();
});

test('delete post removes it from the table', async () => {
  render(<TablePage />);

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

test('search filters the table', async () => {
  render(<TablePage />);

  await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());
  const tableView = screen.getByTestId('table-view');
  await waitFor(() => expect(within(tableView).getByText('Post 1')).toBeInTheDocument());

  const searchInput = screen.getByPlaceholderText('Search by any field...');
  fireEvent.change(searchInput, { target: { value: '3' } });

  await waitFor(() => expect(within(tableView).getByText('Post 3')).toBeInTheDocument());

  expect(within(tableView).getByText('Post 3')).toBeInTheDocument();
  expect(within(tableView).queryByText('Post 1')).not.toBeInTheDocument();
  expect(within(tableView).queryByText('Post 2')).not.toBeInTheDocument();
});

test('sorting by ID descending with column header', async () => {
  render(<TablePage />);

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

test('renders card layout on mobile', async () => {
  window.innerWidth = 600;
  render(<TablePage />);

  await waitFor(() => expect(screen.getByTestId('card-view')).toBeInTheDocument());
  const cardView = screen.getByTestId('card-view');
  await waitFor(() => expect(within(cardView).getByText('Post 1')).toBeInTheDocument());

  const cards = within(cardView).getAllByRole('article', { name: /card/i });
  expect(cards.length).toBe(10);
  const firstCard = cards[0];
  expect(within(firstCard).getByText('1')).toBeInTheDocument();
  expect(within(firstCard).getByText('Post 1')).toBeInTheDocument();
  expect(within(firstCard).getByText('Body 1')).toBeInTheDocument();
  expect(within(firstCard).getByRole('button', { name: /View/i })).toBeInTheDocument();
  expect(within(firstCard).getByRole('button', { name: /Edit/i })).toBeInTheDocument();
  expect(within(firstCard).getByRole('button', { name: /Delete/i })).toBeInTheDocument();
});

test('displays error message on failed delete post on desktop', async () => {
  window.innerWidth = 1200;
  jest.spyOn(api, 'deletePost').mockRejectedValueOnce(new Error('API error'));

  render(<TablePage />);

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

  expect(screen.queryByText('Failed to delete post. Please try again.')).not.toBeInTheDocument();
});

test('sorting by ID descending on desktop', async () => {
  window.innerWidth = 1200;
  render(<TablePage />);

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
  render(<TablePage />);

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
  render(<TablePage />);

  await waitFor(() => expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument());
  await waitFor(() => expect(screen.getByTestId('card-view')).toBeInTheDocument());

  expect(screen.getByRole('button', { name: /Sort by ID/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Sort by Title/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Sort by Body/i })).toBeInTheDocument();
});

test('sort buttons hidden on desktop', async () => {
  window.innerWidth = 1200;
  render(<TablePage />);

  await waitFor(() => expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument());
  await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());

  expect(screen.queryByRole('button', { name: /Sort by ID/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Sort by Title/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Sort by Body/i })).not.toBeInTheDocument();
});

/* Modal Tests */
test('view modal opens correctly', async () => {
  render(<TablePage />);

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
  render(<TablePage />);

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
  render(<TablePage />);

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
