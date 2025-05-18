import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DataTable from './DataTable';
import * as api from '../../utils/api';
import { samplePosts } from '../../utils/samplePost';

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
