import { initializeApp } from 'firebase/app'
import './style.css'
import './modules/objects'
import storage from './modules/storage'
import app from './modules/application.js'
import page from './modules/htmlgen.js'
import observer from './modules/observer.js'
import { add, format } from 'date-fns'

const firebaseConfig = {
  apiKey: 'AIzaSyAjkeQUd8mXLQ4PO-5_GSSK72a66H99KQw',
  authDomain: 'task-manager-253a8.firebaseapp.com',
  projectId: 'task-manager-253a8',
  storageBucket: 'task-manager-253a8.appspot.com',
  messagingSenderId: '747966595120',
  appId: '1:747966595120:web:05f2f497285192d9282df5',
}

const app = initializeApp(firebaseConfig)

;(function () {
  let deck = []

  if (localStorage.deck) {
    deck = storage.fetchData()
  } else {
    const example = app.Taskgroup(
      'Example Project',
      'Low',
      'This taskgroup was created by ME! DIO!!',
      '06/06/2043'
    )
    example.createTask(
      'Super Secret Task',
      'High',
      "Don't tell anyone. Not even yourself. In fact, what are you talking about? Shut up.",
      format(new Date(), 'MM/dd/yyyy')
    )
    example.createTask(
      'Tomar mate',
      'Maximum',
      'Amargos. Siempre',
      format(add(new Date(), { days: 2 }), 'MM/dd/yyyy')
    )
    example.createTask(
      'Go to the dentist',
      'Medium',
      'Regular check with Dr. Who',
      format(add(new Date(), { days: 3 }), 'MM/dd/yyyy')
    )
    deck.push(app.parseData(example))
  }

  const deckObj = app.unparseData(deck)

  const attachAndSave = function (targetOpt) {
    storage.saveData(deck)
    targetOpt ? page.attach(deck, targetOpt) : page.attach(deck)
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
    attachAndSave()
  }

  const completeTask = function (data) {
    const task = deckObj
      .find((tg) => tg.info.read('title') === data[1])
      .find(data[0])
    if (task.info.read('completed')) {
      task.info.update('completed', false)
      if (task.checkbox) {
        for (const item in task.checkbox) {
          task.checkbox[item] = false
        }
      }
    } else {
      task.info.update('completed', true)
      if (task.checkbox) {
        for (const item in task.checkbox) {
          task.checkbox[item] = true
        }
      }
    }

    deck = deckObj.map((x) => app.parseData(x))
    if (data[2] === 'task') {
      attachAndSave([data[0], data[1]])
    } else {
      attachAndSave(data[2])
    }
  }

  const markCheckbox = function (data) {
    const taskgroup = deckObj.find((tg) => tg.info.read('title') === data[2])
    const task = taskgroup.find(data[1])
    task.checkbox[data[0]]
      ? task.updateCheckbox(data[0], false)
      : task.updateCheckbox(data[0], true)
    deck = deckObj.map((x) => app.parseData(x))
    attachAndSave([data[1], data[2]])
  }

  observer.subscribe('sentNewObjectData', createObjectFromDOM)

  observer.subscribe('sentDelObjectData', deleteObject)

  observer.subscribe('completeTask', completeTask)

  observer.subscribe('markTaskCheckbox', markCheckbox)

  attachAndSave()
})()
