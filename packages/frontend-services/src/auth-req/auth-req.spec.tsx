import { render } from '@testing-library/react';

import AuthReq from './auth-req';

describe('AuthReq', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< AuthReq />);
    expect(baseElement).toBeTruthy();
  });
});
