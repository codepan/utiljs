import glob from 'glob'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
// import analyze from 'rollup-plugin-analyzer'

const wholeBuildConfig = {
  input: './src/index.ts',
  output: {
    file: 'lib/index.js',
    name: 'util',
    format: 'umd'
  }
}

// 组件库批量构建配置-对按需引入组件的实现
const batchBuildConfig = {
  input: getBatchBuildInput(),
  output: {
    dir: 'lib',
    format: 'cjs',
    exports: 'auto'
  }
}

const configs = [wholeBuildConfig, batchBuildConfig].map(config => {
  return {
    ...config,
    plugins: [
      typescript({
        tsconfig: 'tsconfig.json'
      }),
      nodeResolve({
        extensions: ['.ts']
      }),
      terser(),
      // analyze()
    ]
  }
})

function getBatchBuildInput () {
  /**
  * 动态查找所有入口文件
  */
  const files = glob.sync('./src/*/index.ts')
  const entries = {}

  Array.from(files).forEach((file) => {
    const [match, name] = /.*\/(.*?\/index).ts/.exec(file)
    entries[name] = file
  })
  return entries
}

export default configs