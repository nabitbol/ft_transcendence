import { render } from '@testing-library/react';

import AuthHeader from './auth-header';

describe('AuthHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< AuthHeader />);
    expect(baseElement).toBeTruthy();
  });
});
