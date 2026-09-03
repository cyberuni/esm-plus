import assert from 'node:assert'
import uniRequire, { createUniRequire } from 'uni-require'

const cp = uniRequire('node:child_process')
assert(cp)

const resolved: string = uniRequire.resolve('node:child_process')
assert(resolved)

const explicit = createUniRequire(import.meta.url)
assert(explicit('node:child_process'))
