import { Task } from '../ts/task';

export class ListView{
    list:HTMLElement;
    constructor( listid:string ){
        this.list = document.getElementById( listid );
    }
    render( items:Array<Task> ){
        items.forEach((task) => {
            let id = task.id;
            let name = task.name;
            let status = task.status.toString();
            let template = `<li id="${id}" data-status="${status}" class="parent">
                            <div class="task-container">
                                <div class="task-name">${name}</div>
                            <div class="task-buttons">
                                <button type="button" class="child" id='canceledit' data-function="canceledit">Cancel Edit</button>
                                <button type="button" data-function="edit">&#9998;</button>
                                <button type="button" data-function="status">&#x2714;</button>
                                <button type="button" data-function="delete">&times;</button>
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
