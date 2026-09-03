const { createRequire } = require('node:module')

// The CJS half of `uniRequire`. It mirrors `index.js` rather than sharing a module with
// it: an ESM entry cannot `require()` a file, and a CJS entry cannot `import` one, so a
// shared implementation would have to pick a format and break the other half of the dual
// package this library exists to serve. See `index.js` for the commented version.
const requires = new Map()

function requireFor(location) {
  let value = requires.get(location)
  if (!value) {
    value = createRequire(location)
    requires.set(location, value)
  }
  return value
}

function callerRequire(boundary) {
  const restore = Error.prepareStackTrace
  Error.prepareStackTrace = (_, callSites) => callSites
  const holder = {}
  Error.captureStackTrace(holder, boundary)
  const callSites = holder.stack
  Error.prepareStackTrace = restore

  for (const callSite of callSites) {
    const fileName = callSite.getFileName()
    if (fileName && !fileName.startsWith('node:')) return requireFor(fileName)
  }
  return requireFor(__filename)
}

function uniRequire(id) {
  return callerRequire(uniRequire)(id)
}

function resolve(id, options) {
  return callerRequire(resolve).resolve(id, options)
}

function paths(id) {
  return callerRequire(paths).resolve.paths(id)
}

resolve.paths = paths
uniRequire.resolve = resolve

Object.defineProperties(uniRequire, {
  cache: { enumerable: true, get: () => requireFor(__filename).cache },
  extensions: { enumerable: true, get: () => requireFor(__filename).extensions },
  main: { enumerable: true, get: () => requireFor(__filename).main }
})

function createUniRequire(location) {
  return createRequire(location)
}

module.exports = uniRequire
module.exports.uniRequire = uniRequire
module.exports.createUniRequire = createUniRequire
