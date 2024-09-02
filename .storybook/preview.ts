import type { Preview } from "@storybook/react";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import '../src/style/index.scss'

library.add(fas)

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewMode: 'docs',
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Welcome', 'Button', 'Menu', 'Input', 'AutoComplete', 'Upload'], 
      },
  },
  },
};

export default preview;
