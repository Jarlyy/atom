# ElementSelector

## Назначение

`ElementSelector` отображает компактную сетку элементов H-Ca и обновляет выбранный элемент.

## Файл

- `src/components/ElementSelector.tsx`

## Поведение

- Выбранный элемент подсвечивается классом `active`.
- Кнопки элементов построены на shadcn/ui-compatible `Button` с `variant="outline"`.
- Каждый элемент отображает символ и атомный номер.
- Выбор передается наверх через `onSelect`.
