import './style.css'
import app from './modules/application.js'
import page from './modules/htmlgen.js'
import { add } from 'date-fns'
// import observer from './modules/observer.js'
import observer from './modules/observer'
;(function () {
  const test = app.Taskgroup('My First Project', 'Important')

  test.createTask('Task 1', 'Important', 'My Fabulous Project')
  test.createTask('Task 2', 'Unimportant')
  test.createTask('Task 3', 'Important', "Just another task -.-'")
  // test.find('Task 3').info.create('dueDate', new Date())
  test.find('Task 2').info.create('dueDate', add(new Date(), { days: 2 }))
  test
    .find('Task 1')
    .info.create('dueDate', add(new Date(), { months: 1, days: -1 }))
  const checkTest = {
    item1: false,
    item2: false,
    item3: true,
  }
  test.find('Task 2').setCheckbox(checkTest)
  test.find('Task 2').updateCheckbox('item1', true)
  test.find('Task 2').updateCheckbox('item2', true)

  const test2 = app.Taskgroup(
    'My Second Project',
    'Unimportant',
    'Fancy description'
  )
  test2.createTask('Task 2.1', 'Important')
  test2.find('Task 2.1').info.create('dueDate', add(new Date(), { days: -2 }))

  test2.createTask('Task 2.2', 'Unimportant')
  test2.find('Task 2.2').info.create('dueDate', add(new Date(), { months: 1 }))

  const test3 = app.Taskgroup('Third Taskgroup', 'DO or DIE')

  const deck = [test, test2, test3]
  const parsedDeck = deck.map((each) => app.parseData(each))

  page.attach(parsedDeck)
})()
