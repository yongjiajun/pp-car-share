import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders location link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Locations/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders sign up link', () => {
  const { getAllByText } = render(<App />);
  const linkElement = getAllByText(/Sign Up/i);
  // expect(linkElement).toBeInTheDocument();
  linkElement.map(element => {
    expect(element).toBeInTheDocument();
  })
});

test('renders log in link', () => {
  const { getAllByText } = render(<App />);
  const linkElement = getAllByText(/Log in/i);
  linkElement.map(element => {
    expect(element).toBeInTheDocument();
  })
});

test("does not render staff dashboard", () => {
  const { queryByText } = render(<App />);
  const linkElement = queryByText(/Staff dashboard/i);
  expect(linkElement).toBeNull()

});


