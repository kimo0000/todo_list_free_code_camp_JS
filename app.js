const inputText = document.querySelector('form input[type="text"]')
const form = document.querySelector('form')
const submitBtn = document.querySelector('.submit')
const content = document.querySelector('.content')
const result = document.querySelector('.result')
const clearAll = document.querySelector('.clear_all')
const alertItem = document.querySelector('.alert_item')

let editItem
let editFlag = false
let editId = ""

form.addEventListener('submit', addItems)
clearAll.addEventListener('click', clearItem)
window.addEventListener('DOMContentLoaded', setUpItem)


// Function AddItems
function addItems(e) {
   e.preventDefault()

   let value = inputText.value
   let id = Date.now()

   if(value && !editFlag) {
    createItem(id, value)

     content.classList.add('show')
     displayAlert('Item Added Succesefuly', "succes")
     setbackToDefault()
     addToLocalSorage(id, value)

   } else if(value && editFlag) {
      editItem.innerHTML = inputText.value
      displayAlert("Value Changed", "succes")
      editToLocalStorage(editId, value)
      setbackToDefault()
   } else {
      displayAlert('Please Enter Item', "danger")
   }

}

// Function Display Alert DIV
function displayAlert(text, action) {
    alertItem.innerHTML = text
    alertItem.classList.add(`${action}`)

    setTimeout(() => {
      alertItem.innerHTML = ""
      alertItem.classList.remove(`${action}`)
    }, 1000)
}

// Function Clear Item
function clearItem() {
// Methode One
   /*const items = document.querySelectorAll('.item')
   if(items.length > 0) {
      items.forEach(item => result.removeChild(item))
   }*/

// Methode Two
   result.innerHTML = ""

   content.classList.remove('show')
   displayAlert('List Is Empty', "danger")
   setbackToDefault()
   localStorage.clear()
}

// Function SrtBackToDefault
function setbackToDefault() {
   inputText.value = ""
   editFlag = false
   editId = ""
   submitBtn.innerHTML = "Submit"
}

// Function Delete Item
function deleteItems(e) {
    const el = e.target.parentElement.parentElement
    const id = el.dataset.id
// Methode One
    /*el.remove()*/

// Methode Two
    result.removeChild(el)
    displayAlert('Item Deleted', "danger")
    if(result.children.length === 0) {
      content.classList.remove("show")
    }

    removeFromLocalStoragre(id)
    setbackToDefault()
}

// Function Edit Item
function editItems(e) {
   const el = e.currentTarget.parentElement.parentElement
   editItem = e.currentTarget.parentElement.previousElementSibling
   inputText.value = editItem.innerHTML
   editFlag = true
   editId = el.dataset.id
   submitBtn.innerHTML = "Edit"
}

//***** Function Local Storage *****/
function addToLocalSorage(id, value) {
    let grocery = {id, value}
    let items = getLocalStorage()
    items.push(grocery)
    localStorage.setItem('list', JSON.stringify(items))
}

function removeFromLocalStoragre(id) {
  let items = getLocalStorage()
  items = items.filter(item => {
   if(item.id !== id) {
      return item
   }
  })
  localStorage.setItem('list', JSON.stringify(items))
}

function editToLocalStorage(id, value) {
   let items = getLocalStorage()
   items = items.map(item => {
      if(item.id == id) {
         item.value = value
      }
      console.log(item.id, id)
   return item
  })

   localStorage.setItem('list', JSON.stringify(items))
}

function getLocalStorage() {
   return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [] 
}

function setUpItem(id, value) {
   let items = getLocalStorage()
   if(items.length > 0) {
      items.forEach(item => createItem(item.id, item.value))
   }

   content.classList.add('show')
}

function createItem(id, value) {
   const element = document.createElement('article')
     element.classList.add('item')
     // Create Attribut
     element.setAttribute("data-id", id)
     element.innerHTML = `<p class="item_text">${value}</p>
                 <div class='icons'>
                   <i class="fa-solid fa-pen-to-square edit"></i>
                   <i class="fa-solid fa-trash-can delete"></i>
                 </div>`

// Get Edit BTN And Delete BTN
const deleteBtn = element.querySelector('.icons .delete')
const editBtn = element.querySelector('.icons .edit')

deleteBtn.addEventListener('click', deleteItems)
editBtn.addEventListener('click', editItems)

     result.appendChild(element)
}