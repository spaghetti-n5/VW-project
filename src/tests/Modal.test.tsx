import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import DataTable from '../components/DataTable/DataTableContainer';
import { samplePosts } from '../utils/samplePost';
import * as api from '../utils/api';

beforeEach(() => {
  jest.spyOn(api, 'fetchPosts').mockResolvedValue(samplePosts);
  jest.spyOn(api, 'deletePost').mockResolvedValue();
  jest
    .spyOn(api, 'editPost')
    .mockResolvedValue({ id: 1, title: 'Updated Post', body: 'Updated Body', userId: 1 });
  jest
    .spyOn(api, 'addPost')
    .mockResolvedValue({ id: 101, title: 'New Post', body: 'New Body', userId: 1 });
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

test('add modal opens and submits new post at the top', async () => {
  render(<DataTable />);

  await waitFor(() => expect(screen.getByText('Post 1')).toBeInTheDocument());

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

  // Verify the new post appears at the top (first row)
  const firstRow = screen.getAllByRole('row')[1]; // Skip header row
  expect(within(firstRow).getByText('New Post')).toBeInTheDocument();
  expect(within(firstRow).getByText('New Body')).toBeInTheDocument();
});
