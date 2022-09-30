import { render } from '@testing-library/react';

import FirendRequest from './firend-request';

describe('FirendRequest', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< FirendRequest />);
    expect(baseElement).toBeTruthy();
  });
});
