import assert from 'node:assert'
import uniRequire from 'uni-require'

const cp = uniRequire('node:child_process')
assert(cp)

const resolved: string = uniRequire.resolve('node:child_process')
assert(resolved)

const explicit = uniRequire.createUniRequire(__filename)
assert(explicit('node:child_process'))
