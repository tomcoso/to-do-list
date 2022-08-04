const app = (function () {
  const _info = function (
    title,
    priority,
    description = 'This is my glorious project',
    notes = null,
    dueDate = null
  ) {
    const data = {
      title,
      priority,
      description,
      notes,
      dueDate,
      creationDate: 'Today', // insert date query
      completed: false,
    }

    const read = function (prop) {
      return data[prop]
    }

    const update = function (prop, value) {
      if (value) {
        data[prop] = value
      } else if (data[prop] === 'completed') {
        value ? (data[prop] = true) : (data[prop] = false)
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
      if (data[prop] === dueDate || data[prop] === notes) {
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
          return
        }
      }
      this.info.update('completed', true)
    }

    return { info, setCheckbox, updateCheckbox }
  }

  const Taskgroup = function (data) {
    const info = _info(data)
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

  return { Taskgroup }
})()

export default app