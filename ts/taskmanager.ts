import { Task } from '../ts/task';

export class TaskManager{
  tasks : Array<Task>;

  constructor( array: Array<Task>){
    this.tasks = array;
  }

  add( task: Task ){
    this.tasks.push(task);
    console.log( this.tasks );
  }
}
