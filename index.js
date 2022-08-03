import './style.css'
import app from './application.js'

const test = app.Taskgroup('mytitle', 'Important')

test.createTask('myTask', 'Important', 'My Fabulous Project')
test.createTask('checkTask', 'Unimportant')
// console.log(test.getTasks())
const checkTest = {
  item1: false,
  item2: false,
  item3: true,
}
test.find('checkTask').setCheckbox(checkTest)
test.find('checkTask').updateCheckbox('item1', true)
test.find('checkTask').updateCheckbox('item2', true)
console.log(test.find('checkTask'))
console.log(test.find('checkTask').info.read('completed'))
