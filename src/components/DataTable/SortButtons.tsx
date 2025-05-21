import { Table } from '@tanstack/react-table';
import type { Post } from '../../types/shared';
import Button from '../shared/Button';
import styles from './../../styles/SortButtons.module.css';

interface SortButtonsProps {
  table: Table<Post>;
}

const SortButtons: React.FC<SortButtonsProps> = ({ table }) => (
  <div className={styles.sortButtons}>
    <Button
      variant="outline primary"
      onClick={() => table.getColumn('id')!.toggleSorting()}
      ariaPressed={table.getColumn('id')!.getIsSorted() !== false}
      ariaLabel="Sort by ID"
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
      ariaPressed={table.getColumn('title')!.getIsSorted() !== false}
      ariaLabel="Sort by Title"
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
      ariaPressed={table.getColumn('body')!.getIsSorted() !== false}
      ariaLabel="Sort by Body"
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

export default SortButtons;
