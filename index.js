// Run - nodemon index

// Express раздаёт статику, которая догружает из index.html стили и getConstitution.js
// Этот скрипт делает get-запрос по адресу /generate
// Express в ответ генерирует уникальный экземпляр Конституции из объекта metarussia.js

const fs = require('fs')
// const pdf = require('html-pdf')
const express = require('express')

const server = express()
const host = '127.0.0.1'
const port = 8001

// Подключаем текст Конституции
const { title, welcome, preamble, indexArray, fragmentsArray, end } = require('./metarussia')
// № экземпляра
let instance = ``

let indexArrayRandom // Здесь будет храниться рандомное оглавление в виде массива
let indexContent // Здесь будет храниться рандомное оглавление в виде строк
let fragmentsArrayRandom // Здесь будет храниться рандомный порядок фрагментов в виде массива
let fragments // Здесь будет храниться рандомный порядок фрагментов в виде строк
let book = `` // Здесь будет готовая книга

server.use(express.static(`${__dirname}/client/dist`))

server.get('/generate', (request, responce) => {
  // Читаем внешнюю переменную, хранящую номер экземпляра книги
  fs.readFile('copy.json', 'utf8', (err, data) => {
    if (err) {
      throw err
    }

    // Парсим
    let currentCopy = JSON.parse(data)

    // Фиксируем время обращения на сервер
    let date = new Date()
    // Генерируем отчёт о выпуске нового экземпляра книги
    let report = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} в ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()} выпущен экземпляр Конституции Метарóссии № ${currentCopy.copy}.\n`
    // Записываем во внешний файл
    fs.appendFile('report.txt', report, 'utf8', (err) => {
      if (err) {
        throw err
      }
    })

    // Прибавляем единицу к счётчику экземпляров
    let nextCopy = {
      copy: ++currentCopy.copy,
    }

    // Записываем номер следующего экземпляра во внешнюю переменную
    fs.writeFile('copy.json', JSON.stringify(nextCopy), 'utf8', (err) => {
      if (err) {
        throw err
      }
    })

    indexContent = `` // Обнуляем оглавление при обновлении страницы
    indexArrayRandom = []
    indexArrayRandom = indexArray.slice() // Копируем массив
    fragments = `` // Обнуляем оглавление при обновлении страницы
    fragmentsArrayRandom = []
    fragmentsArrayRandom = fragmentsArray.slice() // Копируем массив

    // Сортируем на рандоме массив
    for (let i = indexArrayRandom.length - 1; i > 0; i--) {
      // Выбираем элемент, с которым поменяем местами
      let j = Math.floor(Math.random() * (i + 1))
      // Меняем в оглавлении
      ;[indexArrayRandom[i], indexArrayRandom[j]] = [indexArrayRandom[j], indexArrayRandom[i]]
      // И в порядке фрагментов
      ;[fragmentsArrayRandom[i], fragmentsArrayRandom[j]] = [fragmentsArrayRandom[j], fragmentsArrayRandom[i]]
    }

    // Формируем строку с новым номером экземпляра
    instance = `<div class="first-draft">Вторая редакция</div><div class="instance">Экземпляр № ${currentCopy.copy - 1}</div>`

    // Конкатенируем все элементы массива в строки
    for (let i = 0; i < indexArrayRandom.length; i++) {
      indexContent += `<span><a href="#${indexArrayRandom[i]}">${indexArrayRandom[i]}</a></span>`
      // }
      // for (let i = 0; i < fragmentsArrayRandom.length; i++) {
      fragments += `<div class="fragment"><a name="${indexArrayRandom[i]}">${fragmentsArrayRandom[i]}</a></div>`
    }

    // Формируем экземпляр Конституции из отдельных частей
    book = `
    <div class="head">${title}${instance}</div>
    <div class="text">
      <div class="welcome">${welcome}</div>
      <div class="preamble">${preamble}</div>
      <div class="index">
        <div class="index__content">${indexContent}</div>
        <div class="index__end"><strong>ОСНОВНАЯ ЧАСТЬ</strong></div>
      </div>
      <div class="fragments">${fragments}</div>
      <div class="end">${end}</div>
    </div>`

    responce.status(200).type('text/html')
    responce.send(`${book}`)
    // responce.sendFile('a.html')
  })
})

server.use((request, responce, next) => {
  responce.status(404).type('text/plain')
  responce.send('Not found')
})

server.listen(port, host, () => console.log(`Server listens http://${host}:${port}`))
