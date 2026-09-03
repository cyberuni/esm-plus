---
'uni-require': minor
---

Resolve from the calling file instead of from `uni-require` itself.

`uniRequire` was built with `createRequire(import.meta.url)` in the ESM entry, and exported
the module's own `require` in the CJS entry. Both bind the require to `uni-require`'s
directory, so every consumer got the same answer regardless of where it called from:
`uniRequire('./package.json')` read *uni-require's* manifest, and `uniRequire.resolve()`
searched *uni-require's* `node_modules`. A CLI reading its own version this way reported
`uni-require`'s version instead of its own.

The require is now bound to the file that called it, which is what the README has always
described and what a built-in `require()` does. Builtins resolve identically either way, so
nothing that worked before stops working.

Also adds `createUniRequire(location)`, for call sites where the stack no longer names a
file — bundled or transpiled code. Pass `import.meta.url` from ESM, `__filename` from CJS.

The `exports` map now carries per-condition `types`, so a CommonJS consumer gets
`index.d.cts` (the `export =` shape it actually loads) rather than the ESM declarations.
