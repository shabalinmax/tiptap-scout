# @shabalinmax/tiptap-scout

Расширение поиска и замены для [Tiptap 3](https://tiptap.dev/).

Существующие аналоги устарели и написаны под Tiptap 2. Этот пакет разработан для Tiptap 3 с нуля.

[README in English](./README.md)

## Возможности

- Поиск текста без учёта регистра
- Поиск корректно работает через inline-форматирование (жирный, курсив, ссылки и т.д.)
- Подсветка совпадений через ProseMirror Decorations
- Настраиваемые CSS-классы — стили не навязываются
- Состояние доступно через `editor.storage.scout`
- Полная типизация TypeScript с автокомплитом команд

## Установка

```bash
npm install @shabalinmax/tiptap-scout
```

### Peer-зависимости

```bash
npm install @tiptap/core @tiptap/pm
```

## Использование

```ts
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Scout } from '@shabalinmax/tiptap-scout'

const editor = new Editor({
  extensions: [
    StarterKit,
    Scout.configure({
      searchResultClass: 'search-highlight',
      currentResultClass: 'search-highlight-current',
    }),
  ],
})

// Поиск
editor.commands.find('привет')

// Сброс поиска
editor.commands.clearSearch()

// Доступ к состоянию
const { searchTerm, results, currentIndex } = editor.storage.scout
```

### CSS

Расширение не включает стили. Добавьте свои:

```css
.search-highlight {
  background-color: yellow;
}

.search-highlight-current {
  background-color: orange;
}
```

## Опции

| Опция | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `searchResultClass` | `string` | `'scout-result'` | CSS-класс для всех совпадений |
| `currentResultClass` | `string` | `'scout-result-current'` | CSS-класс для текущего совпадения |

## Команды

| Команда | Параметры | Описание |
| --- | --- | --- |
| `find` | `searchTerm: string` | Поиск текста (без учёта регистра) |
| `clearSearch` | — | Сброс результатов и декораций |

## Storage (`editor.storage.scout`)

| Поле | Тип | Описание |
| --- | --- | --- |
| `searchTerm` | `string` | Текущий поисковый запрос |
| `results` | `SearchResult[]` | Массив позиций `{ from, to }` |
| `currentIndex` | `number` | Индекс текущего совпадения |

## Планы

- Команды `findNext` / `findPrevious` с циклической навигацией
- Команды `replace` / `replaceAll`
- Режимы поиска: с учётом регистра, целые слова, регулярные выражения
- Автоматический пересчёт при изменении документа

## Лицензия

MIT