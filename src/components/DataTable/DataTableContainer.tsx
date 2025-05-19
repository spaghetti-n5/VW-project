import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { Post, ModalType } from '../../types/shared';
import { fetchPosts, deletePost, editPost, addPost } from '../../utils/api';
import './DataTable.css';
import Modal from './Modal';
import TableComponent from './TableComponent';
import SearchBar from '../shared/SearchBar';
import ErrorAlert from '../shared/ErrorAlert';
import Button from '../shared/Button';

const DataTableContainer: React.FC = () => {
  const [data, setData] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post>({ id: 0, title: '', body: '' });
  const [modalType, setModalType] = useState<ModalType>(ModalType.VIEW);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sorting, setSorting] = useState<SortingState>([]);

  const isMobile = window.innerWidth <= 991;
  // Fetch data on mount
  useEffect(() => {
    fetchPosts()
      .then((posts) => setData(posts))
      .catch(() => setError('Failed to fetch posts. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  // Global search filter
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    return data.filter((post) =>
      Object.values(post).some((val) =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [data, searchText]);

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setData((prevData) => prevData.filter((post) => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again.');
    }
  };

  // Modal handler
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

  // Define columns of the table
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
            <Button variant="outline" onClick={() => openModal(ModalType.VIEW, row.original)}>
              View
            </Button>
            <Button variant="secondary" onClick={() => openModal(ModalType.EDIT, row.original)}>
              Edit
            </Button>
            <Button variant="contrast" onClick={() => handleDelete(row.original.id)}>
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
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
      <h1>DataTable</h1>
      {error ? (
        <ErrorAlert message={error} onRetry={fetchPosts} onDismiss={() => setError(null)} />
      ) : null}
      <div className="controls">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          label="Search Posts"
          name="search"
          hideLabel
        />
        <Button variant="secondary" onClick={() => openModal(ModalType.ADD)}>
          Add Post
        </Button>
      </div>
      {isMobile ? (
        <div className="sort-buttons">
          {/* Non-null assertion used as 'id', 'title', 'body' are guaranteed to exist in columns */}
          <Button
            variant="outline primary"
            onClick={() => table.getColumn('id')!.toggleSorting()}
            aria-pressed={table.getColumn('id')!.getIsSorted() !== false}
          >
            Sort by ID{' '}
            {table.getColumn('id')!.getIsSorted() === 'asc'
              ? '↑'
              : table.getColumn('id')!.getIsSorted() === 'desc'
                ? '↓'
                : ''}
          </Button>
          <Button
            variant="outline primary"
            onClick={() => table.getColumn('title')!.toggleSorting()}
            aria-pressed={table.getColumn('title')!.getIsSorted() !== false}
          >
            Sort by Title{' '}
            {table.getColumn('title')!.getIsSorted() === 'asc'
              ? '↑'
              : table.getColumn('title')!.getIsSorted() === 'desc'
                ? '↓'
                : ''}
          </Button>
          <Button
            variant="outline primary"
            onClick={() => table.getColumn('body')!.toggleSorting()}
            aria-pressed={table.getColumn('body')!.getIsSorted() !== false}
          >
            Sort by Body{' '}
            {table.getColumn('body')!.getIsSorted() === 'asc'
              ? '↑'
              : table.getColumn('body')!.getIsSorted() === 'desc'
                ? '↓'
                : ''}
          </Button>
        </div>
      ) : null}
      <TableComponent
        table={table}
        isEmpty={!filteredData.length}
        loading={loading}
        isMobile={isMobile}
      />
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
    </main>
  );
};

export default DataTableContainer;
