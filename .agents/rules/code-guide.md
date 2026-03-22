---
trigger: always_on
---

## Code Guide

### Tech Stack:

pnpm 19,
Next 16,
Tailwind CSS 4,
ShadCN,
Drizzle
tanstack/react-query
axios
react-hook-formm
zod 3

### Folder structure:

- app: pages, layout
- app/<path>/components: page components (layout, smart component, a component that used once in the page only)
- app/<path>/forms: zod schema for forms used in the page
- components/ui: UI components, dumb components
- components/<something>: dumb molecule component
- config: config, constant
- lib: helpers, utils
- hooks: global hooks
- hooks/<entity>/use... hooks to call api
- generated: prisma generated types
- db: drizzle config

Always use this folder for **every file** you will create

### Guide Backend

- Common flow backend: Create schema using zod in frontend (app/<feature>/forms) -> then create route in /api -> Validate the boody, params -> access DB -> parse the resposne using 'lib/response-helper'
- Always response using 'lib/response-helper'

### Guide Frontend

- Common flow: Create hook to call endpoint api in `hooks/<entity>/use...` (if required) -> create dumb component in `components/ui` if required -> create smart component in `app/<path-name>/components/<feature-name>.tsx` and intergate API (if required) -> export feature in `app/<path-name>/page.tsx` page.tsx
- For every command I make, search src/services and src/components/features first if exisit, use it.
- Always install package using pnpm, or pnpm dlx
- Always use lucide-react icon if possible
- Always use export NON-default react component
- Always use ShadCN component. If not exisit, install it by `pnpm dlx shadn@latest add ...`
- Always use axios and react-query when fetching data and create a function in "web/services/"
- Always use react-hook-form when handle form
- Always use tailwind class for style if possible. And use class (color) provided in `css/global.css`
- Always use Indonesian language when create UI
- Use explicit path. Example: /products/[productId], Wrong: /products/[id]
- Configure all route in `config/routes.config`
