import Joi from 'joi';

const extensions: Joi.Extension[] = [
    {
        type: 'object',
        base: Joi.object(),
        coerce: {
            from: 'string',
            method(value) {
                if (typeof value !== 'string' || value[0] !== '{' && !/^\s*\{/.test(value)) {
                    return;
                }

                try {
                    return { value: JSON.parse(value) };
                }
                catch (ignoreErr) { }
            }
        }
    },
    {
        type: 'array',
        base: Joi.array(),
        coerce: {
            from: 'string',
            method(value) {
                if (typeof value !== 'string' || value[0] !== '[' && !/^\s*\[/.test(value)) {
                    return;
                }

                try {
                    return { value: JSON.parse(value) };
                }
                catch (ignoreErr) { }
            }
        }
    }
];

export default Joi.extend(...extensions) as Joi.Root;
