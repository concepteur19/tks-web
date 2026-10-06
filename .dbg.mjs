import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
const logs = [];
p.on('pageerror', (e) => logs.push('PAGEERROR ' + e.message));
p.on('console', (m) => logs.push(m.type() + ' ' + m.text()));
await p.goto('http://localhost:4400/experiences/excursion-en-pirogue');
await p.getByTestId('request-bar').getByTestId('add-to-stay').click();
console.log('stored:', await p.evaluate(() => localStorage.getItem('kibreeze.selection.v1')));
await p.goto('http://localhost:4400/sejour');
await p.waitForTimeout(2000);
console.log(
  'islands:',
  await p.evaluate(() =>
    [...document.querySelectorAll('astro-island')]
      .map((i) => i.getAttribute('component-url') + ' ssr=' + i.hasAttribute('ssr'))
      .join('\n'),
  ),
);
console.log('main:', (await p.locator('main').innerText()).slice(0, 300));
console.log(logs.join('\n'));
await b.close();
