/**
 * Code generators: `npm run generate`
 *
 * - feature:   a complete, registered feature module (routes, nav, i18n,
 *              model, API, page, mock endpoint and test). Ready to run.
 * - component: a component (+ test) in a feature or in shared/components.
 *
 * @param {import('plop').NodePlopAPI} plop
 */
export default function (plop) {
  const feature = 'src/features/{{kebabCase name}}';

  plop.setGenerator('feature', {
    description: 'Create and register a new feature module',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Feature name (plural, kebab-case, e.g. "projects"):',
        validate: (v) => (/^[a-z][a-z0-9-]*$/.test(v) ? true : 'Use kebab-case, e.g. "projects"'),
      },
    ],
    actions: [
      // 1. The module itself
      { type: 'add', path: `${feature}/index.ts`, templateFile: 'generators/feature/index.ts.hbs' },
      {
        type: 'add',
        path: `${feature}/i18n/en.json`,
        templateFile: 'generators/feature/en.json.hbs',
      },
      {
        type: 'add',
        path: `${feature}/i18n/es.json`,
        templateFile: 'generators/feature/es.json.hbs',
      },
      {
        type: 'add',
        path: `${feature}/model/{{kebabCase name}}.ts`,
        templateFile: 'generators/feature/model.ts.hbs',
      },
      {
        type: 'add',
        path: `${feature}/api/{{kebabCase name}}.ts`,
        templateFile: 'generators/feature/api.ts.hbs',
      },
      {
        type: 'add',
        path: `${feature}/pages/{{kebabCase name}}-page.tsx`,
        templateFile: 'generators/feature/page.tsx.hbs',
      },
      {
        type: 'add',
        path: `${feature}/__tests__/{{kebabCase name}}.test.tsx`,
        templateFile: 'generators/feature/test.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/mocks/handlers/{{kebabCase name}}.ts',
        templateFile: 'generators/feature/handlers.ts.hbs',
      },

      // 2. Wiring (each is a one-line change in a file made for it)
      {
        type: 'modify',
        path: 'src/core/config/routes.ts',
        pattern: /(\n} as const;)/,
        template: "\n  {{camelCase name}}: defineRoute('/app/{{kebabCase name}}'),$1",
      },
      {
        type: 'modify',
        path: 'src/app/modules.ts',
        pattern: /(\n\n\/\*\*)/,
        template: "\nimport {{camelCase name}} from '@/features/{{kebabCase name}}';$1",
      },
      {
        type: 'modify',
        path: 'src/app/modules.ts',
        pattern: /(export const modules: FeatureModule\[\] = \[[^\]]*)\]/,
        template: '$1, {{camelCase name}}]',
      },
      {
        type: 'modify',
        path: 'src/app/i18n-resources.d.ts',
        pattern: /(\n\n\/\*\*)/,
        template:
          "\nimport type {{camelCase name}} from '@/features/{{kebabCase name}}/i18n/en.json';$1",
      },
      {
        type: 'modify',
        path: 'src/app/i18n-resources.d.ts',
        pattern: /(\n    };\n  }\n})/,
        template: '\n      {{camelCase name}}: typeof {{camelCase name}};$1',
      },
      {
        type: 'modify',
        path: 'src/mocks/handlers/index.ts',
        pattern: /(\n\nexport const handlers = \[)/,
        template: "\nimport { {{camelCase name}}Handlers } from './{{kebabCase name}}';$1",
      },
      {
        type: 'modify',
        path: 'src/mocks/handlers/index.ts',
        pattern: /(export const handlers = \[\n)/,
        template: '$1  ...{{camelCase name}}Handlers,\n',
      },
      () =>
        'Done. Run "npm run lint:fix && npm run format", then open the new page. See docs/adding-a-feature.md.',
    ],
  });

  plop.setGenerator('component', {
    description: 'Create a component (+ test)',
    prompts: [
      { type: 'input', name: 'name', message: 'Component name (e.g. "user-card"):' },
      {
        type: 'input',
        name: 'folder',
        message: 'Feature name (e.g. "tasks"), or "shared" for src/shared/components:',
      },
    ],
    actions: (data) => {
      const base =
        data?.folder === 'shared'
          ? 'src/shared/components'
          : `src/features/${data?.folder}/components`;
      return [
        {
          type: 'add',
          path: `${base}/{{kebabCase name}}.tsx`,
          templateFile: 'generators/component/component.tsx.hbs',
        },
        {
          type: 'add',
          path: `${base}/__tests__/{{kebabCase name}}.test.tsx`,
          templateFile: 'generators/component/component.test.tsx.hbs',
        },
      ];
    },
  });
}
