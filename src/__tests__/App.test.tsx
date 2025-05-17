import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

test('renders the App and check if text is rendered', () => {
  render(<App />);
  expect(screen.getByText('Vite + React')).toBeInTheDocument();
});
