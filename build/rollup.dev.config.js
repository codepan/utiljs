import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
export default {
  input: 'test/index.ts',
  output: {
    file: 'test/bundle.js'
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          declaration: false
        }
      }
    }),
    nodeResolve({
      extensions: ['.ts']
    })
  ]
}