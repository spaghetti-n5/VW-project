import { Post } from '../types/shared';
/**
 * Base URL for the posts API endpoint.
 */
const POSTS_API_URL = 'https://jsonplaceholder.typicode.com/posts';

/**
 * Fetches all posts from the API.
 * @returns A Promise resolving to an array of posts.
 */
export async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await fetch(POSTS_API_URL);
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

/**
 * Deletes a post by ID.
 * @param id - The ID of the post to delete.
 * @returns A Promise that resolves if the request is successful, or rejects with an error.
 */
export async function deletePost(id: number): Promise<void> {
  try {
    await fetch(`${POSTS_API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Error deleting post with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Updates an existing post by ID.
 * @param id - The ID of the post to update.
 * @param post - The updated post data (title, body, userId).
 * @returns A Promise resolving to the updated post.
 */
export async function editPost(id: number, post: Omit<Post, 'id'>): Promise<Post> {
  try {
    const response = await fetch(`${POSTS_API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error editing post with ID ${id}:`, error);
    throw error;
  }
}
