import assert from 'node:assert'
import u, { uniRequire } from 'uni-require'

const cp = u('child_process')
assert(cp)

const cp2 = uniRequire('child_process')
assert(cp2)
