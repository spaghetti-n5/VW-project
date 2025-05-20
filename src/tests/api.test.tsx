import { fetchPosts, deletePost, editPost, addPost } from '../utils/api';
import { Post } from './../types/shared';

// Mock data
const mockPosts: Post[] = [
  { id: 1, title: 'Post 1', body: 'Body 1', userId: 1 },
  { id: 2, title: 'Post 2', body: 'Body 2', userId: 1 },
];

const mockPost: Post = { id: 1, title: 'Updated Post', body: 'Updated Body', userId: 1 };
const mockNewPost: Omit<Post, 'id'> = { title: 'New Post', body: 'New Body', userId: 1 };

// Mock console.error
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('API Functions', () => {
  beforeEach(() => {
    // Clear mocks and define fetch
    jest.clearAllMocks();
    globalThis.fetch = jest.fn();
  });

  afterAll(() => {
    // Restore console.error and clean up fetch
    consoleErrorSpy.mockRestore();
    delete (globalThis as any).fetch;
  });

  describe('fetchPosts', () => {
    test('successfully fetches posts', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPosts,
      });

      const result = await fetchPosts();

      expect(result).toEqual(mockPosts);
      expect(globalThis.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts');
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    test('throws error on network failure', async () => {
      const error = new Error('Network error');
      (globalThis.fetch as jest.Mock).mockRejectedValue(error);

      await expect(fetchPosts()).rejects.toThrow('Network error');

      expect(globalThis.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts');
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching posts:', error);
    });

    test('throws error on HTTP error response', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Not Found' }),
      });

      await expect(fetchPosts()).rejects.toThrow('HTTP error! Status: 404');

      expect(globalThis.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts');
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching posts:', expect.any(Error));
    });
  });

  describe('deletePost', () => {
    test('successfully deletes post', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await expect(deletePost(1)).resolves.toBeUndefined();

      expect(globalThis.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    test('throws error on network failure', async () => {
      const error = new Error('Network error');
      (globalThis.fetch as jest.Mock).mockRejectedValue(error);

      await expect(deletePost(1)).rejects.toThrow('Network error');

      expect(globalThis.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting post with ID 1:', error);
    });

    test('throws error on HTTP error response', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Not Found' }),
      });

      await expect(deletePost(1)).rejects.toThrow('HTTP error! Status: 404');

      expect(globalThis.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting post with ID 1:', expect.any(Error));
    });
  });

  describe('editPost', () => {
    test('successfully edits post', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPost,
      });

      const result = await editPost(1, mockNewPost);

      expect(result).toEqual(mockPost);
      expect(globalThis.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockNewPost),
      });
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    test('throws error on network failure', async () => {
      const error = new Error('Network error');
      (globalThis.fetch as jest.Mock).mockRejectedValue(error);

      await expect(editPost(1, mockNewPost)).rejects.toThrow('Network error');

      expect(globalThis.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockNewPost),
      });
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error editing post with ID 1:', error);
    });

    test('throws error on HTTP error response', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Not Found' }),
      });

      await expect(editPost(1, mockNewPost)).rejects.toThrow('HTTP error! Status: 404');

      expect(globalThis.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockNewPost),
      });
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error editing post with ID 1:', expect.any(Error));
    });
  });

  describe('addPost', () => {
    test('successfully adds post', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockPost,
      });

      const result = await addPost(mockNewPost);

      expect(result).toEqual(mockPost);
      expect(globalThis.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockNewPost),
      });
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    test('throws error on network failure', async () => {
      const error = new Error('Network error');
      (globalThis.fetch as jest.Mock).mockRejectedValue(error);

      await expect(addPost(mockNewPost)).rejects.toThrow('Network error');

      expect(globalThis.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockNewPost),
      });
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding post:', error);
    });

    test('throws error on HTTP error response', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Bad Request' }),
      });

      await expect(addPost(mockNewPost)).rejects.toThrow('HTTP error! Status: 400');

      expect(globalThis.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockNewPost),
      });
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding post:', expect.any(Error));
    });
  });
});