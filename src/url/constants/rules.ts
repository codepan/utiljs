/**
 * 添加查询参数时的规则
 * keep：保持原样，即放弃本次重复添加的参数，保持原有的参数
 * repeat：允许重复添加，全部保留住
 * replace：替换，新值替换掉旧值
 */
export const RULES = {
  KEEP: 'keep',
  REPEAT: 'repeat',
  REPLACE: 'replace',
}
