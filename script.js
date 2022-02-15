class Model {
  constructor(){
    // data
    this.tasks = [
      {id:1, text: 'Be good', complete: false},
      {id:2, text: 'Be nice', complete: false}
    ]
  }

  addTask(taskText){
    //create ID
    let id
    if(this.tasks.length > 0){
      id = this.tasks[this.tasks.length - 1].id + 1
    } else {
      id = 1
    }

    //create task object
    const task = {
      id: id,
      text: taskText,
      complete: false
    }

    // add task to tasks data structure
    this.tasks.push(task)

    // init view if datastructure is changed
    this.ifTaskListChanged(this.tasks)
  }

  TaskListChanged(callback){
    this.ifTaskListChanged = callback
  }
}

class View {
  constructor(){
    // basic view
    // root element
    this.app = this.getElement('#root')
    // title
    this.title = this.setElement('h1')
    this.title.textContent = 'Tasks'
    //form with text input and submit button
    this.form = this.setElement('form')

    this.input = this.setElement('input')
    this.input.type = 'text'
    this.input.placeholder = 'Add task'
    this.submitButton = this.setElement('button')
    this.submitButton.textContent = 'Add'
    this.form.append(this.input, this.submitButton)

    // task list
    this.taskList = this.setElement('ul')
    // append title and task list to app
    this.app.append(this.title, this.form, this.taskList)
  }

  // display tasks
  displayTasks(tasks){
    //delete old displayed tasks
    while(this.taskList.firstChild){
      this.taskList.removeChild(this.taskList.firstChild)
    }
    // display new data
    if(tasks.length === 0){
      const p = this.setElement('p')
      p.textContent = 'Add a task if is nothing to do'
      this.taskList.append(p)
    } else {
      tasks.forEach(task => {
      // create li
      const li = this.setElement('li')
      // set li id according to model data id
      li.id = task.id
      // task item complete toggle check
      const checkbox = this.setElement('input')
      checkbox.type = 'checkbox'
      checkbox.cheked = task.complete
      // text span
      const span = this.setElement('span')
      // if task item is complete - strike trough
      if(task.complete === true){
        const strike = this.setElement('s')
        strike.textContent = task.text
        span.append(strike)
      } else {
        span.textContent = task.text
      }
      // delete button
      const deleteButton = this.setElement('button', 'delete')
      deleteButton.textContent = 'Delete'
      // appned checkbox and span to li
      li.append(checkbox, span, deleteButton)
      // append created li to task list
      this.taskList.append(li)
    })
    }
  }


  addTask(handler){
    this.form.addEventListener('submit', event => {
      event.preventDefault()
      console.log(event.type)
      if(this.input.value !== ''){
        handler(this.input.value)
        this.input.value = ''
      }
    })
  }




  // getters
  getElement(selector){
    const element = document.querySelector(selector)
    return element
  }

  // setters
  setElement(tag, classname){
    const element = document.createElement(tag)
    if(classname !== undefined){
      element.classList.add(classname)
    }
    return element
  }
}

class Controller {
  constructor(model, view){
    this.model = model
    this.view = view

    // update view
    this.model.TaskListChanged(this.displayTasks)
    
    // submit event on view
    this.view.addTask(this.handleAddTask)

    this.displayTasks(this.model.tasks)
  }

  displayTasks = tasks => {
    this.view.displayTasks(tasks)
  }

  handleAddTask = taskText => {
    this.model.addTask(taskText)
  }
}

const app = new Controller(new Model(), new View())
