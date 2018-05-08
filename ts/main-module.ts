import { ListView } from '../ts/listview';
import { Task } from '../ts/task';
import { TaskManager } from '../ts/taskmanager';
import { DataStorage } from '../ts/datastorage';

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
