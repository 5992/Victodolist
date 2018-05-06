class Task{
  id: number;
  name: string;
  status: boolean;
  constructor(taskname: string){
    this.id = new Date().getTime();
    this.name = taskname;
    this.status = false;
  }
}

class TaskManager{
  tasks : Array<Task>;
  constructor( array: Array<Task>){
  this.tasks = array;
  }
  add( task: Task ){
  this.tasks.push(task);
  console.log( this.tasks );
  }
}

class ListView{
  list:HTMLElement;
  constructor( listid:string ){
    this.list = document.getElementById( listid );
  }
  render( items:Array<Task> ){
    items.forEach((task) => {
      let id = task.id;
      let name = task.name;
      let status = task.status;
      let template = `<li id="${id}" data-status="${status}">
                      <div class="task-container">
                          <div class="task-name">${name}</div>
                      <div class="task-buttons">
                          <button type="button" data-function="status">&#x2714;</button>
                          <button type="button" data-function-"delete">&times;</button>
      </div>
      </div>
      <li>`;
      let fragment = document.createRange().createContextualFragment( template );
      this.list.appendChild(fragment);
    });
  }
  clear(){
    this.list.innerHTML ='';
  }
}

class DataStorage{
  storage;
  constructor(){
    this.storage = window.localStorage;
  }
  store( array:Array <Task> ){
    let data = JSON.stringify( array);
    this.storage.setItem('taskdata', data);
  }
  read(){
    let data = this.storage.getItem('taskdata');
    let array = JSON.parse(data);
    return array;
  }
}

//initialise
var taskarray:Array<any> = [];
var taskstorage = new DataStorage();
var taskmanager = new TaskManager(taskarray);
var listview = new ListView('task-list');

window.addEventListener('load', () => {
  let taskdata = taskstorage.read();

  taskdata.forEach((item) => {taskarray.push(item);});
  listview.render(taskarray);
});


//reference to form
const taskform = (<HTMLFormElement> document.getElementById('task-form'));

taskform.addEventListener('submit',( event: Event) => {
  event.preventDefault();
  const input = document.getElementById('task-input');
  let taskname = (<HTMLInputElement>input).value;
  taskform.reset();
  // console.log(taskname);
  let task = new Task( taskname );
  taskmanager.add( task );
  listview.clear();
  taskstorage.store(taskarray);
  listview.render(taskarray);
});
