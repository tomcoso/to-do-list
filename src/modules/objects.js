import observer from './observer'
import { format, add } from 'date-fns'

const object = (function () {
  const _newTag = function (tag, options) {
    return Object.assign(document.createElement(tag), options)
  }
  const _createPopup = function (type) {
    const pageWrap = document.querySelector('#page-wrapper')

    const popupPanel = _newTag('div', { id: 'object-panel' })
    popupPanel.setAttribute(
      'style',
      'position: absolute; background-color: white; padding: 1rem'
    )

    const form = _newTag('form', { id: 'object-form' })
    // TITLE
    const title = document.createElement('div')
    const titleLabel = _newTag('label', { innerText: 'Name' })
    titleLabel.setAttribute('for', 'title')
    const titleInput = _newTag('input', {
      type: 'text',
      id: 'title',
      required: true,
    })
    title.append(titleLabel, titleInput)

    // PRIORITY
    const priority = document.createElement('div')
    const priorityLabel = _newTag('label', { innerText: 'Priority' })
    priorityLabel.setAttribute('for', 'priority')
    const priorityInput = _newTag('select', { id: 'priority', required: true })
    const priorityValues = ['Maximum', 'High', 'Medium', 'Low']
    for (const i of priorityValues) {
      const option = _newTag('option', { innerText: i })
      priorityInput.append(option)
    }
    priority.append(priorityLabel, priorityInput)

    // DESCRIPTION
    const description = document.createElement('div')
    const descLabel = _newTag('label', { innerText: 'Description' })
    descLabel.setAttribute('for', 'description')
    const descInput = _newTag('textarea', { id: 'description', required: true })
    description.append(descLabel, descInput)

    // DUE DATE
    const dueDate = document.createElement('div')
    const dDateLabel = _newTag('label', { innerText: 'Due date' })
    dDateLabel.setAttribute('for', 'due-date')
    const dDateInput = _newTag('input', {
      type: 'date',
      id: 'due-date',
      value: format(add(new Date(), { months: 1 }), 'yyyy-MM-dd'),
      min: format(new Date(), 'yyyy-MM-dd'),
    })
    dueDate.append(dDateLabel, dDateInput)

    form.append(title, priority, description, dueDate)

    if (!Array.isArray(type)) {
      _openNewTgPanel(popupPanel, form)
    } else if (Array.isArray(type)) {
      _openNewTaskPanel(popupPanel, form, type[1])
    }

    popupPanel.append(form)

    pageWrap.append(popupPanel)

    // const submit = document.querySelector('#submit-button')
    form.addEventListener('submit', () => {
      _send(type)
    })
    const cancel = document.querySelector('#cancel-button')
    cancel.addEventListener('click', () => popupPanel.remove())
  }

  const _openNewTgPanel = function (popupPanel, form) {
    const panelInfo = _newTag('p', { innerText: 'Create Taskgroup' })
    popupPanel.insertAdjacentElement('afterbegin', panelInfo)
    const submit = _newTag('button', {
      type: 'submit',
      innerText: 'Create',
      id: 'submit-button',
    })
    const cancel = _newTag('button', {
      type: 'button',
      innerText: 'Cancel',
      id: 'cancel-button',
    })
    form.append(submit, cancel)
  }

  const _openNewTaskPanel = function (popupPanel, form, taskgroup) {
    const panelInfo = _newTag('p', {
      innerText: `Create Task for ${taskgroup}`,
    })
    popupPanel.insertAdjacentElement('afterbegin', panelInfo)

    const checkbox = document.createElement('div')
    const checkLabel = _newTag('label', { innerText: 'Checkbox' })
    checkLabel.setAttribute('for', 'if-checkbox')
    const checkOption = _newTag('input', {
      type: 'checkbox',
      id: 'if-checkbox',
    })

    const checkboxField = _newTag('div', { id: 'checkbox-fieldset' })
    checkboxField.classList.add('hidden')

    const fieldFieldset = document.createElement('fieldset')
    const fieldInfo = _newTag('legend', { innerText: 'Current Items' })
    fieldFieldset.append(fieldInfo)

    const newCheckDiv = document.createElement('div')
    const newCheckInput = _newTag('input', {
      type: 'text',
      id: 'checkbox-name',
    })
    const newCheckAdd = _newTag('button', {
      type: 'button',
      innerText: 'Add Checkbox',
    })
    newCheckAdd.addEventListener('click', () => {
      const checkboxName = newCheckInput.value
      const id = 'id' + Math.random().toString(16).slice(2)
      const newItem = document.createElement('div')
      const itemInput = _newTag('input', {
        type: 'checkbox',
        disabled: true,
        id,
      })
      const itemLabel = _newTag('label', { innerText: checkboxName })
      itemLabel.setAttribute('for', id)
      newItem.append(itemInput, itemLabel)
      fieldFieldset.append(newItem)
      newCheckInput.value = ''
    })

    newCheckDiv.append(newCheckInput, newCheckAdd)
    checkboxField.append(newCheckDiv, fieldFieldset)

    checkOption.addEventListener('click', () => {
      checkboxField.classList.toggle('hidden')
    })
    checkbox.append(checkOption, checkLabel, checkboxField)

    form.append(checkbox)

    const submit = _newTag('button', {
      type: 'submit',
      innerText: 'Add',
      id: 'submit-button',
    })
    const cancel = _newTag('button', {
      type: 'button',
      innerText: 'Cancel',
      id: 'cancel-button',
    })
    form.append(submit, cancel)
  }

  const _send = function (type) {
    const data = {}
    data.title = document.querySelector('#object-form #title').value
    data.priority = document.querySelector('#object-form #priority').value
    data.description = document.querySelector('#object-form #description').value
    data.dueDate = document.querySelector('#object-form #due-date').value
    data.type = type

    if (document.querySelector('#object-form #if-checkbox')) {
      const checkboxList = document.querySelectorAll(
        '#checkbox-fieldset > fieldset > div > label'
      )
      data.checkbox = {}
      for (const i of checkboxList) {
        data.checkbox[i.textContent] = false
      }
    }

    observer.publish('sentNewObjectData', data)
  }

  observer.subscribe('newObject', _createPopup)

  return {}
})()

export default object
