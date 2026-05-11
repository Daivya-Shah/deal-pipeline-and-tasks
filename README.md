# Deal Pipeline

A React prototype of a Kanban-style deal pipeline board built for real estate workflows. It lets you track deals across stages, manage contacts and activity tasks, and customize the board layout without ever leaving the page.

## What it does

The board ships with four default columns: **Lead**, **Pitching**, **Touring**, and **Closed**. Each column holds deal cards that capture the key details you care about:

- Deal title, value, and square footage
- Category (Commercial, Residential, Industrial, etc.)
- Contact name and last-touched timestamp
- An activity task with a due date

You can drag cards between columns to move deals through the pipeline, and drag cards within a column to reprioritize them. A "Show Card Icons" toggle on the main page reveals phone, email, and notes action icons on each card, along with the deal description.

The **Table Settings** sidebar (accessible from the board toolbar) lets you:

- Toggle individual columns on or off
- Rename columns
- Delete columns you no longer need
- Drag columns to reorder them
- Add new custom columns
- Reset everything back to the defaults

Adding or editing a deal opens a right-side drawer with a form for all deal fields. Deleting a card or column triggers a confirmation dialog before anything is removed.

## Tech stack

| Layer | Libraries |
|---|---|
| Framework | React 18, TypeScript |
| Build | Vite |
| Styling | Tailwind CSS, shadcn/ui, Radix UI |
| Drag and drop | @dnd-kit/core, @dnd-kit/sortable |
| Sidebar panels | PrimeReact |
| Icons | Lucide React |
| Routing | React Router DOM v6 |
| Data fetching | TanStack Query |

## Getting started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Or with Bun:

```bash
bun install
bun dev
```

Open `http://localhost:5173` in your browser.

## Project structure

```
src/
  components/
    DealPipeline.tsx          # Main Kanban board, column and card logic
    TableSettingsSidebar.tsx  # Column management panel
    DeleteConfirmationDialog.tsx
    ui/                       # shadcn/ui components
  pages/
    Index.tsx                 # Root page, renders DealPipeline
    NotFound.tsx
  App.tsx                     # Router and global providers
```

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the local dev server |
| `npm run build` | Builds for production |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint |
