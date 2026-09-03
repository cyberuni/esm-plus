import { EventEmitter } from 'node:events'
import { fileURLToPath } from 'node:url'
import uniRequire, { createUniRequire } from '../index.js'

// `fixture.json` sits next to this spec, one directory below `uni-require`'s own entry.
// Only a require bound to the CALLER can find it; the old implementation, bound to
// `uni-require`'s own `import.meta.url`, looked in the package root and threw.
const fixture = fileURLToPath(new URL('./fixture.json', import.meta.url))

describe('uniRequire', () => {
  it('loads a builtin', () => {
    expect(uniRequire('node:child_process')).toBeTruthy()
  })

  it('resolves relative specifiers against the calling file, not against uni-require', () => {
    expect(uniRequire.resolve('./fixture.json')).toBe(fixture)
  })

  it('loads relative modules from the calling file', () => {
    expect(uniRequire('./fixture.json')).toEqual({ name: 'caller-local-fixture' })
  })

  it('exposes require.resolve.paths', () => {
    expect(Array.isArray(uniRequire.resolve.paths('vitest'))).toBe(true)
  })

  it('exposes the process-wide require members', () => {
    expect(typeof uniRequire.cache).toBe('object')
    expect(typeof uniRequire.extensions).toBe('object')
    expect(uniRequire.main === undefined || typeof uniRequire.main === 'object').toBe(true)
  })

  it('looks past Node internal frames for the calling file', () => {
    // Handing `uniRequire` straight to a Node API puts `node:events` on top of the stack.
    // Those frames name no user file, so the search has to walk past them to the spec.
    const emitter = new EventEmitter()
    emitter.on('load', uniRequire)
    expect(() => emitter.emit('load', './fixture.json')).not.toThrow()
  })

  it('still loads builtins when the call site cannot be recovered', () => {
    // `stackTraceLimit = 0` captures no frames at all, which is the shape of a call site
    // that has been inlined or eval'd away. The require then falls back to uni-require's
    // own location, where builtins still resolve.
    const limit = Error.stackTraceLimit
    Error.stackTraceLimit = 0
    try {
      expect(uniRequire('node:os')).toBeTruthy()
    } finally {
      Error.stackTraceLimit = limit
    }
  })

  it('reuses one require per calling file', () => {
    // The second call takes the cached branch instead of building another require.
    expect(uniRequire.resolve('./fixture.json')).toBe(uniRequire.resolve('./fixture.json'))
  })
})

describe('createUniRequire', () => {
  it('binds to an explicit location', () => {
    expect(createUniRequire(import.meta.url).resolve('./fixture.json')).toBe(fixture)
  })
})
