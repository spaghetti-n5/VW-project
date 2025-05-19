import { render, screen, fireEvent, waitFor, within, cleanup } from '@testing-library/react';
import DataTableContainer from '../components/DataTable/DataTableContainer';
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
  render(<DataTableContainer />);
  expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument());
});

test('renders DataTable component', async () => {
  render(<DataTableContainer />);

  await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());
  const tableView = screen.getByTestId('table-view');
  await waitFor(() => expect(within(tableView).getByText('Post 1')).toBeInTheDocument());

  expect(screen.getByText('DataTable')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Search by any field...')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Add Post/i })).toBeInTheDocument();
  expect(within(tableView).getByText('Post 1')).toBeInTheDocument();
  expect(within(tableView).getByText('Post 10')).toBeInTheDocument();
  expect(within(tableView).queryByText('Post 11')).not.toBeInTheDocument();
  expect(api.fetchPosts).toHaveBeenCalled();
});

test('delete post removes it from the table', async () => {
  render(<DataTableContainer />);

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
  render(<DataTableContainer />);

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
  render(<DataTableContainer />);

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
  render(<DataTableContainer />);

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

  render(<DataTableContainer />);

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
  render(<DataTableContainer />);

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
  render(<DataTableContainer />);

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
  render(<DataTableContainer />);

  await waitFor(() => expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument());
  await waitFor(() => expect(screen.getByTestId('card-view')).toBeInTheDocument());

  expect(screen.getByRole('button', { name: /Sort by ID/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Sort by Title/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Sort by Body/i })).toBeInTheDocument();
});

test('sort buttons hidden on desktop', async () => {
  window.innerWidth = 1200;
  render(<DataTableContainer />);

  await waitFor(() => expect(screen.queryByText('Loading posts...')).not.toBeInTheDocument());
  await waitFor(() => expect(screen.getByTestId('table-view')).toBeInTheDocument());

  expect(screen.queryByRole('button', { name: /Sort by ID/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Sort by Title/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Sort by Body/i })).not.toBeInTheDocument();
});
