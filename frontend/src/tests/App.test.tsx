import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

// Mock the API calls
jest.mock('../services/api', () => ({
  authAPI: {
    login: jest.fn(() => Promise.resolve({
      access_token: 'test-token',
      token_type: 'bearer'
    }))
  },
  setAuthToken: jest.fn(),
  clearAuthToken: jest.fn()
}))

describe('App Component', () => {
  test('renders login page initially', () => {
    render(<App />)
    expect(screen.getByText('Clinical Trial Dashboard')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  test('shows demo credentials', () => {
    render(<App />)
    expect(screen.getByText('Demo credentials: researcher / password123')).toBeInTheDocument()
  })
})