import { Task } from '../ts/task';


export class TaskManager {
  tasks: Array<Task>;

  constructor( array: Array<Task>){
    this.tasks = array;
  }
  add( task: Task ){
    this.tasks.push(task);
    this.sort( this.tasks );
  }
  changeStatus( id:String, callback ):void{
  this.tasks.forEach((task:Task) => {
      if(task.id == id){
          console.log( task.id );
          if(task.status == false ){
              task.status = true;
          }
          else{
              task.status = false;
          }
      }
  });
  callback();
  }
  delete( id:string, callback ){
    let index_to_remove: number = undefined;
    this.tasks.forEach( (item: Task, index: number) => {
      if (item.id == id ){
        index_to_remove = index;
      }
    });
    //delete item with specified index
    if ( index_to_remove !== undefined ){
      this.tasks.splice (index_to_remove, 1);
    }
    this.sort( this.tasks );
    callback();
  }
  sort( tasks: Array<Task>){
    tasks.sort((task1, task2) => {
      if ( task1.status == true && task2.status == false){
        return 1;
      }
      if ( task1.status == false && task2.status == true){
        return -1;
      }
      if ( task1.status == task2.status ){
        return 0;
      }
    })
  }
}
