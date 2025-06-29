import { eslintConfig as common } from '@gewis/eslint-config-typescript';
import { eslintConfig as react } from '@gewis/eslint-config-react';
import { eslintConfig as prettier } from '@gewis/prettier-config';

export default [...common, ...react, prettier, {
  ignores: [
    // Redux stores are deprecated in ParelPracht and contain _a lot_ of errors.
    // Fixing them is not worth the effort, so let's ignore the complete directory for now.
    './src/stores/**',
  ],
}];
