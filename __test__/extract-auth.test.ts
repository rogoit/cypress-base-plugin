import { describe, test, expect, vi, beforeEach } from 'vitest'
import {
  extractAuth,
  applyAuth,
  addCredentialsToInternalLinks,
  extractAuthForUrl,
  addCredentialsToUrl
} from '../src/utils/extractAuth'

describe('extractAuth', () => {
  test('extracts credentials from URL', () => {
    const result = extractAuth('https://user:pass@example.com')
    expect(result).toEqual({ username: 'user', password: 'pass' })
  })

  test('returns null for URL without credentials', () => {
    const result = extractAuth('https://example.com')
    expect(result).toBeNull()
  })

  test('returns null for empty username', () => {
    const result = extractAuth('https://:pass@example.com')
    expect(result).toBeNull()
  })

  test('returns null for empty password', () => {
    const result = extractAuth('https://user:@example.com')
    expect(result).toBeNull()
  })

  test('returns null for invalid URL', () => {
    const result = extractAuth('not-a-url')
    expect(result).toBeNull()
  })

  test('handles URL-encoded characters in credentials', () => {
    const result = extractAuth('https://user%40name:p%40ss@example.com')
    expect(result).toEqual({ username: 'user%40name', password: 'p%40ss' })
  })
})

describe('applyAuth', () => {
  test('applies credentials to URL', () => {
    const result = applyAuth('https://example.com/path', {
      username: 'admin',
      password: 'secret'
    })
    expect(result).toBe('https://admin:secret@example.com/path')
  })

  test('returns original URL when auth is null', () => {
    const result = applyAuth('https://example.com', null)
    expect(result).toBe('https://example.com')
  })

  test('returns original URL for invalid URL', () => {
    const result = applyAuth('invalid', {
      username: 'a',
      password: 'b'
    })
    expect(result).toBe('invalid')
  })
})

describe('addCredentialsToInternalLinks', () => {
  beforeEach(() => {
    vi.stubGlobal('Cypress', {
      config: vi.fn(() => 'https://user:pass@example.com')
    })
  })

  test('adds credentials to links without auth', () => {
    const links = ['https://example.com/page1', 'https://example.com/page2']
    const result = addCredentialsToInternalLinks(
      links,
      'https://user:pass@example.com'
    )
    expect(result).toEqual([
      'https://user:pass@example.com/page1',
      'https://user:pass@example.com/page2'
    ])
  })

  test('skips links that already have credentials', () => {
    const links = ['https://other:auth@example.com/page']
    const result = addCredentialsToInternalLinks(
      links,
      'https://user:pass@example.com'
    )
    expect(result).toEqual(['https://other:auth@example.com/page'])
  })

  test('returns links unchanged when baseUrl has no credentials', () => {
    const links = ['https://example.com/page']
    const result = addCredentialsToInternalLinks(links, 'https://example.com')
    expect(result).toEqual(['https://example.com/page'])
  })

  test('returns links unchanged when baseUrl is empty', () => {
    vi.stubGlobal('Cypress', {
      config: vi.fn(() => undefined)
    })
    const links = ['https://example.com/page']
    const result = addCredentialsToInternalLinks(links, undefined as any)
    expect(result).toEqual(['https://example.com/page'])
  })
})

describe('extractAuthForUrl', () => {
  const credentialedBaseUrl = 'https://nca:nca@staging.example.com'

  test('returns credentials for absolute URL matching the credential free baseUrl host', () => {
    const result = extractAuthForUrl(
      'https://staging.example.com/img/logo.png',
      credentialedBaseUrl
    )
    expect(result).toEqual({ username: 'nca', password: 'nca' })
  })

  test('returns credentials for relative URLs', () => {
    const result = extractAuthForUrl('/img/logo.png', credentialedBaseUrl)
    expect(result).toEqual({ username: 'nca', password: 'nca' })
  })

  test('returns credentials for protocol relative URLs of the same host', () => {
    const result = extractAuthForUrl(
      '//staging.example.com/img/logo.png',
      credentialedBaseUrl
    )
    expect(result).toEqual({ username: 'nca', password: 'nca' })
  })

  test('returns null for external URLs when baseUrl contains credentials', () => {
    const result = extractAuthForUrl(
      'https://external-cdn.com/img/hero.png',
      credentialedBaseUrl
    )
    expect(result).toBeNull()
  })

  test('returns null when baseUrl has no credentials', () => {
    const result = extractAuthForUrl(
      'https://example.com/img/logo.png',
      'https://example.com'
    )
    expect(result).toBeNull()
  })

  test('treats non absolute URLs as relative and returns credentials', () => {
    const result = extractAuthForUrl('not-a-url', credentialedBaseUrl)
    expect(result).toEqual({ username: 'nca', password: 'nca' })
  })
})

describe('addCredentialsToUrl', () => {
  const credentialedBaseUrl = 'https://nca:nca@staging.example.com'

  test('adds credentials to relative URLs', () => {
    const result = addCredentialsToUrl('/img/logo.png', credentialedBaseUrl)
    expect(result).toBe('https://nca:nca@staging.example.com/img/logo.png')
  })

  test('adds credentials to absolute internal URLs', () => {
    const result = addCredentialsToUrl(
      'https://staging.example.com/img/logo.png',
      credentialedBaseUrl
    )
    expect(result).toBe('https://nca:nca@staging.example.com/img/logo.png')
  })

  test('adds credentials to protocol relative internal URLs', () => {
    const result = addCredentialsToUrl(
      '//staging.example.com/img/logo.png',
      credentialedBaseUrl
    )
    expect(result).toBe('https://nca:nca@staging.example.com/img/logo.png')
  })

  test('returns external URLs unchanged', () => {
    const result = addCredentialsToUrl(
      'https://external-cdn.com/img/hero.png',
      credentialedBaseUrl
    )
    expect(result).toBe('https://external-cdn.com/img/hero.png')
  })

  test('returns already credentialed URLs unchanged', () => {
    const result = addCredentialsToUrl(
      'https://other:auth@staging.example.com/img/logo.png',
      credentialedBaseUrl
    )
    expect(result).toBe('https://other:auth@staging.example.com/img/logo.png')
  })

  test('returns data URLs unchanged', () => {
    const result = addCredentialsToUrl(
      'data:image/png;base64,abcdef',
      credentialedBaseUrl
    )
    expect(result).toBe('data:image/png;base64,abcdef')
  })

  test('returns blob URLs unchanged', () => {
    const result = addCredentialsToUrl('blob:https://example.com/uuid')
    expect(result).toBe('blob:https://example.com/uuid')
  })

  test('returns anchors unchanged', () => {
    const result = addCredentialsToUrl('#', credentialedBaseUrl)
    expect(result).toBe('#')
  })

  test('returns the URL unchanged when baseUrl has no credentials', () => {
    const result = addCredentialsToUrl(
      'https://example.com/img/logo.png',
      'https://example.com'
    )
    expect(result).toBe('https://example.com/img/logo.png')
  })

  test('falls back to the Cypress baseUrl', () => {
    vi.stubGlobal('Cypress', {
      config: vi.fn(() => credentialedBaseUrl)
    })
    const result = addCredentialsToUrl('/img/logo.png')
    expect(result).toBe('https://nca:nca@staging.example.com/img/logo.png')
    vi.unstubAllGlobals()
  })
})
