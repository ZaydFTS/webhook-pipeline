import { describe, it, expect } from 'vitest';
import { jsonXmlConvertAction } from '../../../worker/actions/jsonXml.action';

describe('jsonXmlConvertAction', () => {
    it('should convert payload to XML under default output field', async () => {
        const payload = {
            name: 'Ali & Co',
            age: 27,
            active: true,
        };

        const result = await jsonXmlConvertAction(payload, {});

        expect(result).toEqual({
            xml: '<?xml version="1.0" encoding="UTF-8"?><root><name>Ali &amp; Co</name><age>27</age><active>true</active></root>',
        });
    });

    it('should support custom root and output field with nested values', async () => {
        const payload = {
            user: {
                id: 7,
                roles: ['admin', 'editor'],
            },
            metadata: null,
        };

        const result = await jsonXmlConvertAction(payload, {
            rootName: 'event',
            outputField: 'xmlPayload',
        });

        expect(result).toEqual({
            xmlPayload: '<?xml version="1.0" encoding="UTF-8"?><event><user><id>7</id><roles>admin</roles><roles>editor</roles></user><metadata /></event>',
        });
    });
});
