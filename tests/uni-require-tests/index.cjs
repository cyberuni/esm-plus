// Smoke test for the CJS entry, run by plain `node`.
const assert = require('node:assert')
const path = require('node:path')
const uniRequire = require('uni-require')

const here = path.join(__dirname, 'package.json')

assert(uniRequire('node:child_process'))
assert(uniRequire.uniRequire('node:child_process'))

// Regression: the require must be bound to THIS file, not to uni-require's own module.
assert.equal(uniRequire.resolve('./package.json'), here)
assert.equal(uniRequire('./package.json').name, 'uni-require-tests')
assert.equal(uniRequire.createUniRequire(__filename).resolve('./package.json'), here)
