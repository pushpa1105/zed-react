import { commonTranslations } from '@/core/i18n/i18n';
import { LANGUAGES } from '@/core/i18n/languages';

import { modules } from '../modules';
import { validateModules } from '../registry';

/** Flattens a translation tree into dotted keys: { a: { b: 'x' } } → ['a.b']. */
function keysOf(tree: object, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? keysOf(value as object, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

describe('module registry', () => {
  it('has no duplicate ids, clashing paths or dead links', () => {
    expect(validateModules(modules)).toEqual([]);
  });

  it('catches mistakes in a broken registry', () => {
    const broken = [
      { id: 'a', nav: [{ to: '/nowhere', icon: () => null, label: () => '' }] },
      { id: 'a' },
    ] as unknown as Parameters<typeof validateModules>[0];

    expect(validateModules(broken)).toEqual([
      'Duplicate module id "a"',
      'Link "/nowhere" does not match any route',
    ]);
  });
});

describe('translations', () => {
  const namespaces = {
    common: commonTranslations,
    ...Object.fromEntries(modules.filter((m) => m.i18n).map((m) => [m.id, m.i18n!])),
  } as Record<string, Partial<Record<string, object>>>;

  for (const [namespace, bundles] of Object.entries(namespaces)) {
    const reference = keysOf(bundles.en!).sort();

    for (const { code } of LANGUAGES.filter((l) => l.code !== 'en')) {
      it(`"${namespace}" has the same keys in "${code}" as in "en"`, () => {
        expect(bundles[code], `missing ${code} translations`).toBeDefined();
        expect(keysOf(bundles[code]!).sort()).toEqual(reference);
      });
    }
  }
});
