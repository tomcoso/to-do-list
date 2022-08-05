import './style.css'
import app from './modules/application.js'
import page from './modules/htmlgen.js'
// import observer from './modules/observer.js'
;(function () {
  const test = app.Taskgroup('My First Project', 'Important')

  test.createTask('myTask', 'Important', 'My Fabulous Project')
  test.createTask('checkTask', 'Unimportant')
  const checkTest = {
    item1: false,
    item2: false,
    item3: true,
  }
  test.find('checkTask').setCheckbox(checkTest)
  test.find('checkTask').updateCheckbox('item1', true)
  test.find('checkTask').updateCheckbox('item2', true)

  const test2 = app.Taskgroup(
    'My Second Project',
    'Unimportant',
    'Fancy description'
  )
  test2.createTask('Task 1', 'Important')

  const deck = [test, test2]
  const parsedDeck = deck.map((each) => app.parseData(each))

  page.attach(parsedDeck)

  // observer.subscribe('viewRequest', (data) =>
  //   page.viewHandler(data, parsedDeck)
  // )
})()
