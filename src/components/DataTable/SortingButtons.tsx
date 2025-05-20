import { Table } from '@tanstack/react-table';
import { Post } from '../../types/shared';
import Button from '../shared/Button';
import './../../styles/TablePage.css';

interface SortingButtonsProps {
  table: Table<Post>;
}

const SortingButtons: React.FC<SortingButtonsProps> = ({ table }) => {
  return (
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
  );
};

export default SortingButtons;
