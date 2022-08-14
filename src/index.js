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
    storage.saveData(deck)
    page.attach(deck)
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
    deck = deckObj.map((x) => app.parseData(x))
    attachAndSave()
  }

  const deleteObject = function (data) {
    console.log(data)
    if (!data[1]) {
      for (let i = 0; i < deckObj.length; i++) {
        if (data[0] === deckObj[i].info.read('title')) {
          deckObj.splice(i, 1)
        }
      }
    } else {
      for (const tg of deckObj) {
        if (data[1] === tg.info.read('title')) {
          tg.deleteTask(tg.find(data[0]))
        }
      }
    }
    deck = deckObj.map((x) => app.parseData(x))
    console.log(deck)
    attachAndSave()
  }

  observer.subscribe('sentNewObjectData', createObjectFromDOM)

  observer.subscribe('sentDelObjectData', deleteObject)

  attachAndSave()
})()
