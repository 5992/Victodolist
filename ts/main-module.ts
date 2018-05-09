import { ListView } from '../ts/listview';
import { Task } from '../ts/task';
import { TaskManager } from '../ts/taskmanager';
import { DataStorage } from '../ts/datastorage';

//initialise
var taskarray:Array<any> = [];
var taskstorage = new DataStorage();
var taskmanager = new TaskManager(taskarray);
var listview = new ListView('task-list');


//click button, event call this function to find id of button if have
function getParentId(elm:Node){
  //loop element to find the id using while
  while(elm.parentNode){
    elm = elm.parentNode;
    let id:string = (<HTMLElement> elm).getAttribute('id');
    if( id ){
      return id;
    }
  }
  return null;
}


//app loads - show list of tasks storing in storage
window.addEventListener('load', () => {
   let taskdata = taskstorage.read( (data) => {
     if (data.length > 0){
       data.forEach( (item) => {
         taskarray.push(item);
       });
       listview.clear();
       listview.render( taskarray );
     }
   });
});




//reference to form
const taskform = (<HTMLFormElement> document.getElementById('task-form'));
taskform.addEventListener('submit',( event: Event) => {
  event.preventDefault();
const input = document.getElementById('task-input');
  let taskname = (<HTMLInputElement>input).value;
    taskform.reset();
 // console.log(taskname);

    if (taskname.length > 0){
      let task = new Task( taskname );
      taskmanager.add( task );
      listview.clear();

      taskstorage.store(taskarray, (result) => {
        if(result){
          taskform.reset();
          listview.clear();
          //listview.render(taskarray);
        }
        else{
          //error to do with storage
        }
      });
        listview.render(taskarray);
    }

});



const listelement:HTMLElement = document.getElementById('task-list');
listelement.addEventListener('click', ( event: Event) => {
  let target:HTMLElement = <HTMLElement> event.target;
  //find a way to get li element cause button inside <li>
  let id = getParentId( <Node> event.target);
  //we have some buttons = check which one we clicked

  //when edit button clicked
  if ( target.getAttribute('data-function') == 'edit'){
    const input = document.getElementById('task-input');
    input.focus();
    (<HTMLInputElement>input).placeholder = 'Edit task name here';

    if( id ){
      const input = document.getElementById('task-input');
      let newname = (<HTMLInputElement>input).value;
      if(newname.length > 0){
        taskmanager.edit(id, newname, () => {
          taskstorage.store( taskarray, () => {
            (<HTMLInputElement>input).placeholder = '+ Add a task';
            taskform.reset(); //clear input text field
            listview.clear();
            listview.render( taskarray );
          });
        });
      }
    }
  }

  if ( target.getAttribute('data-function') == 'status'){//status button get clicked
    if( id ){
      taskmanager.changeStatus( id, () => {//callback tell the system change status when status changed
        taskstorage.store( taskarray, () => {
          listview.clear();
          listview.render( taskarray );
        });
      });
    }
  }
  if (target.getAttribute('data-function') == 'delete'){
    if( id ){
      taskmanager.delete( id, () => {
        taskstorage.store(taskarray,()=>{
          listview.clear();
          listview.render( taskarray );
        });
      });
    }
  }
});
