import { render } from '@testing-library/react';

import ActivateUserAction from './activate-user-action';

describe('ActivateUserAction', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< ActivateUserAction />);
    expect(baseElement).toBeTruthy();
  });
});
