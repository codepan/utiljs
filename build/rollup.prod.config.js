import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    name: 'util',
    format: 'umd'
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json'
    }),
    nodeResolve({
      extensions: ['.ts']
    })
  ]
}