import { isSchemaSecure, validateSchema } from '../src'

describe('validate', () => {
  describe('isSchemaSecure', () => {
    it('returns false for an insecure schema', () => {
      const schema = {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            pattern: '^a',
          },
        },
      }
      expect(isSchemaSecure(schema)).toBe(false)
    })

    it('returns true for an secure schema', () => {
      const schema = {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            pattern: '^a',
            maxLength: 5,
          },
        },
      }
      expect(isSchemaSecure(schema)).toBe(true)
    })
  })

  describe('validateSchema', () => {
    it('throws an error for an invalid schema', () => {
      expect(() => validateSchema({ type: 'foo' })).toThrow()
    })

    it('returns false for an insecure schema', () => {
      const schema = {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            pattern: '^a',
          },
        },
      }
      expect(validateSchema(schema)).toBe(false)
    })

    it('returns true for an secure schema', () => {
      const schema = {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            pattern: '^a',
            maxLength: 5,
          },
        },
      }
      expect(validateSchema(schema)).toBe(true)
    })
  })
})
