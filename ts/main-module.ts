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

  console.log(id);
  //we have some buttons = check which one we clicked
  //when edit button clicked
  if ( target.getAttribute('data-function') == 'edit'){

    //focus on input and disable add task button
    const input = document.getElementById('task-input');
    const add = document.getElementById('task-add');
    input.focus();
    (<HTMLInputElement>input).placeholder = 'Edit task name here'; // change the placeholder text
    (<HTMLInputElement>add).disabled = true;

    if( id ){
      //make cancel button enable
        const li = document.getElementById(id);
        const cancel = li.getElementsByClassName("child")[0];

        (<HTMLInputElement>cancel).style.visibility = "visible";
        //(<HTMLInputElement>cancel).style.opacity = "100";

      let newname = (<HTMLInputElement>input).value;
      if(newname.length > 0){
        taskmanager.edit(id, newname, () => {
          taskstorage.store( taskarray, () => {
            // enable the add button
            (<HTMLInputElement>add).disabled = false;
            (<HTMLInputElement>input).placeholder = '+ Add a task';
            //hide the cancel edit button after finish edit stage
            (<HTMLInputElement>cancel).style.visibility = "hidden";
            taskform.reset(); //clear input text field
            listview.clear();
            listview.render( taskarray );
          });
        });
      }
    }
  }

  if ( target.getAttribute('data-function') == 'canceledit'){
    //cancel edit state
    const add = document.getElementById('task-add');
    const input = document.getElementById('task-input');
    (<HTMLInputElement>add).disabled = false;
    (<HTMLInputElement>input).placeholder = '+ Add a task';

    //hide the cancel button
    const cancel = document.getElementById('canceledit');
    (<HTMLInputElement>cancel).style.visibility = "hidden";

    taskform.reset();
    listview.clear();
    listview.render( taskarray );
  }

  if ( target.getAttribute('data-function') == 'status'){//status button get clicked
    if( id ){
      taskmanager.changeStatus( id, () =>{//callback tell the system change status when status changed
        taskstorage.store( taskarray, () => {
          //cancel edit state
          const add = document.getElementById('task-add');
          const input = document.getElementById('task-input');
          (<HTMLInputElement>add).disabled = false;
          (<HTMLInputElement>input).placeholder = '+ Add a task';

          //hide the cancel button
          const cancel = document.getElementById('canceledit');
          (<HTMLInputElement>cancel).style.visibility = "hidden";
          taskform.reset();
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
          //cancel edit state
          const add = document.getElementById('task-add');
          const input = document.getElementById('task-input');
          (<HTMLInputElement>add).disabled = false;
          (<HTMLInputElement>input).placeholder = '+ Add a task';

          //hide the cancel button
          const cancel = document.getElementById('canceledit');
          (<HTMLInputElement>cancel).style.visibility = "hidden";
          taskform.reset();
          listview.clear();
          listview.render( taskarray );
        });
      });
    }
  }
});
