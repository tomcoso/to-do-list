import './style.css'
import './modules/objects'
import storage from './modules/storage'
import app from './modules/application.js'
import page from './modules/htmlgen.js'
import observer from './modules/observer.js'
;(function () {
  let deck = []

  if (localStorage.deck) {
    deck = storage.fetchData()
  }

  const deckObj = app.unparseData(deck)

  const attachAndSave = function () {
    page.attach(deck)
    storage.saveData(deck)
  }

  const createObjectFromDOM = function (data) {
    if (!Array.isArray(data.type)) {
      const newTg = app.Taskgroup(data.title, data.priority)
      if (data.description) newTg.info.update('description', data.description)
      if (data.dueDate) newTg.info.update('dueDate', new Date(data.dueDate))
      deckObj.push(newTg)
    } else if (Array.isArray(data.type)) {
      const tg = deckObj.filter((x) => x.info.read('title') === data.type[1])[0]
      tg.createTask(data.title, data.priority)
      const newTask = tg.find(data.title)
      if (data.description) newTask.info.update('description', data.description)
      if (data.dueDate) newTask.info.update('dueDate', new Date(data.dueDate))
      if (data.checkbox) newTask.setCheckbox(data.checkbox)
    }
    console.log(deckObj)
    deck = deckObj.map((x) => app.parseData(x))
    attachAndSave()
  }

  observer.subscribe('sentNewObjectData', (data) => {
    createObjectFromDOM(data)
  })

  attachAndSave()
})()
