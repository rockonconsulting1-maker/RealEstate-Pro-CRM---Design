# Agent Guidelines for RC CRM

This file provides instructions for AI agents and developers working on the RC CRM codebase.

## Component Architecture & Global Scope

The project uses a unique pattern for component sharing and navigation, tailored for a prototype environment without a complex build system:

- **Global Registry**: Components are often registered on `window.RC` or `window`.
  - Example: `window.RC.Dashboard = Dashboard;`
  - Example: `const { Avatar } = window.RC;`
- **Inter-Surface Communication**: The Desktop entry point (`RC CRM Desktop.html`) often loads mobile data (`mobile/data.jsx`) to share mock records and icons.
- **Navigation**: Navigation is typically handled by a `goto` function passed down from the root `App` component.
- **Icons**: Icons are managed via a central registry (`window.Icon`) and should be referenced by name.

## Coding Conventions

Refer to `design.md` for the full specification. Key points:

- **Naming**: Use camelCase for variables/functions and PascalCase for components.
- **Styling**: Inline styles are heavily used in JSX for layout and specific overrides, while `styles.css` (in both `desktop/` and `mobile/`) handles tokens and base component styles.
- **Colors**: Use the OKLCH color space (`oklch(...)`) as defined in the CSS variables.
- **Copy**: Follow the voice and copy guidelines in `design.md §9`. Use sentence case for titles and ALL CAPS for eyebrows.

## Working with Screens

### Adding a Desktop Screen
1.  Define the component in `desktop/screens.jsx`, `desktop/screens2.jsx`, etc.
2.  Register the component on `window.RC`.
3.  Add the route/view logic in `desktop/app.jsx`.

### Adding a Mobile Screen
1.  Create a new file `mobile/screen-[name].jsx`.
2.  Define the component and register it on `window`.
3.  Add the screen to the `SCREEN_GROUPS` and routing logic in `mobile/app.jsx`.

## Modals & Sheets
- **Desktop**: Modals are defined in `desktop/modals.jsx` and triggered via `window.RC.openModal(type)`.
- **Mobile**: Sheets are managed via the `sheet` state in `mobile/app.jsx`.

## Testing
- This is a prototype; there are no automated tests.
- **Verification**: Always verify changes by checking the rendered output in both Desktop and Mobile HTML files. Ensure that "Tweaks" and "Jump to" menus remain functional.
