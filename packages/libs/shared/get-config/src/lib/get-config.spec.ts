import { getConfig } from './get-config';

describe('getConfig', () => {
    it('should work', () => {
        expect(getConfig()).toEqual('get-config');
    })
})