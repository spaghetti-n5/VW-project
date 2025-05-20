import { flexRender, Table } from '@tanstack/react-table';
import { Post } from '../../types/shared';
import Pagination from '../shared/Pagination';
import styles from './../../styles/TablePage.module.css';

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
    return <p className={styles.emptyState}>No posts available.</p>;
  }

  return (
    <div className={styles.tableWrapper}>
      {!isMobile ? (
        <div className={styles.tableView} data-testid="table-view">
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
                      className={header.column.getCanSort() ? styles.sortable : ''}
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
        <div className={styles.cardView} data-testid="card-view">
          {table.getRowModel().rows.map((row) => (
            <article key={row.id} className={styles.card} aria-label="card">
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className={styles.cardField}>
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
