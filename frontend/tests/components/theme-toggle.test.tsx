import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '@/components/theme-toggle'
import { useTheme } from 'next-themes'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Moon: ({ size, className }: { size: number; className: string }) => (
    <svg data-testid="moon-icon" className={className} width={size} height={size} />
  ),
  Sun: ({ size, className }: { size: number; className: string }) => (
    <svg data-testid="sun-icon" className={className} width={size} height={size} />
  ),
}))

describe('ThemeToggle Component', () => {
  const mockSetTheme = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render sun icon when theme is dark', async () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    // Wait for component to mount
    await waitFor(() => {
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    })
  })

  it('should render moon icon when theme is light', async () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    await waitFor(() => {
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    })
  })

  it('should toggle theme from dark to light', async () => {
    const user = userEvent.setup()
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    await waitFor(() => {
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    })

    const button = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(button)
    
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('should toggle theme from light to dark', async () => {
    const user = userEvent.setup()
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    await waitFor(() => {
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    })

    const button = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(button)
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('should have accessible aria-label', async () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle theme/i })
      expect(button).toHaveAttribute('aria-label', 'Toggle theme')
    })
  })

  it('should apply correct classes to button', async () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    await waitFor(() => {
      const button = screen.getByRole('button')
      expect(button.className).toContain('rounded-lg')
      expect(button.className).toContain('p-2')
    })
  })

  it('should render icon with correct size', async () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)
    
    await waitFor(() => {
      const icon = screen.getByTestId('moon-icon')
      expect(icon).toHaveAttribute('width', '20')
      expect(icon).toHaveAttribute('height', '20')
    })
  })
})
