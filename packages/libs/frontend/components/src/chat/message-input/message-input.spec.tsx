import { render } from '@testing-library/react';

import MessageInput from './message-input';

describe('MessageInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(< MessageInput />);
    expect(baseElement).toBeTruthy();
  });
});
