import './style.css'
import app from './application.js'
import page from './htmlgen.js'

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

page.attach(deck)
