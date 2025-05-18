import { render, screen, waitFor } from '@testing-library/react';
import DataTable from './DataTable';

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

// Mock fetch
global.fetch = jest.fn();

describe('DataTable', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(samplePosts),
    });
  });

  test('renders DataTable and searches', async () => {
    render(<DataTable />);
    await waitFor(() => expect(screen.getByText('Post 1')).toBeInTheDocument());
    expect(screen.getByText('DataTable')).toBeInTheDocument();
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 10')).toBeInTheDocument();
    expect(screen.queryByText('Post 11')).not.toBeInTheDocument();
  });
});
