import { render, screen, fireEvent } from '@testing-library/react';
import ErrorAlert from '../components/shared/ErrorAlert';

test('renders ErrorAlert with message', () => {
  render(<ErrorAlert message="Test error" onRetry={() => {}} onDismiss={() => {}} />);
  expect(screen.getByText('Test error')).toBeInTheDocument();
});

test('renders retry and dismiss buttons', () => {
  render(<ErrorAlert message="Test error" onRetry={() => {}} onDismiss={() => {}} />);
  expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Dismiss/i })).toBeInTheDocument();
});

test('calls onRetry when retry button is clicked', () => {
  const handleRetry = jest.fn();
  render(<ErrorAlert message="Test error" onRetry={handleRetry} onDismiss={() => {}} />);
  const retryButton = screen.getByRole('button', { name: /Retry/i });
  fireEvent.click(retryButton);
  expect(handleRetry).toHaveBeenCalled();
});

test('calls onDismiss when dismiss button is clicked', () => {
  const handleDismiss = jest.fn();
  render(<ErrorAlert message="Test error" onRetry={() => {}} onDismiss={handleDismiss} />);
  const dismissButton = screen.getByRole('button', { name: /Dismiss/i });
  fireEvent.click(dismissButton);
  expect(handleDismiss).toHaveBeenCalled();
});

test('applies correct classes to buttons', () => {
  render(<ErrorAlert message="Test error" onRetry={() => {}} onDismiss={() => {}} />);
  const retryButton = screen.getByRole('button', { name: /Retry/i });
  const dismissButton = screen.getByRole('button', { name: /Dismiss/i });
  expect(retryButton).toHaveClass('button--primary');
  expect(dismissButton).toHaveClass('button--danger');
});
