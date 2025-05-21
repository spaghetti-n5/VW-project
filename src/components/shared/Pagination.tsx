import { Table } from '@tanstack/react-table';
import Button from './Button';
import styles from './../../styles/Pagination.module.css';
import globalStyles from './../../styles/PostsPage.module.css';

interface PaginationProps<T> {
  table: Table<T>;
}

const Pagination = <T,>({ table }: PaginationProps<T>) => {
  return (
    <div className={styles.pagination}>
      <div>
        <Button
          variant="outline"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          ariaLabel="First Page"
        >
          First
        </Button>
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          ariaLabel="Previous Page"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          ariaLabel="Next Page"
        >
          Next
        </Button>
        <Button
          variant="outline"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          ariaLabel="Last Page"
        >
          Last
        </Button>
      </div>
      <div>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <label className={globalStyles.visuallyHidden} htmlFor="page size">
          Page size:
        </label>
        <select
          id="page size"
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
