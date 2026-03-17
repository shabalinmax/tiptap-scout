# @shabalinmax/tiptap-scout

Расширение поиска и замены для [Tiptap 3](https://tiptap.dev/).

Существующие аналоги устарели и написаны под Tiptap 2. Этот пакет разработан для Tiptap 3 с нуля.

[Live Demo](https://shabalinmax.github.io/tiptap-scout/) | [GitHub](https://github.com/shabalinmax/tiptap-scout) | [README in English](./README.md)

## Возможности

- Поиск текста с опциональным учётом регистра
- Сохранение регистра при замене (например, «Привет» → «Мир», «привет» → «мир»)
- Поиск корректно работает через inline-форматирование (жирный, курсив, ссылки и т.д.)
- Подсветка совпадений через ProseMirror Decorations
- `findNext` / `findPrevious` с циклической навигацией
- `replace` / `replaceAll` с корректным undo/redo
- Опциональный scroll к текущему совпадению
- Live update — автоматический пересчёт поиска при изменении документа
- Счётчик "N из M" через `editor.storage.scout`
- Настраиваемые CSS-классы — стили не навязываются
- React hook `useScout` для реактивного состояния
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
      scrollIntoView: true,
      liveUpdate: true,
    }),
  ],
})

// Поиск
editor.commands.find('привет')

// Навигация между совпадениями
editor.commands.findNext()
editor.commands.findPrevious()

// Замена
editor.commands.replace('мир')
editor.commands.replaceAll('мир')

// Сброс поиска
editor.commands.clearSearch()

// Доступ к состоянию (например, для отображения "2 из 5")
const { searchTerm, results, currentIndex } = editor.storage.scout
console.log(`${currentIndex + 1} из ${results.length}`)
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

## React

```tsx
import { useState } from 'react'
import { Scout } from '@shabalinmax/tiptap-scout'
import { useScout } from '@shabalinmax/tiptap-scout/react'

function SearchBar({ editor }) {
  const [replaceValue, setReplaceValue] = useState('')
  const {
    searchTerm,
    currentIndex,
    totalCount,
    find,
    findNext,
    findPrevious,
    replace,
    replaceAll,
    clearSearch,
  } = useScout(editor)

  return (
    <div>
      <input value={searchTerm} onChange={(e) => find(e.target.value)} />
      <span>{totalCount > 0 ? `${currentIndex + 1} из ${totalCount}` : 'Нет результатов'}</span>
      <button onClick={findPrevious}>Назад</button>
      <button onClick={findNext}>Далее</button>
      <input value={replaceValue} onChange={(e) => setReplaceValue(e.target.value)} />
      <button onClick={() => replace(replaceValue)}>Заменить</button>
      <button onClick={() => replaceAll(replaceValue)}>Заменить все</button>
      <button onClick={clearSearch}>Сбросить</button>
    </div>
  )
}
```

React — опциональная peer-зависимость, не требуется для проектов без React.

## Опции

| Опция | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `searchResultClass` | `string` | `'scout-result'` | CSS-класс для всех совпадений |
| `currentResultClass` | `string` | `'scout-result-current'` | CSS-класс для текущего совпадения |
| `scrollIntoView` | `boolean` | `false` | Прокрутка к текущему совпадению при навигации |
| `liveUpdate` | `boolean` | `false` | Автоматический пересчёт поиска при изменении документа |

## Команды

| Команда | Параметры | Описание |
| --- | --- | --- |
| `find` | `searchTerm: string` | Поиск текста |
| `findNext` | — | Перейти к следующему совпадению (циклически) |
| `findPrevious` | — | Перейти к предыдущему совпадению (циклически) |
| `replace` | `replaceWith: string` | Заменить текущее совпадение |
| `replaceAll` | `replaceWith: string` | Заменить все совпадения (один шаг undo) |
| `setCaseSensitive` | `value: boolean` | Включить/выключить учёт регистра при поиске |
| `setPreserveCase` | `value: boolean` | Включить/выключить сохранение регистра при замене |
| `clearSearch` | — | Сброс результатов и декораций |

## Storage (`editor.storage.scout`)

| Поле | Тип | Описание |
| --- | --- | --- |
| `searchTerm` | `string` | Текущий поисковый запрос |
| `results` | `SearchResult[]` | Массив позиций `{ from, to }` |
| `currentIndex` | `number` | Индекс текущего совпадения (с нуля) |
| `caseSensitive` | `boolean` | Учитывать ли регистр при поиске |
| `preserveCase` | `boolean` | Сохранять ли регистр при замене |

## Планы

- Режимы поиска: целые слова, регулярные выражения
- Capture groups ($1, $2) в строке замены
- Поиск/замена внутри выделения

## Лицензия

MIT