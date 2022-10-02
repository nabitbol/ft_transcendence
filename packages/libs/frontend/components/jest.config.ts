/* eslint-disable */
export default {
  displayName: 'libs-frontend-components',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/packages/libs/frontend/components'
};
