import { Task } from '../ts/task';

export class DataStorage{
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
