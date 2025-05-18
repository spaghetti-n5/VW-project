import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Post } from '../../types/post';
import { fetchPosts, deletePost } from '../../utils/api';
import './DataTable.css';

const DataTable: React.FC = () => {
  const [data, setData] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post>({ id: 0, title: '', body: '' });

  // Fetch data on mount
  useMemo(() => {
    fetchPosts().then((posts) => setData(posts));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setData((prevData) => prevData.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
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
            <button className="outline small" onClick={() => openModal(row.original)}>
              View
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

  // Modal handler
  const openModal = (post: Post = { id: 0, title: '', body: '' }) => {
    setCurrentPost(post);
    setIsModalOpen(true);
  };

  return (
    <div className="container">
      <h1>DataTable</h1>
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

      {/* can be extracted to a separate component */}
      <dialog open={isModalOpen} className="modal">
        <article>
          <h2>Post Details</h2>
          <div>
            <h3>{currentPost.title}</h3>
            <p>{currentPost.body}</p>
          </div>
          <footer>
            <button className="outline small" onClick={() => setIsModalOpen(false)}>
              Close
            </button>
          </footer>
        </article>
      </dialog>
    </div>
  );
};

export default DataTable;
