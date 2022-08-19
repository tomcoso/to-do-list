import observer from './observer.js'
import {
  add,
  compareAsc,
  compareDesc,
  format,
  isFuture,
  isPast,
} from 'date-fns'
import calendar from '../assets/calendar.svg'
import layers from '../assets/layers.svg'
import gitIcon from '../assets/github.svg'
const page = (function () {
  const main = document.querySelector('#main-container')
  const deck = document.querySelector('#deck')
  const incomingTab = document.querySelector('.incoming-wrap div')
  const sidebar = document.querySelector('#sidebar')
  const newTg = document.querySelector('#new-taskgroup')
  const git = document.querySelector('.header-btns > a > img')

  let deckData

  incomingTab.addEventListener('click', (e) => {
    _render(deckData, 'Overview')
    deck.childNodes.forEach((ul) => {
      ul.childNodes.forEach((x) => x.classList.remove('current-view'))
    })
  })

  const attach = function (data, targetView) {
    deckData = data
    deck.replaceChildren()
    for (let i = 0; i < data.length; i++) {
      const taskgroup = document.createElement('ul')
      const tgTitle = document.createElement('div')
      tgTitle.textContent = data[i].title
      taskgroup.append(tgTitle)
      taskgroup.addEventListener('click', (e) => {
        let target
        e.path[0] === taskgroup
          ? (target = data[i].title)
          : (target = e.path[0].textContent)

        _viewHandler(data[i], target)
      })
      const tasks = data[i].tasks
      for (const task in tasks) {
        const taskLi = document.createElement('li')
        taskLi.textContent = tasks[task].title
        if (tasks[task].completed) {
          taskLi.classList.add('completed')
        }
        taskgroup.append(taskLi)
      }
      deck.append(taskgroup)
    }

    if (targetView === 'taskgroup') {
      _render(
        data.find(
          (tg) => tg.title === document.querySelector('.head-title').textContent
        )
      )
    } else if (
      targetView !== 'taskgroup' &&
      targetView !== 'Overview' &&
      targetView
    ) {
      _render(
        data
          .find(
            (tg) =>
              tg.title === document.querySelector('.head-title').textContent
          )
          .tasks.find((t) => t.title === targetView[0]),
        targetView[1]
      )
    } else {
      _render(data, 'Overview')
    }
    window.addEventListener('resize', () => {
      if (window.screen.availWidth < 1000) {
        sidebar.classList.add('hidden')
        newTg.textContent = ''
      } else {
        sidebar.classList.remove('hidden')
        newTg.textContent = 'New Taskgroup'
      }
    })
  }

  const _render = function (obj, taskgroupName) {
    main.replaceChildren()

    const layoutHead = document.createElement('div')
    layoutHead.classList.add('main-head')

    const headTitle = document.createElement('div')
    headTitle.classList.add('head-title')
    headTitle.textContent = taskgroupName || obj.title
    headTitle.addEventListener('click', () => {
      if (taskgroupName && taskgroupName !== 'Overview') {
        _viewHandler(
          deckData.find((x) => x.title === taskgroupName),
          taskgroupName
        )
      }
    })
    const headTitleWrap = document.createElement('div')
    const menuBtn = document.createElement('img')
    menuBtn.setAttribute('src', taskgroupName ? calendar : layers)
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('hidden')
      menuBtn.classList.toggle('hidden')
    })
    menuBtn.classList.add('hidden')
    if (window.screen.availWidth < 1000) {
      sidebar.classList.add('hidden')
      menuBtn.classList.remove('hidden')
    }

    window.addEventListener('resize', () => {
      if (window.screen.availWidth < 1000) {
        menuBtn.classList.remove('hidden')
      } else {
        menuBtn.classList.add('hidden')
      }
    })

    headTitleWrap.append(menuBtn, headTitle)
    layoutHead.append(headTitleWrap)

    if (!taskgroupName) {
      const delBtn = document.createElement('button')
      delBtn.textContent = ''
      delBtn.setAttribute('type', 'button')
      delBtn.setAttribute('id', 'del-taskgroup')
      delBtn.addEventListener('click', () =>
        observer.publish('deleteObject', obj.title)
      )
      layoutHead.append(delBtn)
    }

    const layoutBody = document.createElement('div')
    layoutBody.classList.add('main-body')

    if (taskgroupName && taskgroupName !== 'taskgroup') {
      if (taskgroupName === 'Overview') {
        _renderIncoming(obj, layoutBody)
      } else {
        _renderTask(obj, layoutBody)
      }
    } else if (!taskgroupName || taskgroupName === 'taskgroup') {
      _renderTaskgroup(obj, layoutBody)
    }

    main.append(layoutHead, layoutBody)
  }

  const _viewHandler = function (obj, target) {
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

  const _renderTask = function (obj, layoutBody) {
    deck.childNodes.forEach((ul) => {
      ul.childNodes.forEach((x) =>
        x.textContent === obj.title
          ? x.classList.add('current-view')
          : x.classList.remove('current-view')
      )
    })
    incomingTab.classList.remove('current-view')

    const bodyHead = document.createElement('div')
    bodyHead.classList.add('body-head')

    const bodyTitle = document.createElement('div')
    bodyTitle.classList.add('body-title')
    bodyTitle.textContent = obj.title

    const bodyCDate = document.createElement('p')
    bodyCDate.textContent = 'Created the ' + obj.creationDate
    bodyCDate.classList.add('body-cdate')

    const titleWrap = document.createElement('div')
    titleWrap.classList.add('body-title-wrap')
    titleWrap.append(bodyTitle, bodyCDate)

    const bodyPriority = document.createElement('p')
    bodyPriority.textContent = `${obj.priority} priority`
    bodyPriority.classList.add('body-priority')
    bodyPriority.classList.add(obj.priority.toLowerCase())

    const bodyDDate = document.createElement('p')

    bodyDDate.textContent =
      'Due: ' +
      (obj.dueDate ? format(new Date(obj.dueDate), 'dd/MM/yy') : 'Whenever')

    const btnsDiv = document.createElement('div')
    btnsDiv.classList.add('buttons')

    const bodyDelBtn = document.createElement('button')
    bodyDelBtn.setAttribute('type', 'button')
    bodyDelBtn.textContent = ''
    bodyDelBtn.addEventListener('click', () =>
      observer.publish('deleteObject', [
        obj.title,
        document.querySelector('.head-title').textContent,
      ])
    )

    const bodyCompleteBtn = document.createElement('button')
    bodyCompleteBtn.setAttribute('type', 'button')
    bodyCompleteBtn.textContent = 'Complete'
    bodyCompleteBtn.addEventListener('click', () => {
      const taskgroup = document.querySelector('.head-title').textContent
      observer.publish('completeTask', [obj.title, taskgroup, 'task'])
    })
    if (obj.completed) {
      layoutBody.classList.add('complete')
      bodyCompleteBtn.textContent = 'Uncomplete'
    }

    btnsDiv.append(bodyDelBtn, bodyCompleteBtn)

    const bodyDesc = document.createElement('div')
    bodyDesc.classList.add('body-description')
    bodyDesc.textContent = obj.description

    bodyHead.append(titleWrap, bodyPriority, bodyDDate, btnsDiv, bodyDesc)

    layoutBody.append(bodyHead)

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
        if (obj.checkbox[item]) {
          checkboxInput.setAttribute('checked', '')
          checkboxItem.classList.add('completed')
        }
        checkboxInput.addEventListener('change', () => {
          const taskgroup = document.querySelector('.head-title').textContent
          observer.publish('markTaskCheckbox', [item, obj.title, taskgroup])
        })

        checkboxItem.append(checkboxInput, checkboxLabel)
        checkboxUl.append(checkboxItem)
      }
      checkboxWrap.append(checkboxUl)
      layoutBody.append(checkboxWrap)
    }
  }

  const _renderTaskgroup = function (obj, layoutBody) {
    deck.childNodes.forEach((ul) => {
      ul.childNodes.forEach((x) =>
        x.textContent === obj.title
          ? x.classList.add('current-view')
          : x.classList.remove('current-view')
      )
    })
    incomingTab.classList.remove('current-view')

    const bodyHead = document.createElement('div')
    bodyHead.classList.add('body-head')

    const bodyTitle = document.createElement('div')
    bodyTitle.classList.add('body-title')
    bodyTitle.textContent = 'Taskgroup'

    const bodyCDate = document.createElement('p')
    bodyCDate.textContent = 'Created the ' + obj.creationDate
    bodyCDate.classList.add('body-cdate')

    const titleWrap = document.createElement('div')
    titleWrap.classList.add('body-title-wrap')
    titleWrap.append(bodyTitle, bodyCDate)

    const bodyPriority = document.createElement('p')
    bodyPriority.textContent = `${obj.priority} priority`
    bodyPriority.classList.add('body-priority')
    bodyPriority.classList.add(obj.priority.toLowerCase())

    const bodyDDate = document.createElement('p')
    bodyDDate.textContent =
      'Due: ' +
      (obj.dueDate ? format(new Date(obj.dueDate), 'dd/MM/yy') : 'Whenever')

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
    tasksNewBtn.addEventListener('click', () =>
      observer.publish('newObject', ['task', obj.title])
    )

    tasksHeader.append(tasksHeaderTitle)
    if (obj.tasks.length === 0) {
      const oopsMessage = document.createElement('p')
      oopsMessage.innerHTML =
        'Looks like you have no tasks ;_; <br>Go ahead and create one!'
      tasksHeader.append(oopsMessage)
    }

    tasksHeader.append(tasksNewBtn)

    const tasksList = document.createElement('div')

    for (const task in obj.tasks) {
      const newTask = document.createElement('div')
      newTask.classList.add('task')
      newTask.classList.add(obj.tasks[task].priority.toLowerCase())

      const taskTitle = document.createElement('div')
      taskTitle.textContent = obj.tasks[task].title
      taskTitle.classList.add('task-title')

      const taskDDate = document.createElement('p')
      taskDDate.classList.add('task-ddate')
      taskDDate.textContent =
        'Due: ' +
        (obj.tasks[task].dueDate
          ? format(new Date(obj.tasks[task].dueDate), 'dd/MM/yy')
          : 'Whenever')

      const taskPriority = document.createElement('p')
      taskPriority.classList.add('task-priority')
      taskPriority.textContent = `${obj.tasks[task].priority} priority`

      const btnsDiv = document.createElement('div')
      btnsDiv.classList.add('buttons')

      const tasksDelBtn = document.createElement('button')
      tasksDelBtn.setAttribute('type', 'button')
      tasksDelBtn.textContent = ''
      tasksDelBtn.addEventListener('click', () =>
        observer.publish('deleteObject', [obj.tasks[task].title, obj.title])
      )

      const tasksCompleteBtn = document.createElement('button')
      tasksCompleteBtn.setAttribute('type', 'button')
      tasksCompleteBtn.textContent = 'Complete'
      if (obj.tasks[task].completed) {
        tasksCompleteBtn.textContent = 'Uncomplete'
        newTask.classList.add('completed')
      }
      tasksCompleteBtn.addEventListener('click', () => {
        observer.publish('completeTask', [
          obj.tasks[task].title,
          obj.title,
          'taskgroup',
        ])
      })

      const viewBtn = document.createElement('button')
      viewBtn.setAttribute('type', 'button')
      viewBtn.textContent = 'View'
      viewBtn.addEventListener('click', () =>
        _render(obj.tasks[task], obj.title)
      )

      btnsDiv.append(tasksDelBtn, tasksCompleteBtn, viewBtn)

      newTask.append(taskTitle, taskDDate, taskPriority, btnsDiv)

      tasksList.append(newTask)
    }
    bodyTasks.append(tasksHeader, tasksList)
    layoutBody.append(bodyHead, bodyTasks)
  }

  const _renderIncoming = function (obj, layoutBody) {
    const currentDate = new Date()
    incomingTab.classList.add('current-view')

    const _makeLi = function (taskTitle, tgTitle) {
      const taskgroup = deckData.find((x) => x.title === tgTitle)
      const taskObj = taskgroup.tasks.find((x) => x.title === taskTitle)

      const newItem = document.createElement('li')
      const checkboxItem = document.createElement('div')

      const id = 'id' + Math.random().toString(16).slice(2)
      const checkboxLabel = document.createElement('label')
      checkboxLabel.setAttribute('for', id)
      checkboxLabel.textContent = taskTitle

      const checkboxInput = document.createElement('input')
      checkboxInput.setAttribute('type', 'checkbox')
      checkboxInput.setAttribute('id', id)
      if (taskObj.completed) {
        checkboxInput.setAttribute('checked', '')
        newItem.classList.add('completed')
      }
      checkboxInput.addEventListener('change', () => {
        observer.publish('completeTask', [taskTitle, tgTitle, 'Overview'])
      })

      checkboxItem.append(checkboxInput, checkboxLabel)

      const itemTitle = document.createElement('span')
      itemTitle.append(checkboxItem)

      const viewSpan = document.createElement('span')
      viewSpan.textContent = 'view'
      viewSpan.addEventListener('click', () => {
        _viewHandler(taskgroup, taskTitle)
      })

      const itemTaskgroup = document.createElement('span')
      itemTaskgroup.textContent = tgTitle
      itemTaskgroup.addEventListener('click', () => {
        _viewHandler(taskgroup, tgTitle)
      })

      newItem.classList.add(taskObj.priority.toLowerCase())

      newItem.append(itemTitle, viewSpan, itemTaskgroup)

      return newItem
    }

    const _makeTimePanel = function (time, tTitle) {
      const panel = document.createElement('div')
      panel.classList.add('time-panel', time)

      const title = document.createElement('div')
      title.textContent = tTitle
      title.classList.add('time-title')
      if (time === 'incoming') {
        title.addEventListener('click', () => {
          _viewHandler(
            deckData.find((x) => x.title === tTitle),
            tTitle
          )
        })
      }

      const tasks = document.createElement('div')
      tasks.classList.add('time-panel-tasks')

      panel.append(title)
      const list = document.createElement('ul')

      return { panel, list, tasks }
    }

    const _appendToBody = function (call) {
      call.tasks.append(call.list)
      call.panel.append(call.tasks)
      layoutBody.append(call.panel)
    }

    const ifCheck = {
      today: false,
      thisWeek: false,
      thisMonth: false,
      incoming: false,
      outdated: false,
    }

    const todayTimePanel = _makeTimePanel('today', 'Today')
    const weekTimePanel = _makeTimePanel('week', 'Due this week')
    const monthTimePanel = _makeTimePanel('month', 'Due this month')
    const incomingTimePanel = _makeTimePanel('incoming', 'Incoming tasks')
    const outdatedTimePanel = _makeTimePanel('outdated', 'Past due')

    for (const tg in obj) {
      obj[tg].tasks.forEach((task) => {
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate)
          // TODAY--------------------------------------
          if (format(dueDate, 'dd/MM/yy') === format(currentDate, 'dd/MM/yy')) {
            ifCheck.today = true
            const newItem = _makeLi(task.title, obj[tg].title)
            todayTimePanel.list.append(newItem)
          } else if (
            // THIS WEEK-----------------------------------
            compareDesc(dueDate, add(currentDate, { days: 7 })) === 1 &&
            isFuture(dueDate, currentDate)
          ) {
            ifCheck.thisWeek = true
            const newItem = _makeLi(task.title, obj[tg].title)
            weekTimePanel.list.append(newItem)
          } else if (
            // THIS MONTH--------------------------------
            format(dueDate, 'dd/MM/yy') !==
              format(add(currentDate, { months: 1 }), 'dd/MM/yy') &&
            compareDesc(dueDate, add(currentDate, { months: 1 })) === 1 &&
            compareAsc(dueDate, add(currentDate, { days: 7 })) === 1
          ) {
            ifCheck.thisMonth = true
            const newItem = _makeLi(task.title, obj[tg].title)
            monthTimePanel.list.append(newItem)
          } else if (
            // PAST DUE---------------------------------
            isPast(dueDate, currentDate) &&
            format(dueDate, 'dd/MM/yy') !== format(currentDate, 'dd/MM/yy')
          ) {
            ifCheck.outdated = true
            const newItem = _makeLi(task.title, obj[tg].title)
            outdatedTimePanel.list.append(newItem)
          }
        }
      })
    }
    for (const time in ifCheck) {
      switch (true) {
        case ifCheck[time] && time === 'today':
          _appendToBody(todayTimePanel)
          break
        case ifCheck[time] && time === 'thisWeek':
          _appendToBody(weekTimePanel)
          break
        case ifCheck[time] && time === 'thisMonth':
          _appendToBody(monthTimePanel)
          break
        case ifCheck[time] && time === 'incoming':
          _appendToBody(incomingTimePanel)
          break
        case ifCheck[time] && time === 'outdated':
          _appendToBody(outdatedTimePanel)
          break
      }
    }
    const _ifNoIncoming = function () {
      for (const time in ifCheck) {
        if (ifCheck[time]) {
          if (time === 'outdated') {
            continue
          }
          return false
        }
      }
      return true
    }
    if (_ifNoIncoming()) {
      const noIncomingPanel = document.createElement('div')
      noIncomingPanel.classList.add('no-incoming-panel')
      const NIPMessage = document.createElement('p')
      NIPMessage.textContent = 'There are no tasks due for this month! :)'
      const NIPTitle = document.createElement('p')
      NIPTitle.textContent = 'All Taskgroups'
      noIncomingPanel.append(NIPMessage, NIPTitle)

      for (const tg in obj) {
        const taskgroup = _makeTimePanel('incoming', obj[tg].title)
        for (const t in obj[tg].tasks) {
          const newTask = document.createElement('li')
          newTask.textContent = obj[tg].tasks[t].title
          newTask.addEventListener('click', () =>
            _render(obj[tg].tasks[t], obj[t].title)
          )
          taskgroup.list.append(newTask)
          taskgroup.panel.append(taskgroup.list)
        }
        noIncomingPanel.append(taskgroup.panel)
      }
      if (obj.length === 0) {
        const oopsMessage = document.createElement('div')
        oopsMessage.textContent =
          'Oops! Seems like you have no Taskgroups yet. Go ahead and create one!'
        noIncomingPanel.append(oopsMessage)
      }
      layoutBody.append(noIncomingPanel)
    }
  }

  if (window.screen.availWidth < 1000) {
    newTg.textContent = ''
  }

  newTg.addEventListener('click', () => {
    observer.publish('newObject', 'taskgroup')
  })

  git.setAttribute('src', gitIcon)

  return { attach }
})()

export default page
