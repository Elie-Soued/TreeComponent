import { SCSS_RULES_PRESET } from '@ogs-gmbh/linter';
import postcssScss from 'postcss-scss';

export default {
  plugins: ['stylelint-scss'],
  customSyntax: postcssScss,
  rules: SCSS_RULES_PRESET,
  ignoreFiles: [
    '.angular/**/*',
    '.git/**/*',
    '.husky/**/*',
    '.idea/**/*',
    'node_modules/**/*',
    'dist/**/*',
  ],
};
