import { flexRender, Table } from '@tanstack/react-table';
import type { Post } from '../../types/shared';
import Pagination from '../shared/Pagination';
import styles from './../../styles/TableComponent.module.css';
import globalStyles from './../../styles/PostsPage.module.css';

interface TableComponentProps {
  table: Table<Post>;
  isEmpty: boolean;
  loading: boolean;
  isMobile: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({ table, isEmpty, loading, isMobile }) => {
  if (loading) {
    return <p role="status">Loading posts...</p>;
  }
  if (isEmpty) {
    return (
      <p role="status" className={styles.emptyState}>
        No posts available.
      </p>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      {!isMobile ? (
        <div className={styles.tableView} data-testid="table-view">
          <table role="grid" aria-labelledby="posts-table">
            <caption id="posts-table" className={globalStyles.visuallyHidden}>
              Posts table
            </caption>
            <thead role="rowgroup">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} role="row">
                  {headerGroup.headers.map((header) => (
                    <th
                      role="columnheader"
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
            <tbody role="rowgroup">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} role="row">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} role="gridcell">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          role="grid"
          className={styles.cardView}
          data-testid="card-view"
          aria-labelledby="posts-table-mobile"
        >
          <caption id="posts-table-mobile" className={globalStyles.visuallyHidden}>
            Posts table mobile
          </caption>
          {table.getRowModel().rows.map((row) => (
            <article key={row.id} className={styles.card} role="row">
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className={styles.cardField} role="gridcell">
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
