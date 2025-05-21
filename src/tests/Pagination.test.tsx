import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './../components/shared/Pagination';
import { Table } from '@tanstack/react-table';
import type { Post } from './../types/shared';

// Mock table for Pagination
const mockTable: Partial<Table<Post>> = {
  getCanPreviousPage: jest.fn(() => false),
  getCanNextPage: jest.fn(() => true),
  getPageCount: jest.fn(() => 2),
  getState: jest.fn(() => ({
    pagination: {
      pageIndex: 0,
      pageSize: 5,
    },
    columnVisibility: {},
    columnOrder: [],
    columnPinning: { left: [], right: [] },
    rowPinning: { top: [], bottom: [] },
    rowSelection: {},
    columnFilters: [],
    globalFilter: '',
    sorting: [],
    expanded: {},
    grouping: [],
    columnSizing: {},
    columnSizingInfo: {
      startOffset: 0,
      startSize: 0,
      deltaOffset: 0,
      deltaPercentage: 0,
      columnSizingStart: [],
      isResizingColumn: false,
    },
  })),
  setPageIndex: jest.fn(),
  previousPage: jest.fn(),
  nextPage: jest.fn(),
  setPageSize: jest.fn(),
};

describe('Pagination Component', () => {
  beforeEach(() => {
    // Reset mock table
    jest.clearAllMocks();
    (mockTable.getCanPreviousPage as jest.Mock).mockReturnValue(false);
    (mockTable.getCanNextPage as jest.Mock).mockReturnValue(true);
    (mockTable.getPageCount as jest.Mock).mockReturnValue(2);
    (mockTable.getState as jest.Mock).mockReturnValue({
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
      columnVisibility: {},
      columnOrder: [],
      columnPinning: { left: [], right: [] },
      rowPinning: { top: [], bottom: [] },
      rowSelection: {},
      columnFilters: [],
      globalFilter: '',
      sorting: [],
      expanded: {},
      grouping: [],
      columnSizing: {},
      columnSizingInfo: {
        startOffset: 0,
        startSize: 0,
        deltaOffset: 0,
        deltaPercentage: 0,
        columnSizingStart: [],
        isResizingColumn: false,
      },
    });
  });

  test('renders correctly', () => {
    render(<Pagination table={mockTable as Table<Post>} />);

    expect(screen.getByRole('button', { name: 'First Page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous Page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next Page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Last Page' })).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('5');
    expect(screen.getByRole('option', { name: 'Show 5' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Show 10' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Show 20' })).toBeInTheDocument();
  });

  test('disables First and Previous buttons on first page', () => {
    render(<Pagination table={mockTable as Table<Post>} />);

    expect(screen.getByRole('button', { name: 'First Page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous Page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next Page' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last Page' })).not.toBeDisabled();
  });

  test('disables Next and Last buttons on last page', () => {
    (mockTable.getState as jest.Mock).mockReturnValue({
      pagination: {
        pageIndex: 1,
        pageSize: 5,
      },
      columnVisibility: {},
      columnOrder: [],
      columnPinning: { left: [], right: [] },
      rowPinning: { top: [], bottom: [] },
      rowSelection: {},
      columnFilters: [],
      globalFilter: '',
      sorting: [],
      expanded: {},
      grouping: [],
      columnSizing: {},
      columnSizingInfo: {
        startOffset: 0,
        startSize: 0,
        deltaOffset: 0,
        deltaPercentage: 0,
        columnSizingStart: [],
        isResizingColumn: false,
      },
    });
    (mockTable.getCanPreviousPage as jest.Mock).mockReturnValue(true);
    (mockTable.getCanNextPage as jest.Mock).mockReturnValue(false);

    render(<Pagination table={mockTable as Table<Post>} />);

    expect(screen.getByRole('button', { name: 'First Page' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous Page' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next Page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last Page' })).toBeDisabled();
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
  });

  test('calls correct methods on button clicks', () => {
    (mockTable.getCanPreviousPage as jest.Mock).mockReturnValue(true);
    (mockTable.getCanNextPage as jest.Mock).mockReturnValue(true);

    render(<Pagination table={mockTable as Table<Post>} />);

    fireEvent.click(screen.getByRole('button', { name: 'First Page' }));
    expect(mockTable.setPageIndex).toHaveBeenCalledWith(0);

    fireEvent.click(screen.getByRole('button', { name: 'Previous Page' }));
    expect(mockTable.previousPage).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Next Page' }));
    expect(mockTable.nextPage).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Last Page' }));
    expect(mockTable.setPageIndex).toHaveBeenCalledWith(1);
  });

  test('changes page size on select change', () => {
    render(<Pagination table={mockTable as Table<Post>} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '10' } });

    expect(mockTable.setPageSize).toHaveBeenCalledWith(10);
  });
});
