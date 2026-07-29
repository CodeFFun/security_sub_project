import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-4', 'py-2')
    expect(result).toBe('px-4 py-2')
  })

  it('should handle conditional class names', () => {
    const result = cn('px-4', false && 'hidden', 'py-2')
    expect(result).toBe('px-4 py-2')
  })

  it('should merge conflicting Tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4')
  })

  it('should handle undefined and null values', () => {
    const result = cn('px-4', undefined, null, 'py-2')
    expect(result).toBe('px-4 py-2')
  })

  it('should handle empty inputs', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle array inputs', () => {
    const result = cn(['px-4', 'py-2'])
    expect(result).toBe('px-4 py-2')
  })

  it('should handle object inputs', () => {
    const result = cn({
      'px-4': true,
      'py-2': true,
      'hidden': false,
    })
    expect(result).toBe('px-4 py-2')
  })

  it('should combine multiple types of inputs', () => {
    const result = cn('px-4', { 'py-2': true, 'hidden': false }, ['rounded', 'shadow'])
    expect(result).toContain('px-4')
    expect(result).toContain('py-2')
    expect(result).toContain('rounded')
    expect(result).toContain('shadow')
  })
})
