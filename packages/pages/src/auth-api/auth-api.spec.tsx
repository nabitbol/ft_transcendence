import { render } from '@testing-library/react';

import AuthApi from './auth-api';

describe('AuthApi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< AuthApi />);
    expect(baseElement).toBeTruthy();
  });
});
