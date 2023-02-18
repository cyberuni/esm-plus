const assert = require('assert');
const uniRequire = require('uni-require')

const cp = uniRequire('child_process')
assert(cp)

const cp2 = uniRequire.uniRequire('child_process')
assert(cp2)
