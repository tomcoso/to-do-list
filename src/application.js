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
    }

    const read = function (prop) {
      return data[prop]
    }

    const update = function (prop, value) {
      if (value) {
        data[prop] = value
      } else {
        return 'Error: Value cannot be falsy'
      }
    }

    const create = function (prop, value) {
      if (!data[prop]) {
        data[prop] = value
      } else {
        return 'Error: Property already exists'
      }
    }
    const deleteProperty = function (prop) {
      if (data[prop] === dueDate || data[prop] === notes) {
        data[prop] = null
      } else {
        return 'Error: Property cannot be deleted'
      }
    }

    return { read, update, create, deleteProperty }
  }

  const _task = function (data) {
    const info = _info(data)
    return { info }
  }

  const Taskgroup = function (data) {
    const info = _info(data)
    const tasks = []

    const createTask = function (data) {
      const newTask = _task(data)
      tasks.push(newTask)
      return 'Task created succesfully'
    }

    const getTasks = function () {
      for (const each in tasks) {
        console.log(tasks[each].info.read('title'), tasks[each])
      }
      return 'Done!'
    }

    const updateTask = function (task, prop, value) {
      if (value) {
        tasks[task][prop] = value // if this doesnt work, try array.find(each => each.prop === task.prop)
      } else {
        return 'Error: Value must not be falsy'
      }
      return 'Task updated succesfully'
    }

    const deleteTask = function (task) {
      for (let i = 0; i < tasks.lenght; i++) {
        if (tasks.title === task.title) {
          tasks.splice(i, 1)
          return 'Task deleted succesfully'
        }
      }
      return 'Error: Failed to delete task'
    }

    return { info, createTask, getTasks, updateTask, deleteTask }
  }

  return { Taskgroup }
})()

export default app
