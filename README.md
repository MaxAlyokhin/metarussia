# Конституция Метарóссии

Стек: HTML5, CSS3, JavaScript, Express

https://metarussia.asebeia.su

Каждый клик по metarussia.asebeia.su генерирует издание уникального экземпляра «конституции» — одного из 40 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000. Они создаются расположением 57 именованных фрагментов в псевдослучайном порядке.

## Как это работает:

- исходный текст в формате .docx преобразуется в .html с помощью Mammoth:

```bash
$ npm install mammoth
$ mammoth input.docx output.html
```

- из него формируется структура данных metarussia.js;
- Express отдаёт статический фронтенд;
- после полной загрузки, фронтенд делает get-запрос на /generate;
- Express рандомно перераспределяет главы, соотносит их с оглавлением, подставляет в начале предисловие, в конце послесловие и отдаёт результат, прибавляя к copy.json единицу, а также фиксируя свои действия в report.txt;