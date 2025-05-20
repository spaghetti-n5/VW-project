import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { Post } from '../types/shared';
import { usePostStore } from '../store/postStore';
import './../components/DataTable/DataTable.css';
import TableComponent from '../components/DataTable/TableComponent';
import Button from '../components/shared/Button';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { fetchPosts } from '../utils/api';
import SortingButtons from '../components/DataTable/SortingButtons';

const FavoritesPage: React.FC = () => {
  const { favorites, toggleFavorite, searchText } = usePostStore();
  const [data, setData] = useState<Post[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  const isMobile = window.innerWidth <= 991;

  // Filter posts by favorites
  const favoriteData = useMemo(() => {
    return data.filter((post) => favorites.includes(post.id));
  }, [data, favorites]);

  // Global search filter
  const filteredData = useMemo(() => {
    if (!searchText) return favoriteData;
    return favoriteData.filter((post) =>
      Object.values(post).some((val) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [favoriteData, searchText]);

  // Define columns (no actions, as this is view-only)
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
        cell: ({ row }) => (
          <div className="action-buttons">
            <Button
              variant="contrast"
              onClick={() => toggleFavorite(row.original.id)}
              aria-label="Remove from favorites"
            >
              ★
            </Button>
          </div>
        ),
      },
    ],
    [toggleFavorite]
  );

  // Table instance creation
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <main className="container">
      <h1>Favorite Posts</h1>
      {error ? (
        <div>{error}</div>
      ) : loading ? (
        <LoadingSpinner />
      ) : favoriteData.length === 0 ? (
        <p>No favorite posts yet.</p>
      ) : (
        <>
          {isMobile ? <SortingButtons table={table} /> : null}
          <TableComponent
            table={table}
            isEmpty={!filteredData.length}
            loading={loading}
            isMobile={isMobile}
          />
        </>
      )}
    </main>
  );
};

export default FavoritesPage;
