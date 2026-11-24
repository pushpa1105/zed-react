/** Runs on staged files before every commit (via Husky). */
export default {
  '*.{ts,tsx,js}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,css,html,yml,yaml}': ['prettier --write'],
};
