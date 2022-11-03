import { render } from '@testing-library/react';

import UserAction from './user-action';

describe('UserAction', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< UserAction />);
    expect(baseElement).toBeTruthy();
  });
});
