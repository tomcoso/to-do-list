// import observer from './observer.js'
import {
  add,
  compareAsc,
  compareDesc,
  format,
  isFuture,
  isPast,
} from 'date-fns'
const page = (function () {
  const main = document.querySelector('#main-container')
  const deck = document.querySelector('#deck')
  const incomingTab = document.querySelector('.incoming-wrap div')

  const attach = function (data) {
    for (let i = 0; i < data.length; i++) {
      const taskgroup = document.createElement('ul')
      taskgroup.textContent = data[i].title
      taskgroup.addEventListener('click', (e) => {
        let target
        if (e.path[0] === taskgroup) {
          target = data[i].title
        } else {
          target = e.path[0].textContent
        }
        _viewHandler(data[i], target)
      })
      const tasks = data[i].tasks
      for (const task in tasks) {
        const taskLi = document.createElement('li')
        taskLi.textContent = tasks[task].title
        taskgroup.append(taskLi)
      }
      deck.append(taskgroup)
    }
    incomingTab.addEventListener('click', (e) => {
      _render(data, 'Incoming')
    })
  }

  const _renderTask = function (obj, layoutBody) {
    const bodyHead = document.createElement('div')
    bodyHead.classList.add('body-head')

    const bodyTitle = document.createElement('div')
    bodyTitle.classList.add('body-title')
    bodyTitle.textContent = obj.title

    const bodyCDate = document.createElement('p')
    bodyCDate.textContent = 'Created the ' + obj.creationDate
    bodyTitle.classList.add('body-cdate')

    const titleWrap = document.createElement('div')
    titleWrap.classList.add('body-title-wrap')
    titleWrap.append(bodyTitle, bodyCDate)

    const bodyPriority = document.createElement('p')
    bodyPriority.textContent = obj.priority
    bodyPriority.classList.add('body-priority')

    const bodyDDate = document.createElement('p')

    bodyDDate.textContent =
      'Due: ' + (obj.dueDate ? format(obj.dueDate, 'dd/MM/yy') : 'Whenever')

    const bodyDelBtn = document.createElement('button')
    bodyDelBtn.setAttribute('type', 'button')
    bodyDelBtn.textContent = 'Delete'

    const bodyCompleteBtn = document.createElement('button')
    bodyCompleteBtn.setAttribute('type', 'button')
    bodyCompleteBtn.textContent = 'Complete'

    bodyHead.append(
      titleWrap,
      bodyPriority,
      bodyDDate,
      bodyDelBtn,
      bodyCompleteBtn
    )

    const bodyDesc = document.createElement('div')
    bodyDesc.classList.add('body-description')
    bodyDesc.textContent = obj.description

    layoutBody.append(bodyHead, bodyDesc)

    if (obj.checkbox) {
      const checkboxWrap = document.createElement('div')
      checkboxWrap.classList.add('checkbox-wrap')

      const checkboxUl = document.createElement('ul')
      for (const item in obj.checkbox) {
        const checkboxItem = document.createElement('li')

        const id = 'id' + Math.random().toString(16).slice(2)
        const checkboxLabel = document.createElement('label')
        checkboxLabel.setAttribute('for', id)
        checkboxLabel.textContent = item

        const checkboxInput = document.createElement('input')
        checkboxInput.setAttribute('type', 'checkbox')
        checkboxInput.setAttribute('id', id)

        checkboxItem.append(checkboxInput, checkboxLabel)
        checkboxUl.append(checkboxItem)
      }
      checkboxWrap.append(checkboxUl)
      layoutBody.append(checkboxWrap)
    }
  }

  const _renderTaskgroup = function (obj, layoutBody) {
    const bodyHead = document.createElement('div')
    bodyHead.classList.add('body-head')

    const bodyTitle = document.createElement('div')
    bodyTitle.classList.add('body-title')
    bodyTitle.textContent = 'Taskgroup'

    const bodyCDate = document.createElement('p')
    bodyCDate.textContent = 'Created the ' + obj.creationDate
    bodyTitle.classList.add('body-cdate')

    const titleWrap = document.createElement('div')
    titleWrap.classList.add('body-title-wrap')
    titleWrap.append(bodyTitle, bodyCDate)

    const bodyPriority = document.createElement('p')
    bodyPriority.textContent = obj.priority
    bodyPriority.classList.add('body-priority')

    const bodyDDate = document.createElement('p')
    bodyDDate.textContent =
      'Due: ' + (obj.dueDate ? format(obj.dueDate, 'dd/MM/yy') : 'Whenever')

    const bodyDesc = document.createElement('div')
    bodyDesc.classList.add('body-description')
    bodyDesc.textContent = obj.description

    bodyHead.append(titleWrap, bodyPriority, bodyDDate, bodyDesc)

    const bodyTasks = document.createElement('div')
    bodyTasks.classList.add('body-tasks')

    const tasksHeader = document.createElement('div')
    tasksHeader.classList.add('tasks-header')

    const tasksHeaderTitle = document.createElement('p')
    tasksHeaderTitle.textContent = `${obj.title}'s Tasks`

    const tasksNewBtn = document.createElement('button')
    tasksNewBtn.setAttribute('type', 'button')
    tasksNewBtn.textContent = 'New Task'

    tasksHeader.append(tasksHeaderTitle, tasksNewBtn)

    const tasksList = document.createElement('div')

    for (const task in obj.tasks) {
      const newTask = document.createElement('div')
      newTask.classList.add('task')

      const taskTitle = document.createElement('div')
      taskTitle.textContent = obj.tasks[task].title
      taskTitle.classList.add('task-title')

      const taskDDate = document.createElement('p')
      taskDDate.classList.add('task-ddate')
      taskDDate.textContent =
        'Due: ' +
        (obj.tasks[task].dueDate
          ? format(obj.tasks[task].dueDate, 'dd/MM/yy')
          : 'Whenever')

      const taskPriority = document.createElement('p')
      taskPriority.classList.add('task-priority')
      taskPriority.textContent = obj.tasks[task].priority

      const tasksDelBtn = document.createElement('button')
      tasksDelBtn.setAttribute('type', 'button')
      tasksDelBtn.textContent = 'Delete'

      const tasksCompleteBtn = document.createElement('button')
      tasksCompleteBtn.setAttribute('type', 'button')
      tasksCompleteBtn.textContent = 'Complete'

      newTask.append(
        taskTitle,
        taskDDate,
        taskPriority,
        tasksDelBtn,
        tasksCompleteBtn
      )

      tasksList.append(newTask)
    }
    bodyTasks.append(tasksHeader, tasksList)
    layoutBody.append(bodyHead, bodyTasks)
  }

  const _renderIncoming = function (obj, layoutBody) {
    const currentDate = new Date()
    const makeLi = function (taskTitle, tgTitle) {
      const newItem = document.createElement('li')
      const checkboxItem = document.createElement('div')

      const id = 'id' + Math.random().toString(16).slice(2)
      const checkboxLabel = document.createElement('label')
      checkboxLabel.setAttribute('for', id)
      checkboxLabel.textContent = taskTitle

      const checkboxInput = document.createElement('input')
      checkboxInput.setAttribute('type', 'checkbox')
      checkboxInput.setAttribute('id', id)

      checkboxItem.append(checkboxInput, checkboxLabel)

      const itemTitle = document.createElement('span')
      itemTitle.append(checkboxItem)

      const itemTaskgroup = document.createElement('span')
      itemTaskgroup.textContent = tgTitle

      newItem.append(itemTitle, itemTaskgroup)

      return newItem
    }

    const ifCheck = {
      today: false,
      thisWeek: false,
      thisMonth: false,
      incoming: false,
      outdated: false,
    }
    for (const tg in obj) {
      for (const t in obj[tg].tasks) {
        if (
          format(obj[tg].tasks[t].dueDate, 'dd/MM/yy') ===
          format(currentDate, 'dd/MM/yy')
        ) {
          ifCheck.today = true
          break
        }
      }
    }
    if (ifCheck.today) {
      const todayPanel = document.createElement('div')
      todayPanel.classList.add('time-panel', 'today')

      const todayTitle = document.createElement('div')
      todayTitle.textContent = 'Today'

      const todayTasks = document.createElement('div')
      todayTasks.classList.add('time-panel-tasks')

      const todayTasksList = document.createElement('ul')
      for (const tg in obj) {
        for (const t in obj[tg].tasks) {
          if (
            format(obj[tg].tasks[t].dueDate, 'dd/MM/yy') ===
            format(currentDate, 'dd/MM/yy')
          ) {
            const newItem = makeLi(obj[tg].tasks[t].title, obj[tg].title)
            todayTasksList.append(newItem)
          }
        }
      }
      todayTasks.append(todayTasksList)
      todayPanel.append(todayTitle, todayTasks)
      layoutBody.append(todayPanel)
    }
    const weekPanel = document.createElement('div')
    weekPanel.classList.add('time-panel', 'week')

    const weekTitle = document.createElement('div')
    weekTitle.textContent = 'Due this week'

    const weekTasks = document.createElement('div')
    weekTasks.classList.add('time-panel-tasks')

    const weekTasksList = document.createElement('ul') // attach on ifCheck

    for (const tg in obj) {
      obj[tg].tasks.forEach((task) => {
        const dueDate = task.dueDate
        if (
          compareDesc(dueDate, add(currentDate, { days: 7 })) === 1 &&
          isFuture(dueDate, currentDate)
        ) {
          ifCheck.thisWeek = true
          const newItem = makeLi(task.title, obj[tg].title)
          weekTasksList.append(newItem)
        } else if (
          isFuture(dueDate, currentDate) &&
          compareDesc(dueDate, add(currentDate, { months: 1 })) === 1 &&
          compareAsc(dueDate, add(currentDate, { days: 7 })) === 1
        ) {
          ifCheck.thisMonth = true
          console.log('this month.') // THIS MONTH
        } else if (compareAsc(dueDate, add(currentDate, { months: 1 })) >= 0) {
          ifCheck.incoming = true
          console.log('further than a month') // INCOMING
        } else if (
          isPast(dueDate, currentDate) &&
          format(dueDate, 'dd/MM/yy') !== format(currentDate, 'dd/MM/yy')
        ) {
          ifCheck.outdated = true
          console.log('outdated') // PAST DUE
        }
      })
    }
    if (ifCheck.thisWeek) {
      weekTasks.append(weekTasksList)
      weekPanel.append(weekTitle, weekTasks)
    } else {
      const weekNoTasks = document.createElement('div')
      weekNoTasks.textContent = 'No tasks due for this week'
      weekTasks.append(weekNoTasks)
      weekPanel.append(weekTitle, weekTasks)
    }
    layoutBody.append(weekPanel)
  }

  const _render = function (obj, taskgroupName) {
    main.replaceChildren()

    const layoutHead = document.createElement('div')
    layoutHead.classList.add('main-head')

    const headTitle = document.createElement('div')
    headTitle.classList.add('head-title')
    headTitle.textContent = taskgroupName || obj.title
    layoutHead.append(headTitle)

    const layoutBody = document.createElement('div')
    layoutBody.classList.add('main-body')

    if (taskgroupName) {
      if (taskgroupName === 'Incoming') {
        _renderIncoming(obj, layoutBody)
      } else {
        _renderTask(obj, layoutBody)
      }
    } else {
      _renderTaskgroup(obj, layoutBody)
    }

    main.append(layoutHead, layoutBody)
  }

  const _viewHandler = function (obj, target) {
    console.log([obj, target], 'initial data from listener')
    if (obj.title === target) {
      _render(obj)
    } else {
      for (const task in obj.tasks) {
        if (obj.tasks[task].title === target) {
          _render(obj.tasks[task], obj.title)
        }
      }
    }
  }

  // const test = function (data) {
  //   console.log(data)
  // }
  return { attach }
})()

export default page
