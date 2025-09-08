import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './build/swagger.json',
  output: '../parelpracht-client/src/clients/generated-client-new',
  plugins: [
    '@hey-api/client-fetch',
    '@hey-api/schemas',
    '@hey-api/sdk',
    '@tanstack/react-query',
    {
      enums: 'typescript',
      name: '@hey-api/typescript',
    },
  ],
});
