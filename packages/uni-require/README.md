# uni-require

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
