import { render } from '@testing-library/react';

import NotFund from './not-fund';

describe('NotFund', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< NotFund />);
    expect(baseElement).toBeTruthy();
  });
});
