import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import DataTable from './../DataTable/DataTable';
import { samplePosts } from '../../utils/samplePost';
import * as api from '../../utils/api';

beforeEach(() => {
  jest.spyOn(api, 'fetchPosts').mockResolvedValue(samplePosts);
  jest.spyOn(api, 'deletePost').mockResolvedValue();
});

afterEach(() => {
  jest.clearAllMocks();
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
