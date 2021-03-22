window.addEventListener('load', () => {
  fetch(`/generate`)
    .then((response) => {
      if (response.status !== 200) {
        document.querySelector('body').innerHTML = `Ошибка при загрузке данных с сервера.<br>Статус: ${response.status}`
        return
      }

      // Если всё в порядке, то парсим ответ
      response.text().then((data) => {
        document.querySelector('.metarussia').innerHTML = data
      })
    })
    .catch((error) => {
      document.querySelector('body').innerHTML = `Ошибка связи с сервером.<br>Проверьте подключение к интернету.`
    })
})
