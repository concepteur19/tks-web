import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    // Constitution, principe III : les règles métier de src/features sont couvertes à 100 %.
    coverage: {
      provider: 'v8',
      include: ['src/features/**/*.ts'],
      reporter: ['text-summary'],
      thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'component',
          include: ['tests/component/**/*.test.ts'],
          environment: 'jsdom',
          setupFiles: ['tests/setup/jsdom.ts'],
        },
      },
    ],
  },
});
