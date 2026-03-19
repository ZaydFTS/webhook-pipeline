import { describe, it, expect } from 'vitest';
import { transformFormatAction } from '../../../worker/actions/transformFormat.action';
//this is comment to test the commit functionality of git
describe('transformFormatAction', () => {

    it('should rename keys based on mapping', async () => {
        const payload = { name: 'Ali', email: 'ali@test.com' };
        const config = {
            fieldMappings: {
                full_name: 'name',
                contact: 'email',
            },
        };

        const result = await transformFormatAction(payload, config);

        expect(result).toEqual({ full_name: 'Ali', contact: 'ali@test.com' });
    });

    it('should skip keys that do not exist in payload', async () => {
        const payload = { name: 'Ali' };
        const config = {
            fieldMappings: {
                full_name: 'name',
                contact: 'email',   // email does not exist in payload
            },
        };

        const result = await transformFormatAction(payload, config);

        expect(result).toEqual({ full_name: 'Ali' });
    });

    it('should throw if fieldMappings is missing', async () => {
        await expect(
            transformFormatAction({ name: 'Ali' }, {} as any)
        ).rejects.toThrow('Invalid configuration: fieldMappings must be an object with key-value pairs');
    });

});