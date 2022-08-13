const storage = (function () {
  const saveData = function (data) {
    localStorage.setItem('deck', JSON.stringify(data))
  }

  const fetchData = function () {
    const data = JSON.parse(localStorage.getItem('deck'))
    return data
  }

  return { saveData, fetchData }
})()

export default storage
