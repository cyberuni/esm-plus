// Smoke test for the ESM entry, run by plain `node` so no transform sits between the
// call site and the stack `uniRequire()` reads.
import assert from 'node:assert'
import { fileURLToPath } from 'node:url'
import u, { createUniRequire, uniRequire } from 'uni-require'

const here = fileURLToPath(new URL('./package.json', import.meta.url))

assert(u('node:child_process'))
assert(uniRequire('node:child_process'))

// Regression: the require must be bound to THIS file, not to uni-require's own module.
assert.equal(u.resolve('./package.json'), here)
assert.equal(u('./package.json').name, 'uni-require-tests')
assert.equal(createUniRequire(import.meta.url).resolve('./package.json'), here)
