import { flexRender, Table } from '@tanstack/react-table';
import { Post } from '../../types/shared';
import Pagination from '../shared/Pagination';
import './DataTable.css';

interface TableComponentProps {
  table: Table<Post>;
  isEmpty: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({ table, isEmpty }) => (
  <div className="table-wrapper">
    {isEmpty ? <div className="empty-state">No posts available.</div> : null}
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
    <Pagination table={table} />
  </div>
);

export default TableComponent;
