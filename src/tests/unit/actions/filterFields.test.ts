import { filterDataAction } from '../../../worker/actions/filterData.action';
import { describe, it, expect } from 'vitest';

describe('filterDataAction', () => {

    it('should keep only the specified fields', async () => {
        const payload = {
            name: 'Ali',
            email: 'ali@test.com',
            password: 'secret',
            id: 'xyz',
        };
        const config = { dataToKeep: ['name', 'email'] };

        const result = await filterDataAction(payload, config);

        expect(result).toEqual({ name: 'Ali', email: 'ali@test.com' });
    });

    it('should return empty object if no fields match', async () => {
        const payload = { name: 'Ali', email: 'ali@test.com' };
        const config = { dataToKeep: ['phone'] };

        const result = await filterDataAction(payload, config);

        expect(result).toEqual({});
    });

    it('should throw if dataToKeep array is missing', async () => {
        await expect(
            filterDataAction({ name: 'Ali' }, {} as any)
        ).rejects.toThrow('Invalid configuration: dataToKeep must be an array of strings');
    });

});