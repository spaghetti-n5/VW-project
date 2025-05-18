import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import DataTable from './DataTable';
import * as api from '../../utils/api';

const samplePosts = [
  { id: 1, title: 'Post 1', body: 'Body 1' },
  { id: 2, title: 'Post 2', body: 'Body 2' },
  { id: 3, title: 'Post 3', body: 'Body 3' },
  { id: 4, title: 'Post 4', body: 'Body 4' },
  { id: 5, title: 'Post 5', body: 'Body 5' },
  { id: 6, title: 'Post 6', body: 'Body 6' },
  { id: 7, title: 'Post 7', body: 'Body 7' },
  { id: 8, title: 'Post 8', body: 'Body 8' },
  { id: 9, title: 'Post 9', body: 'Body 9' },
  { id: 10, title: 'Post 10', body: 'Body 10' },
  { id: 11, title: 'Post 11', body: 'Body 11' },
];

beforeEach(() => {
  jest.spyOn(api, 'fetchPosts').mockResolvedValue(samplePosts);
  jest.spyOn(api, 'deletePost').mockResolvedValue();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders DataTable component', async () => {
  render(<DataTable />);

  await waitFor(() => expect(screen.getByText('Post 1')).toBeInTheDocument());

  expect(screen.getByText('DataTable')).toBeInTheDocument();
  expect(screen.getByText('Post 1')).toBeInTheDocument();
  expect(screen.getByText('Post 10')).toBeInTheDocument();
  expect(screen.queryByText('Post 11')).not.toBeInTheDocument();
  expect(api.fetchPosts).toHaveBeenCalled();
});

test('delete post removes it from the table', async () => {
  render(<DataTable />);

  await waitFor(() => expect(screen.getByText('Post 1')).toBeInTheDocument());

  const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
  fireEvent.click(deleteButtons[0]);

  await waitFor(() => expect(screen.queryByText('Post 1')).not.toBeInTheDocument());

  expect(screen.queryByText('Post 1')).not.toBeInTheDocument();
  expect(screen.getByText('Post 2')).toBeInTheDocument();
  expect(api.deletePost).toHaveBeenCalledWith(1);
});

test('view modal opens correctly', async () => {
  render(<DataTable />);

  await waitFor(() => expect(screen.getByText('Post 1')).toBeInTheDocument());

  const viewButtons = screen.getAllByRole('button', { name: /View/i });
  fireEvent.click(viewButtons[0]);

  await waitFor(() => expect(screen.getByText('Post Details')).toBeInTheDocument());

  const modal = screen.getByRole('dialog');
  const modalScope = within(modal); // Use within to scope the search to the modal
  expect(modalScope.getByText('Post 1')).toBeInTheDocument();
  expect(modalScope.getByText('Body 1')).toBeInTheDocument();
});
