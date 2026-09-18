import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = [
  { path: '/', name: 'accueil français' },
  { path: '/en/', name: 'accueil anglais' },
  { path: '/cette-page-nexiste-pas', name: "page d'erreur française" },
];

for (const page of pages) {
  test(`${page.name} : aucune violation d'accessibilité`, async ({ page: browserPage }) => {
    await browserPage.goto(page.path);
    const results = await new AxeBuilder({ page: browserPage })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    // On rapporte la règle et l'élément fautif, pour que l'échec soit exploitable.
    const failures = results.violations.flatMap((violation) =>
      violation.nodes.map((node) => `${violation.id} → ${node.target.join(' ')}`),
    );
    expect(failures).toEqual([]);
  });
}
