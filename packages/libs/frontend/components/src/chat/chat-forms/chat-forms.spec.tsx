import { render } from '@testing-library/react';

import ChatForms from './chat-forms';

describe('ChatForms', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< ChatForms />);
    expect(baseElement).toBeTruthy();
  });
});
