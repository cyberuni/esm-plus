# uni-require

> [!WARNING]
> **Deprecated. Do not use this package.**
>
> `uniRequire.resolve()` — the capability this package exists to provide — has
> never worked as documented. Both entry points bind `require` to *uni-require's*
> own module scope rather than the caller's:
>
> ```js
> // index.js
> const uniRequire = createRequire(import.meta.url)  // uni-require's URL, not yours
>
> // index.cjs
> const uniRequire = require                          // uni-require's require, not yours
> ```
>
> So `uniRequire.resolve('./x')` resolves relative to `uni-require`, not to your
> module. This is not fixable while keeping the API: an ES module cannot discover
> its caller's URL.
>
> ### Use Node's own `createRequire` instead
>
> ```js
> import { createRequire } from 'node:module'
> const require = createRequire(import.meta.url)      // your URL — correct
> ```
>
> Available since Node 12. It is one line, it is in the standard library, and it
> resolves from the right place.
>
> The dual-packaging problem described below is also largely moot now: Node 22.12
> and later support `require()` of an ES module directly.


The `require()` function is not available for ESM package.

But there are situation you need to use it,
for example the `require.resolve()` function.

While you can get back the functionality using `import.meta`,
you will run into problems if you want to do dual packaging.

This library helps you in that regards by providing a uniform (thus `uni-*`) interface for it.

## Install

```sh
# npm
npm install uni-require

# yarn
yarn add uni-require

# pnpm
pnpm add uni-require

# rush
rush add -p uni-require
```

## Usage

The `uniRequire()` function is a ponyfill of the `require()` function.

As such, it can be used to import CJS package,
but cannot be used to import ESM package.

Most of the time, you should use `import` to import both CJS and ESM package.

The main benefits provided by `uniRequire()` is the `uniRequire.resolve()`.

CommonJS:

```ts
const uniRequire = require('uni-require')

// it can be used to load CommonJS package
const child_process = uniRequire('child_process')

// it can be used to resolve (but not load) ESM package
const chalkPath = uniRequire.resolve('chalk')
```

ESM:

```ts
import uniRequire from 'uni-require'

// it can be used to load CommonJS package
const child_process = uniRequire('child_process')

// it can be used to resolve (but not load) ESM package
const chalkPath = uniRequire.resolve('chalk')
```
