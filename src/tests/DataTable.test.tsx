import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DataTableContainer from '../components/DataTable/DataTableContainer';
import * as api from '../utils/api';
import { samplePosts } from '../utils/samplePost';

beforeEach(() => {
  jest.spyOn(api, 'fetchPosts').mockResolvedValue(samplePosts);
  jest.spyOn(api, 'deletePost').mockResolvedValue();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders DataTable component', async () => {
  render(<DataTableContainer />);

  await waitFor(() => expect(screen.getByText('Post 1')).toBeInTheDocument());

  expect(screen.getByText('DataTable')).toBeInTheDocument();
  expect(screen.getByText('Post 1')).toBeInTheDocument();
  expect(screen.getByText('Post 10')).toBeInTheDocument();
  expect(screen.queryByText('Post 11')).not.toBeInTheDocument();
  expect(api.fetchPosts).toHaveBeenCalled();
});

test('delete post removes it from the table', async () => {
  render(<DataTableContainer />);

  await waitFor(() => expect(screen.getByText('Post 1')).toBeInTheDocument());

  const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
  fireEvent.click(deleteButtons[0]);

  await waitFor(() => expect(screen.queryByText('Post 1')).not.toBeInTheDocument());

  expect(screen.queryByText('Post 1')).not.toBeInTheDocument();
  expect(screen.getByText('Post 2')).toBeInTheDocument();
  expect(api.deletePost).toHaveBeenCalledWith(1);
});

test('search filters the table', async () => {
  render(<DataTableContainer />);

  await waitFor(() => expect(screen.getByText('Post 1')).toBeInTheDocument());

  const searchInput = screen.getByPlaceholderText('Search by any field...');
  fireEvent.change(searchInput, { target: { value: '3' } });

  await waitFor(() => expect(screen.getByText('Post 3')).toBeInTheDocument());

  expect(screen.getByText('Post 3')).toBeInTheDocument();
  expect(screen.queryByText('Post 1')).not.toBeInTheDocument();
  expect(screen.queryByText('Post 2')).not.toBeInTheDocument();
});

test('sorting by ID descending', async () => {
  render(<DataTableContainer />);

  await waitFor(() => expect(screen.getByText('Post 1')).toBeInTheDocument());

  const idHeader = screen.getByRole('columnheader', { name: /ID/i });
  fireEvent.click(idHeader);

  await waitFor(() => expect(screen.getByText('Post 11')).toBeInTheDocument());

  expect(screen.getByText('Post 11')).toBeInTheDocument();
  expect(screen.getByText('Post 2')).toBeInTheDocument();
  expect(screen.queryByText('Post 1')).not.toBeInTheDocument();
});
