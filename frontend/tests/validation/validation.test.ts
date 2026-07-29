import { loginSchema, registerSchema } from '@/app/(routes)/(auth)/_components/lib/validation'

describe('loginSchema', () => {
  it('should validate correct login data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123',
    }
    
    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validData)
    }
  })

  it('should fail validation when email is empty', () => {
    const invalidData = {
      email: '',
      password: 'password123',
    }
    
    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('This field is empty')
    }
  })

  it('should fail validation when password is empty', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '',
    }
    
    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('This field is empty')
    }
  })

  it('should fail validation when both fields are empty', () => {
    const invalidData = {
      email: '',
      password: '',
    }
    
    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toHaveLength(2)
    }
  })

  it('should fail validation when email field is missing', () => {
    const invalidData = {
      password: 'password123',
    }
    
    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should fail validation when password field is missing', () => {
    const invalidData = {
      email: 'test@example.com',
    }
    
    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  it('should validate correct registration data', () => {
    const validData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'customer',
    }
    
    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validData)
    }
  })

  it('should use default role when not provided', () => {
    const validData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    }
    
    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.role).toBe('customer')
    }
  })

  it('should fail validation when username is empty', () => {
    const invalidData = {
      username: '',
      email: 'test@example.com',
      password: 'password123',
    }
    
    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('This field is empty')
    }
  })

  it('should fail validation when email is empty', () => {
    const invalidData = {
      username: 'testuser',
      email: '',
      password: 'password123',
    }
    
    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('This field is empty')
    }
  })

  it('should fail validation when password is empty', () => {
    const invalidData = {
      username: 'testuser',
      email: 'test@example.com',
      password: '',
    }
    
    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('This field is empty')
    }
  })

  it('should fail validation when all required fields are empty', () => {
    const invalidData = {
      username: '',
      email: '',
      password: '',
    }
    
    const result = registerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toHaveLength(3)
    }
  })

  it('should accept custom role', () => {
    const validData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'shop',
    }
    
    const result = registerSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.role).toBe('shop')
    }
  })
})
