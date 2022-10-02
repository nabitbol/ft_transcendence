import { render } from '@testing-library/react';

import FormValidation from './form-validation';

describe('FormValidation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< FormValidation />);
    expect(baseElement).toBeTruthy();
  });
});
