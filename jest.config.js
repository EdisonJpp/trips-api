module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest'
  },
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.ts?$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
}
