import React from 'react';
import { render, screen } from '@testing-library/react';
import App, { ImportantForm } from './App';
import { BrowserRouter } from 'react-router-dom'

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/one/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders learn react link', () => {
  render(<ImportantForm />,  {wrapper: BrowserRouter});
  const paragraph = screen.getByText(/Is the form dirty/i);
  expect(paragraph).toBeInTheDocument();
});
