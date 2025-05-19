import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/shared/SearchBar';

test('renders SearchBar with default placeholder', () => {
  render(<SearchBar value="" onChange={() => {}} />);
  const input = screen.getByPlaceholderText('Search by any field...');
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute('type', 'search');
});

test('renders SearchBar with custom placeholder', () => {
  render(<SearchBar value="" onChange={() => {}} placeholder="Search posts" />);
  const input = screen.getByPlaceholderText('Search posts');
  expect(input).toBeInTheDocument();
});

test('renders SearchBar with visible label', () => {
  render(<SearchBar value="" onChange={() => {}} label="Search Posts" name="search" />);
  const label = screen.getByText('Search Posts');
  expect(label).toBeInTheDocument();
  expect(label).not.toHaveClass('visually-hidden');
});

test('renders SearchBar with hidden label', () => {
  render(<SearchBar value="" onChange={() => {}} label="Search Posts" name="search" hideLabel={true} />);
  const label = screen.getByText('Search Posts');
  expect(label).toHaveClass('visually-hidden');
});

test('calls onChange when input value changes', () => {
  const handleChange = jest.fn();
  render(<SearchBar value="" onChange={handleChange} />);
  const input = screen.getByPlaceholderText('Search by any field...');
  fireEvent.change(input, { target: { value: 'test' } });
  expect(handleChange).toHaveBeenCalledWith('test');
});

test('sets input value correctly', () => {
  render(<SearchBar value="query" onChange={() => {}} />);
  const input = screen.getByPlaceholderText('Search by any field...');
  expect(input).toHaveValue('query');
});

test('applies name and id attributes', () => {
  render(<SearchBar value="" onChange={() => {}} name="search" />);
  const input = screen.getByPlaceholderText('Search by any field...');
  expect(input).toHaveAttribute('name', 'search');
  expect(input).toHaveAttribute('id', 'search');
});