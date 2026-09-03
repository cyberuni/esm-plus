///<reference types="node" />

declare const uniRequire: NodeJS.Require & {
  uniRequire: NodeJS.Require
  /**
   * Create a `require` bound to an explicit location, for call sites `uniRequire()` cannot
   * recover on its own — bundled or transpiled code where the stack no longer names a file.
   *
   * Pass `import.meta.url` from ESM, `__filename` from CJS.
   */
  createUniRequire(location: string | URL): NodeJS.Require
}

export = uniRequire
