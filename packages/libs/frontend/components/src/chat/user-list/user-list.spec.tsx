import { render } from '@testing-library/react';

import UserList from './user-list';

describe('UserList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< UserList />);
    expect(baseElement).toBeTruthy();
  });
});
