import { render } from '@testing-library/react';

import Achievement from './achievement';

describe('Achievement', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< Achievement />);
    expect(baseElement).toBeTruthy();
  });
});
