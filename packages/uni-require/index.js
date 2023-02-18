import { createRequire } from 'node:module'
const uniRequire = createRequire(import.meta.url)

export { uniRequire }
export default uniRequire
