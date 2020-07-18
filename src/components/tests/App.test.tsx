import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('renders header text', () => {
  const { getByText } = render(<App />);
  const headerElement = getByText(/React Todo/i);
  expect(headerElement).toBeInTheDocument();
});
