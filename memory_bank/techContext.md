# Tech Context

## Стек

- Next.js App Router.
- TypeScript.
- React.
- Three.js через React Three Fiber.
- Tailwind CSS v4.
- shadcn/ui-compatible primitives: `Button`, `Card`, `Badge`.
- `class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-slot` для UI primitives.
- Bun как пакетный менеджер.
- Biome для линтинга/форматирования кода, кроме Markdown-файлов. Для CSS включен parser option `tailwindDirectives`.

## Окружение

- Рабочая директория: `/home/jarlix/atom`.
- Git-репозиторий в текущей директории не обнаружен.
- Сервер разработки не запускать, не останавливать и не проверять статус без запроса пользователя.

## Первичная карта проекта

- `AGENTS.md` — инструкции проекта и правила Memory Bank.
- `docs/PRD.md` — product requirements для Interactive Atom & Molecule Visualizer.
- `memory_bank/` — операционный контекст агента, создан в текущей сессии.
- `components.json` — конфигурация shadcn/ui aliases и Tailwind CSS entrypoint.
- `src/components/ui/` — локальные shadcn/ui-compatible primitives.

## CI/CD

CI/CD пока не настроен. Целевой деплой по PRD: Vercel.
