import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['ts/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      // `index.cjs` is the CommonJS half of the same implementation. It is exercised by
      // `tests/uni-require-tests/index.cjs` under plain `node`, which is the only way to
      // load it the way a consumer does, so it is not measured here.
      include: ['index.js'],
      reporter: ['text', 'lcov'],
      // Set to what the suite already achieves, so a regression fails the build instead
      // of quietly reporting a lower number.
      thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 }
    }
  }
})
