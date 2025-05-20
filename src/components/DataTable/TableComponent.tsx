import { flexRender, Table } from '@tanstack/react-table';
import { Post } from '../../types/shared';
import Pagination from '../shared/Pagination';
import './../../styles/TablePage.css';

interface TableComponentProps {
  table: Table<Post>;
  isEmpty: boolean;
  loading: boolean;
  isMobile: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({ table, isEmpty, loading, isMobile }) => {
  if (loading) {
    return <p>Loading posts...</p>;
  }
  if (isEmpty) {
    return <p className="empty-state">No posts available.</p>;
  }

  return (
    <div className="table-wrapper">
      {!isMobile ? (
        <div className="table-view" data-testid="table-view">
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      aria-sort={
                        header.column.getIsSorted()
                          ? header.column.getIsSorted() === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                      className={header.column.getCanSort() ? 'sortable' : ''}
                    >
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
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card-view" data-testid="card-view">
          {table.getRowModel().rows.map((row) => (
            <article key={row.id} className="card" aria-label="card">
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="card-field">
                  <span>{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
                </div>
              ))}
            </article>
          ))}
        </div>
      )}
      <Pagination table={table} />
    </div>
  );
};

export default TableComponent;
