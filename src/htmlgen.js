const page = (function () {
  //   const main = document.querySelector('#main-container')
  const deck = document.querySelector('#deck')

  const attach = function (data) {
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      const taskgroup = document.createElement('ul')
      taskgroup.textContent = data[i].info.read('title')
      taskgroup.addEventListener('click', _render)
      const tasks = data[i].getTasks()
      for (const task in tasks) {
        const taskLi = document.createElement('li')
        taskLi.textContent = tasks[task].info.read('title')
        // taskLi.addEventListener('click', _render)
        taskgroup.append(taskLi)
      }
      deck.append(taskgroup)
    }
  }

  const _render = function (event) {
    console.log(event.path[0])
    console.log(event.path[0] === this) // select taskgroup(true) or task(false)?
  }

  return { attach }
})()

export default page
