import { createRequire } from 'node:module'

/**
 * `createRequire()` results, keyed by the location they were created from.
 *
 * Node caches module lookups per require instance, so reusing one per caller file keeps
 * `uniRequire()` as cheap as a plain `require()` after the first call from that file.
 */
const requires = new Map()

function requireFor(location) {
  let value = requires.get(location)
  if (!value) {
    value = createRequire(location)
    requires.set(location, value)
  }
  return value
}

/**
 * Build a `require` bound to the file that called `boundary`.
 *
 * A `require` is only meaningful relative to the file it belongs to: `require('./x')` and
 * `require.resolve('some-package')` both answer "from where?". Binding it to this module's
 * own location — which is what `createRequire(import.meta.url)` does — answers with
 * `uni-require`'s directory for every consumer, so `uniRequire.resolve('./package.json')`
 * returned `uni-require`'s manifest instead of the caller's.
 *
 * V8 has no API for "who called me", so the call site is read off a captured stack.
 * `captureStackTrace` drops `boundary` and everything above it, leaving the consumer's
 * frame on top.
 */
function callerRequire(boundary) {
  const restore = Error.prepareStackTrace
  Error.prepareStackTrace = (_, callSites) => callSites
  const holder = {}
  Error.captureStackTrace(holder, boundary)
  const callSites = holder.stack
  Error.prepareStackTrace = restore

  for (const callSite of callSites) {
    const fileName = callSite.getFileName()
    // Skip Node's own internals, which surface as `node:internal/...`.
    if (fileName && !fileName.startsWith('node:')) return requireFor(fileName)
  }
  // No usable frame (an eval'd or fully inlined caller). Falling back to this module keeps
  // builtins working; use `createUniRequire()` when the call site cannot be recovered.
  return requireFor(import.meta.url)
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

// `cache`, `extensions` and `main` are process-wide rather than per-caller, so which
// `require` they are read through does not matter.
Object.defineProperties(uniRequire, {
  cache: { enumerable: true, get: () => requireFor(import.meta.url).cache },
  extensions: { enumerable: true, get: () => requireFor(import.meta.url).extensions },
  main: { enumerable: true, get: () => requireFor(import.meta.url).main }
})

/**
 * Create a `require` bound to an explicit location, for call sites `uniRequire()` cannot
 * recover on its own — bundled or transpiled code where the stack no longer names a file.
 *
 * Pass `import.meta.url` from ESM, `__filename` from CJS.
 */
function createUniRequire(location) {
  return createRequire(location)
}

export { createUniRequire, uniRequire }
export default uniRequire
