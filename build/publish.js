#! usr/bin/env node
const commander = require('commander')
const inquirer = require('inquirer')
const shell = require('shelljs')

const versionChoices = [
  {
    name: 'prerelease',
    value: 'prerelease'
  },
  new inquirer.Separator('若没有预发布号：则增加小号，增加预发布号为0；否则则升级预发布号'),
  {
    name: 'prepatch',
    value: 'prepatch'
  },
  new inquirer.Separator('直接升级小号，增加预发布号为0'),
  {
    name: 'preminor',
    value: 'preminor'
  },
  new inquirer.Separator('直接升级中号，小号置为0，增加预发布号为0'),
  {
    name: 'premajor',
    value: 'premajor'
  },
  new inquirer.Separator('直接升级大号，中号和小号置为0，增加预发布号为0'),
  {
    name: 'patch',
    value: 'patch'
  },
  new inquirer.Separator('若没有预发布号：则直接升级小号，删除预发布号；否则删除预发布号，其它不动'),
  {
    name: 'minor',
    value: 'minor'
  },
  new inquirer.Separator('若没有预发布号，则升级一位中号，大号不动，小号置为0；若有预发布号: --若小号为0，则不升级中号，删除预发布号,--若小号不为0，删除预发布号，置小号为0，升级中号'),
  {
    name: 'major',
    value: 'major'
  },
  new inquirer.Separator('若没有预发布号，则直接升级一位大号，其它位都置为0；若有预发布号：--中号和小号都为0，则不升级大号，而将预发布号删掉。即2.0.0-1变成2.0.0，这就是预发布的作用；--如果中号和小号有任意一个不是0，那便会升级一位大号，其他位都置为0，清空预发布号。即 2.0.1-0变成3.0.0'),
  {
    name: '自定义',
    value: 'custom'
  },
]

inquirer.prompt([
  {
    type: 'list',
    name: 'version',
    message: '请选择发布版本类型',
    loop: false,
    choices: versionChoices
  },
  {
    type: 'input',
    name: 'customVersion',
    message: '请输入版本号',
    when: answers => answers.version === 'custom',
    validate: (customVersion) => {
      const regExp = /^\d+\.\d+\.\d+(-?\d+)?$/g
      return regExp.test(customVersion)
    }
  },
]).then((answers) => {
  const { version, customVersion } = answers
  const computedVersion = version === 'custom' ? customVersion : version

  shell.exec('git status', { silent: true }, (code, stdout) => {
    if (code === 0 && stdout) {
      inquirer.prompt([
        {
          type: 'confirm',
          name: 'autoCommit',
          message: 'git工作区不干净，是否帮你自动提交',
          default: true
        },
        {
          type: 'input',
          name: 'commitMessage',
          message: '请输入git提交日志',
          default: `commit some files for publish ${computedVersion} version`,
          when: ({ autoCommit }) => autoCommit
        },
      ]).then((answers) => {
        if (answers.autoCommit) {
          shell.exec(`git add . && git commit -m '${answers.commitMessage}'`)
          shell.exec(`npm version ${computedVersion}`, (code, stdout, stderr) => {
            if (code !== 0 || stderr) return
            inquirer.prompt({
              type: 'confirm',
              name: 'couldPublish',
              message: `即将执行发布动作，请再次确认相关信息：1. 版本类型：${computedVersion}；2. 版本号：${stdout}，若无误请按回车，否则输入 n 终止发布`,
              default: true,
            }).then(({ couldPublish }) => {
              if (!couldPublish) return
              shell.exec('npm publish --access public')
            })
          })
        }
      })
    }
  })
})

