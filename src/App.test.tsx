import React from 'react';
import { render, screen } from '@testing-library/react';
import App, { ImportantForm } from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <ImportantForm />,
  },
]);

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/one/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders learn react link', () => {
  render(<RouterProvider router={router} />);
  const paragraph = screen.getByText(/Is the form dirty/i);
  expect(paragraph).toBeInTheDocument();
});
