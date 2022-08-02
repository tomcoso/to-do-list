import './style.css'
import app from './application.js'

const test = app.Taskgroup('mytitle', 'Important')
// console.log(test)
// console.log(test.info.read('title'))
// console.log(test.info.update('title', 'HOLAA'))
// console.log(test.info.read('title'))
test.createTask('myTask', 'Important', 'My Fabulous Project')
test.createTask('Othertitle', 'Unimportant')
test.getTasks()
