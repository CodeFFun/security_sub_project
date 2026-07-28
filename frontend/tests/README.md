# Frontend Unit Tests

This directory contains unit tests for the SkillSub Web frontend application.

## Test Structure

```
tests/
├── components/          # Component tests
│   ├── button.test.tsx
│   ├── login-form.test.tsx
│   └── theme-toggle.test.tsx
├── lib/                # Utility function tests
│   ├── utils.test.ts
│   └── cookie.test.ts
└── validation/         # Schema validation tests
    └── validation.test.ts
```

## Testing Stack

- **Jest**: Testing framework
- **React Testing Library**: React component testing utilities
- **@testing-library/user-event**: User interaction simulation

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests for a specific file
pnpm test button.test.tsx
```

## Writing Tests

### Component Tests

Component tests should:
- Render the component and verify it appears correctly
- Test user interactions (clicks, typing, etc.)
- Verify state changes and side effects
- Check accessibility features

Example:
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })
})
```

### Utility Function Tests

Utility tests should:
- Test pure functions with various inputs
- Verify edge cases
- Check error handling

Example:
```typescript
import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-4', 'py-2')
    expect(result).toBe('px-4 py-2')
  })
})
```

### Validation Tests

Validation tests should:
- Test valid inputs
- Test invalid inputs
- Verify error messages

Example:
```typescript
import { loginSchema } from '@/app/(routes)/(auth)/_components/lib/validation'

describe('loginSchema', () => {
  it('should validate correct login data', () => {
    const validData = { email: 'test@example.com', password: 'password123' }
    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})
```

## Test Coverage

Aim for:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Mocking

Common mocks are configured in `jest.setup.js`:
- Next.js navigation (`next/navigation`)
- Toast notifications (`sonner`)

## Best Practices

1. **Test behavior, not implementation**: Focus on what the component does, not how it does it
2. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Test user flows**: Simulate real user interactions
4. **Keep tests isolated**: Each test should be independent
5. **Use descriptive test names**: Clearly state what is being tested
6. **Mock external dependencies**: Mock API calls, navigation, etc.

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Pre-deployment checks

## Troubleshooting

### Tests failing due to Next.js imports
- Ensure `jest.config.js` uses `next/jest`
- Check that mocks are properly configured in `jest.setup.js`

### Async state updates
- Use `waitFor` from React Testing Library
- Wrap state updates in `act()` if needed

### Module not found errors
- Verify path aliases in `jest.config.js` match `tsconfig.json`
- Check that all dependencies are installed

## Contributing

When adding new features:
1. Write tests alongside your code
2. Ensure all tests pass before submitting PR
3. Maintain or improve code coverage
4. Follow existing test patterns
