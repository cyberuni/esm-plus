# uni-require

A `require()` function that works on both CJS and ESM.

There are [differences] between CJS and ESM.

When you want to create a package with dual package support,
you need a way to import module that works on both CJS and ESM.

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

CommonJS:

```ts
const uniRequire = require('uni-require')

const chalk = uniRequire('chalk')
```

ESM:

```ts
import uniRequire from 'uni-require'

const chalk = uniRequire('chalk')
```

[differences]: https://nodejs.org/api/esm.html#differences-between-es-modules-and-commonjs
