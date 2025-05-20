import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { useLocation } from 'react-router-dom';
import { Post, ModalType } from '../types/shared';
import { fetchPosts, deletePost, editPost, addPost } from '../utils/api';
import TableComponent from '../components/DataTable/TableComponent';
import Button from '../components/shared/Button';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { usePostStore } from '../store/postStore';
import SortButtons from '../components/DataTable/SortButtons';
import { mobileBreakpoint } from '../utils/constants';
import styles from './../styles/PostsPage.module.css';

// Lazy load components
const Modal = lazy(() => import('../components/DataTable/Modal'));
const ErrorAlert = lazy(() => import('../components/shared/ErrorAlert'));

const PostsPage: React.FC = () => {
  const [data, setData] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post>({ id: 0, title: '', body: '' });
  const [modalType, setModalType] = useState<ModalType>(ModalType.VIEW);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { favorites, toggleFavorite, searchText } = usePostStore();
  const location = useLocation();
  const isFavoritesPage = location.pathname.includes('/favorites');
  const isMobile = window.innerWidth < mobileBreakpoint;

  // Fetch data on mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await fetchPosts();
        setData(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Filter posts by favorites (for Favorites page)
  const favoriteData = useMemo(() => {
    if (!isFavoritesPage) return data;
    return data.filter((post) => favorites.includes(post.id));
  }, [data, favorites, isFavoritesPage]);

  // Global search filter
  const filteredData = useMemo(() => {
    if (!searchText) return favoriteData;
    return favoriteData.filter((post) =>
      Object.values(post).some((val) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [favoriteData, searchText]);

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setData((prevData) => prevData.filter((post) => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again.');
    }
  };

  // Modal handlers
  const openModal = (type: ModalType, post: Post = { id: 0, title: '', body: '' }) => {
    setModalType(type);
    setCurrentPost(post);
    setIsModalOpen(true);
    setError(null);
  };

  const handleModalSubmit = async (post: Post) => {
    try {
      if (modalType === ModalType.ADD) {
        const newPost = await addPost({ ...post, userId: 1 });
        setData([{ ...newPost, id: data.length + 101 }, ...data]);
      } else if (modalType === ModalType.EDIT) {
        const updatedPost = await editPost(post.id, { ...post, userId: 1 });
        setData(data.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
      }
      setIsModalOpen(false);
      setCurrentPost({ id: 0, title: '', body: '' });
    } catch (error) {
      console.error(`Error ${modalType === ModalType.ADD ? 'adding' : 'updating'} post:`, error);
      setError(
        `Failed to ${modalType === ModalType.ADD ? 'add' : 'update'} post. Please try again.`
      );
    }
  };

  // Define columns
  const columns = useMemo<ColumnDef<Post>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableSorting: true,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        enableSorting: true,
      },
      {
        accessorKey: 'body',
        header: 'Body',
        enableSorting: true,
        cell: ({ getValue }) => <span className="body-text">{getValue<string>()}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) =>
          isFavoritesPage ? (
            <div className={styles.actionButtons}>
              <Button
                variant="contrast"
                onClick={() => toggleFavorite(row.original.id)}
                aria-label="Remove from favorites"
              >
                ★
              </Button>
            </div>
          ) : (
            <div className={styles.actionButtons}>
              <Button variant="outline" onClick={() => openModal(ModalType.VIEW, row.original)}>
                View
              </Button>
              <Button variant="secondary" onClick={() => openModal(ModalType.EDIT, row.original)}>
                Edit
              </Button>
              <Button variant="contrast" onClick={() => handleDelete(row.original.id)}>
                Delete
              </Button>
              <Button
                variant={favorites.includes(row.original.id) ? 'secondary' : 'outline'}
                onClick={() => toggleFavorite(row.original.id)}
                aria-label={
                  favorites.includes(row.original.id) ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                {favorites.includes(row.original.id) ? '★' : '☆'}
              </Button>
            </div>
          ),
      },
    ],
    [favorites, toggleFavorite, isFavoritesPage]
  );

  // Table instance creation
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{isFavoritesPage ? 'Favorites posts' : 'All posts'}</h1>
      {!loading && error ? (
        <Suspense fallback={<LoadingSpinner />}>
          <ErrorAlert
            message={error}
            onRetry={() => fetchPosts()}
            onDismiss={() => setError(null)}
          />
        </Suspense>
      ) : null}
      {!isFavoritesPage ? (
        <div className={styles.controls}>
          <Button variant="secondary" onClick={() => openModal(ModalType.ADD)}>
            Add Post
          </Button>
        </div>
      ) : null}
      {isMobile ? <SortButtons table={table} /> : null}
      <TableComponent
        table={table}
        isEmpty={!filteredData.length}
        loading={loading}
        isMobile={isMobile}
      />
      {!isFavoritesPage ? (
        <Suspense fallback={<LoadingSpinner />}>
          <Modal
            modalType={modalType}
            isOpen={isModalOpen}
            post={currentPost}
            onClose={() => {
              setIsModalOpen(false);
              setCurrentPost({ id: 0, title: '', body: '' });
            }}
            onSubmit={handleModalSubmit}
            onChange={setCurrentPost}
          />
        </Suspense>
      ) : null}
    </main>
  );
};

export default PostsPage;
