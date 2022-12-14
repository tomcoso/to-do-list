import { format } from 'date-fns'
// import observer from './observer.js'
const app = (function () {
  const _info = function (
    title,
    priority,
    description = 'This is my glorious project',
    dueDate = null,
    creationDate = format(new Date(), 'dd/MM/yy'),
    completed
  ) {
    const data = {
      title,
      priority,
      description,
      dueDate,
      creationDate,
    }
    data.completed = !!completed

    const read = function (prop) {
      return data[prop]
    }

    const update = function (prop, value) {
      if (value || prop === 'completed') {
        data[prop] = value
      } else {
        throw new Error('Value cannot be falsy')
      }
    }

    const create = function (prop, value) {
      if (!data[prop]) {
        data[prop] = value
      } else {
        throw new Error('Property already exists')
      }
    }
    const deleteProperty = function (prop) {
      if (data[prop] === dueDate) {
        data[prop] = null
      } else {
        throw new Error('Property cannot be deleted')
      }
    }

    return { read, update, create, deleteProperty }
  }

  const _task = function (data) {
    const info = _info(...data)

    const setCheckbox = function (obj = false) {
      if (obj) {
        this.checkbox = obj
      } else {
        throw new Error('Argument must be an object')
      }
    }

    const updateCheckbox = function (item, bool) {
      const checkbox = this.checkbox
      for (const each in checkbox) {
        if (each === item) {
          checkbox[each] = bool === true
        }
      }
      for (const each in checkbox) {
        if (!checkbox[each]) {
          if (this.info.read('completed')) {
            this.info.update('completed', false)
          }
          return
        }
      }
      this.info.update('completed', true)
    }

    return { info, setCheckbox, updateCheckbox }
  }

  const Taskgroup = function (...data) {
    const info = _info(...data)
    const tasks = []

    const find = function (task) {
      for (const each in tasks) {
        if (tasks[each].info.read('title') === task) {
          return tasks[each]
        }
      }
      return false
    }

    const createTask = function (...data) {
      const newTask = _task(data)
      tasks.push(newTask)
      return 'Task created succesfully'
    }

    const getTasks = function () {
      return tasks
    }

    const deleteTask = function (task) {
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].info.read('title') === task.info.read('title')) {
          tasks.splice(i, 1)
          break
        }
      }
    }
    return { info, createTask, getTasks, deleteTask, find }
  }

  const parseData = function (obj) {
    const _parseInfo = function (item) {
      const info = {
        title: item.info.read('title'),
        priority: item.info.read('priority'),
        description: item.info.read('description'),
        creationDate: item.info.read('creationDate'),
        dueDate: item.info.read('dueDate'),
        completed: item.info.read('completed'),
        checkbox: item.checkbox || false,
      }
      return info
    }
    if (obj.getTasks) {
      const parsedObj = _parseInfo(obj)
      parsedObj.tasks = []
      obj.getTasks().forEach((each) => {
        const eachInfo = _parseInfo(each)
        parsedObj.tasks.push(eachInfo)
      })
      return parsedObj
    } else {
      const parsedObj = _parseInfo(obj)
      return parsedObj
    }
  }

  const unparseData = function (data) {
    const objectDeck = []
    for (const each of data) {
      const eachTaskgroup = Taskgroup(
        each.title,
        each.priority,
        each.description,
        new Date(each.dueDate),
        each.creationDate,
        each.completed
      )
      if (each.tasks) {
        for (const task of each.tasks) {
          eachTaskgroup.createTask(
            task.title,
            task.priority,
            task.description,
            new Date(task.dueDate),
            task.creationDate,
            task.completed
          )
          if (task.checkbox) {
            eachTaskgroup.find(task.title).setCheckbox(task.checkbox)
          }
        }
      }
      objectDeck.push(eachTaskgroup)
    }
    return objectDeck
  }

  return { Taskgroup, parseData, unparseData }
})()

export default app
