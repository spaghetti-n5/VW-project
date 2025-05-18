import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Post, ModalType } from '../../types/shared';
import { fetchPosts, deletePost, editPost, addPost } from '../../utils/api';
import './DataTable.css';
import Modal from '../Modal/Modal';

const DataTable: React.FC = () => {
  const [data, setData] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post>({ id: 0, title: '', body: '' });
  const [modalType, setModalType] = useState<ModalType>(ModalType.VIEW);
  const [error, setError] = useState<string | null>(null);

  // improvement loading state

  // Fetch data on mount
  useMemo(() => {
    fetchPosts()
      .then((posts) => setData(posts))
      .catch(() => setError('Failed to fetch posts. Please try again.'));
  }, []);

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
        enableSorting: false,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        enableSorting: false,
      },
      {
        accessorKey: 'body',
        header: 'Body',
        enableSorting: false,
        cell: ({ getValue }) => <span className="body-text">{getValue<string>()}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="action-buttons">
            <button
              className="outline small"
              onClick={() => openModal(ModalType.VIEW, row.original)}
            >
              View
            </button>

            <button
              className="outline small primary"
              onClick={() => openModal(ModalType.EDIT, row.original)}
            >
              Edit
            </button>

            <button className="outline small danger" onClick={() => handleDelete(row.original.id)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Table instance creation
  const table = useReactTable({
    data,
    columns,
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
    <div className="container">
      <h1>DataTable</h1>
      {error ? (
        <div className="error-alert">
          <span>{error}</span>
          <button className="outline small danger" onClick={() => setError(null)}>
            Dismiss
          </button>
        </div>
      ) : null}
      <button className="outline small primary" onClick={() => openModal(ModalType.ADD)}>
        Add Post
      </button>
      <div className="table-wrapper">
        <table className="data-table striped">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </div>
  );
};

export default DataTable;
