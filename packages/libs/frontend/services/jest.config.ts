/* eslint-disable */
export default {
  displayName: 'libs-frontend-services',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/packages/libs/frontend/services'
};
