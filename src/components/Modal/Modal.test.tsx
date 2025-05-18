import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import DataTable from './../DataTable/DataTable';
import { samplePosts } from '../../utils/samplePost';
import * as api from '../../utils/api';

beforeEach(() => {
  jest.spyOn(api, 'fetchPosts').mockResolvedValue(samplePosts);
  jest.spyOn(api, 'deletePost').mockResolvedValue();
  jest
    .spyOn(api, 'editPost')
    .mockResolvedValue({ id: 1, title: 'Updated Post', body: 'Updated Body', userId: 1 });
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

test('edit modal opens and submits updated post', async () => {
  render(<DataTable />);

  await waitFor(() => expect(screen.getByText('Post 1')).toBeInTheDocument());

  const editButtons = screen.getAllByRole('button', { name: /Edit/i });
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
