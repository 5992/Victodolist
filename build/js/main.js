(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var DataStorage = /** @class */ (function () {
    function DataStorage() {
        this.storage = window.localStorage;
    }
    DataStorage.prototype.store = function (array, callback) {
        var data = JSON.stringify(array);
        var storestatus = this.storage.setItem('taskdata', data); //successful
        if (storestatus) {
            callback(true);
        }
        else {
            callback(false);
        }
    };
    DataStorage.prototype.read = function (callback) {
        var data = this.storage.getItem('taskdata');
        var array = JSON.parse(data);
        callback(array);
    };
    return DataStorage;
}());
exports.DataStorage = DataStorage;
},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/*
export class ListView{
  list: HTMLElement;
  constructor( listid: string ){
    this.list = document.getElementById('task-list');
  }
  clear(){
    this.list.innerHTML = '';
  }
  render( items:Array<Task> ){
    //clear the view
    //render array using template
    items.forEach( (task) => {
    let id= task.id;
    let name = task.name;
    let status = task.status.toString();
    let item = template.populate(id,name,status);
    // convert our string to HTML Node
    let fragment = document.createRange().createContextualFragment(item);
    this.list.appendChild( fragment );
    });
  }
}*/
var ListView = /** @class */ (function () {
    function ListView(listid) {
        this.list = document.getElementById(listid);
    }
    ListView.prototype.render = function (items) {
        var _this = this;
        items.forEach(function (task) {
            var id = task.id;
            var name = task.name;
            var status = task.status.toString();
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\">\n                            <div class=\"task-container\">\n                                <div class=\"task-name\">" + name + "</div>\n                            <div class=\"task-buttons\">\n                                <button type=\"button\" data-function=\"edit\">&#9998;</button>\n                                <button type=\"button\" data-function=\"status\">&#x2714;</button>\n                                <button type=\"button\" data-function=\"delete\">&times;</button>\n\n            </div>\n            </div>\n            <li>";
            var fragment = document.createRange().createContextualFragment(template);
            _this.list.appendChild(fragment);
        });
    };
    ListView.prototype.clear = function () {
        this.list.innerHTML = '';
    };
    return ListView;
}());
exports.ListView = ListView;
},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var listview_1 = require("../ts/listview");
var task_1 = require("../ts/task");
var taskmanager_1 = require("../ts/taskmanager");
var datastorage_1 = require("../ts/datastorage");
//initialise
var taskarray = [];
var taskstorage = new datastorage_1.DataStorage();
var taskmanager = new taskmanager_1.TaskManager(taskarray);
var listview = new listview_1.ListView('task-list');
//click button, event call this function to find id of button if have
function getParentId(elm) {
    //loop element to find the id using while
    while (elm.parentNode) {
        elm = elm.parentNode;
        var id = elm.getAttribute('id');
        if (id) {
            return id;
        }
    }
    return null;
}
//app loads - show list of tasks storing in storage
window.addEventListener('load', function () {
    var taskdata = taskstorage.read(function (data) {
        if (data.length > 0) {
            data.forEach(function (item) {
                taskarray.push(item);
            });
            listview.clear();
            listview.render(taskarray);
        }
    });
});
//reference to form
var taskform = document.getElementById('task-form');
taskform.addEventListener('submit', function (event) {
    event.preventDefault();
    var input = document.getElementById('task-input');
    var taskname = input.value;
    taskform.reset();
    // console.log(taskname);
    if (taskname.length > 0) {
        var task = new task_1.Task(taskname);
        taskmanager.add(task);
        listview.clear();
        taskstorage.store(taskarray, function (result) {
            if (result) {
                taskform.reset();
                listview.clear();
                //listview.render(taskarray);
            }
            else {
                //error to do with storage
            }
        });
        listview.render(taskarray);
    }
});
var listelement = document.getElementById('task-list');
listelement.addEventListener('click', function (event) {
    var target = event.target;
    //find a way to get li element cause button inside <li>
    var id = getParentId(event.target);
    //we have some buttons = check which one we clicked
    //when edit button clicked
    if (target.getAttribute('data-function') == 'edit') {
        var input_1 = document.getElementById('task-input');
        var add_1 = document.getElementById('task-add');
        input_1.focus();
        input_1.placeholder = 'Edit task name here';
        add_1.disabled = true;
        add_1.innerHTML = 'Add disabled';
        //console.log(event.target);
        //document.getElementById('task-add').;
        if (id) {
            var newname = input_1.value;
            if (newname.length > 0) {
                taskmanager.edit(id, newname, function () {
                    taskstorage.store(taskarray, function () {
                        add_1.disabled = false;
                        input_1.placeholder = '+ Add a task';
                        add_1.innerHTML = 'Add';
                        taskform.reset(); //clear input text field
                        listview.clear();
                        listview.render(taskarray);
                    });
                });
            }
        }
    }
    if (target.getAttribute('data-function') == 'status') { //status button get clicked
        if (id) {
            taskmanager.changeStatus(id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
            });
        }
    }
    if (target.getAttribute('data-function') == 'delete') {
        if (id) {
            taskmanager["delete"](id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
            });
        }
    }
});
},{"../ts/datastorage":1,"../ts/listview":2,"../ts/task":4,"../ts/taskmanager":5}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Task = /** @class */ (function () {
    function Task(taskname) {
        this.id = new Date().getTime().toString();
        this.name = taskname;
        this.status = false;
    }
    return Task;
}());
exports.Task = Task;
},{}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var TaskManager = /** @class */ (function () {
    function TaskManager(array) {
        this.tasks = array;
    }
    TaskManager.prototype.add = function (task) {
        this.tasks.push(task);
        this.sort(this.tasks);
    };
    TaskManager.prototype.edit = function (id, newname, callback) {
        this.tasks.forEach(function (task) {
            if (task.id == id) {
                task.name = newname;
            }
        });
        callback();
    };
    TaskManager.prototype.getName = function (id, callback) {
        this.tasks.forEach(function (task) {
            if (task.id == id) {
                return task.name;
            }
        });
        callback();
    };
    TaskManager.prototype.changeStatus = function (id, callback) {
        this.tasks.forEach(function (task) {
            if (task.id == id) {
                console.log(task.id);
                if (task.status == false) {
                    task.status = true;
                }
                else {
                    task.status = false;
                }
            }
        });
        callback();
    };
    TaskManager.prototype["delete"] = function (id, callback) {
        var index_to_remove = undefined;
        this.tasks.forEach(function (item, index) {
            if (item.id == id) {
                index_to_remove = index;
            }
        });
        //delete item with specified index
        if (index_to_remove !== undefined) {
            this.tasks.splice(index_to_remove, 1);
        }
        this.sort(this.tasks);
        callback();
    };
    TaskManager.prototype.sort = function (tasks) {
        tasks.sort(function (task1, task2) {
            if (task1.status == true && task2.status == false) {
                return 1;
            }
            if (task1.status == false && task2.status == true) {
                return -1;
            }
            if (task1.status == task2.status) {
                return 0;
            }
        });
    };
    return TaskManager;
}());
exports.TaskManager = TaskManager;
},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBO0lBRUU7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdkMsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZO1FBQ3RFLElBQUssV0FBVyxFQUFFO1lBQ2pCLFFBQVEsQ0FBRSxJQUFJLENBQUUsQ0FBQztTQUNqQjthQUNJO1lBQ0gsUUFBUSxDQUFFLEtBQUssQ0FBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUNELDBCQUFJLEdBQUosVUFBTSxRQUFRO1FBQ1YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUMvQixRQUFRLENBQUUsS0FBSyxDQUFFLENBQUM7SUFDdEIsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FwQkEsQUFvQkMsSUFBQTtBQXBCWSxrQ0FBVzs7OztBQ0R4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUVIO0lBRUksa0JBQWEsTUFBYTtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUUsTUFBTSxDQUFFLENBQUM7SUFDbEQsQ0FB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O0lBQ0QsMEJBQUksR0FBSixVQUFNLEtBQWtCO1FBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFLLEVBQUUsS0FBSztZQUN0QixJQUFLLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFDO2dCQUNqRCxPQUFPLENBQUMsQ0FBQzthQUNWO1lBQ0QsSUFBSyxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksRUFBQztnQkFDakQsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUNYO1lBQ0QsSUFBSyxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ2pDLE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7UUFDSCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDSCxrQkFBQztBQUFELENBbkVBLEFBbUVDLElBQUE7QUFuRVksa0NBQVciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcblxyXG5leHBvcnQgY2xhc3MgRGF0YVN0b3JhZ2V7XHJcbiAgc3RvcmFnZTtcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICB0aGlzLnN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xyXG4gIH1cclxuICBzdG9yZSggYXJyYXk6QXJyYXkgPFRhc2s+LCBjYWxsYmFjayApe1xyXG4gICAgbGV0IGRhdGEgPSBKU09OLnN0cmluZ2lmeSggYXJyYXkpO1xyXG4gICAgbGV0IHN0b3Jlc3RhdHVzID0gdGhpcy5zdG9yYWdlLnNldEl0ZW0oJ3Rhc2tkYXRhJywgZGF0YSk7IC8vc3VjY2Vzc2Z1bFxyXG4gICAgaWYgKCBzdG9yZXN0YXR1cyApe1xyXG4gICAgIGNhbGxiYWNrKCB0cnVlICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY2FsbGJhY2soIGZhbHNlICk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlYWQoIGNhbGxiYWNrICl7XHJcbiAgICAgIGxldCBkYXRhID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0oJ3Rhc2tkYXRhJyk7XHJcbiAgICAgIGxldCBhcnJheSA9IEpTT04ucGFyc2UoIGRhdGEgKTtcclxuICAgICAgY2FsbGJhY2soIGFycmF5ICk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuLi90cy90YXNrJztcclxuLypcclxuZXhwb3J0IGNsYXNzIExpc3RWaWV3e1xyXG4gIGxpc3Q6IEhUTUxFbGVtZW50O1xyXG4gIGNvbnN0cnVjdG9yKCBsaXN0aWQ6IHN0cmluZyApe1xyXG4gICAgdGhpcy5saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stbGlzdCcpO1xyXG4gIH1cclxuICBjbGVhcigpe1xyXG4gICAgdGhpcy5saXN0LmlubmVySFRNTCA9ICcnO1xyXG4gIH1cclxuICByZW5kZXIoIGl0ZW1zOkFycmF5PFRhc2s+ICl7XHJcbiAgICAvL2NsZWFyIHRoZSB2aWV3XHJcbiAgICAvL3JlbmRlciBhcnJheSB1c2luZyB0ZW1wbGF0ZVxyXG4gICAgaXRlbXMuZm9yRWFjaCggKHRhc2spID0+IHtcclxuICAgIGxldCBpZD0gdGFzay5pZDtcclxuICAgIGxldCBuYW1lID0gdGFzay5uYW1lO1xyXG4gICAgbGV0IHN0YXR1cyA9IHRhc2suc3RhdHVzLnRvU3RyaW5nKCk7XHJcbiAgICBsZXQgaXRlbSA9IHRlbXBsYXRlLnBvcHVsYXRlKGlkLG5hbWUsc3RhdHVzKTtcclxuICAgIC8vIGNvbnZlcnQgb3VyIHN0cmluZyB0byBIVE1MIE5vZGVcclxuICAgIGxldCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KGl0ZW0pO1xyXG4gICAgdGhpcy5saXN0LmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59Ki9cclxuXHJcbmV4cG9ydCBjbGFzcyBMaXN0Vmlld3tcclxuICAgIGxpc3Q6SFRNTEVsZW1lbnQ7XHJcbiAgICBjb25zdHJ1Y3RvciggbGlzdGlkOnN0cmluZyApe1xyXG4gICAgICAgIHRoaXMubGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBsaXN0aWQgKTtcclxuICAgIH1cclxuICAgIHJlbmRlciggaXRlbXM6QXJyYXk8VGFzaz4gKXtcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKCh0YXNrKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRhc2suaWQ7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gdGFzay5uYW1lO1xyXG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gdGFzay5zdGF0dXMudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gYDxsaSBpZD1cIiR7aWR9XCIgZGF0YS1zdGF0dXM9XCIke3N0YXR1c31cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLW5hbWVcIj4ke25hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1idXR0b25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cImVkaXRcIj4mIzk5OTg7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cInN0YXR1c1wiPiYjeDI3MTQ7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cImRlbGV0ZVwiPiZ0aW1lczs8L2J1dHRvbj5cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGxpPmA7XHJcbiAgICAgICAgICAgIGxldCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCB0ZW1wbGF0ZSApO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2xlYXIoKXtcclxuICAgICAgICB0aGlzLmxpc3QuaW5uZXJIVE1MID0nJztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBMaXN0VmlldyB9IGZyb20gJy4uL3RzL2xpc3R2aWV3JztcclxuaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5pbXBvcnQgeyBUYXNrTWFuYWdlciB9IGZyb20gJy4uL3RzL3Rhc2ttYW5hZ2VyJztcclxuaW1wb3J0IHsgRGF0YVN0b3JhZ2UgfSBmcm9tICcuLi90cy9kYXRhc3RvcmFnZSc7XHJcblxyXG4vL2luaXRpYWxpc2VcclxudmFyIHRhc2thcnJheTpBcnJheTxhbnk+ID0gW107XHJcbnZhciB0YXNrc3RvcmFnZSA9IG5ldyBEYXRhU3RvcmFnZSgpO1xyXG52YXIgdGFza21hbmFnZXIgPSBuZXcgVGFza01hbmFnZXIodGFza2FycmF5KTtcclxudmFyIGxpc3R2aWV3ID0gbmV3IExpc3RWaWV3KCd0YXNrLWxpc3QnKTtcclxuXHJcblxyXG4vL2NsaWNrIGJ1dHRvbiwgZXZlbnQgY2FsbCB0aGlzIGZ1bmN0aW9uIHRvIGZpbmQgaWQgb2YgYnV0dG9uIGlmIGhhdmVcclxuZnVuY3Rpb24gZ2V0UGFyZW50SWQoZWxtOk5vZGUpe1xyXG4gIC8vbG9vcCBlbGVtZW50IHRvIGZpbmQgdGhlIGlkIHVzaW5nIHdoaWxlXHJcbiAgd2hpbGUoZWxtLnBhcmVudE5vZGUpe1xyXG4gICAgZWxtID0gZWxtLnBhcmVudE5vZGU7XHJcbiAgICBsZXQgaWQ6c3RyaW5nID0gKDxIVE1MRWxlbWVudD4gZWxtKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICBpZiggaWQgKXtcclxuICAgICAgcmV0dXJuIGlkO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbi8vYXBwIGxvYWRzIC0gc2hvdyBsaXN0IG9mIHRhc2tzIHN0b3JpbmcgaW4gc3RvcmFnZVxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgbGV0IHRhc2tkYXRhID0gdGFza3N0b3JhZ2UucmVhZCggKGRhdGEpID0+IHtcclxuICAgICBpZiAoZGF0YS5sZW5ndGggPiAwKXtcclxuICAgICAgIGRhdGEuZm9yRWFjaCggKGl0ZW0pID0+IHtcclxuICAgICAgICAgdGFza2FycmF5LnB1c2goaXRlbSk7XHJcbiAgICAgICB9KTtcclxuICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XHJcbiAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xyXG4gICAgIH1cclxuICAgfSk7XHJcbn0pO1xyXG5cclxuXHJcblxyXG5cclxuLy9yZWZlcmVuY2UgdG8gZm9ybVxyXG5jb25zdCB0YXNrZm9ybSA9ICg8SFRNTEZvcm1FbGVtZW50PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1mb3JtJykpO1xyXG50YXNrZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCggZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xyXG4gIGxldCB0YXNrbmFtZSA9ICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkudmFsdWU7XHJcbiAgICB0YXNrZm9ybS5yZXNldCgpO1xyXG4gLy8gY29uc29sZS5sb2codGFza25hbWUpO1xyXG5cclxuICAgIGlmICh0YXNrbmFtZS5sZW5ndGggPiAwKXtcclxuICAgICAgbGV0IHRhc2sgPSBuZXcgVGFzayggdGFza25hbWUgKTtcclxuICAgICAgdGFza21hbmFnZXIuYWRkKCB0YXNrICk7XHJcbiAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XHJcblxyXG4gICAgICB0YXNrc3RvcmFnZS5zdG9yZSh0YXNrYXJyYXksIChyZXN1bHQpID0+IHtcclxuICAgICAgICBpZihyZXN1bHQpe1xyXG4gICAgICAgICAgdGFza2Zvcm0ucmVzZXQoKTtcclxuICAgICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XHJcbiAgICAgICAgICAvL2xpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgLy9lcnJvciB0byBkbyB3aXRoIHN0b3JhZ2VcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAgIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5cclxuXHJcbmNvbnN0IGxpc3RlbGVtZW50OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stbGlzdCcpO1xyXG5saXN0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICggZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgbGV0IHRhcmdldDpIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD4gZXZlbnQudGFyZ2V0O1xyXG4gIC8vZmluZCBhIHdheSB0byBnZXQgbGkgZWxlbWVudCBjYXVzZSBidXR0b24gaW5zaWRlIDxsaT5cclxuICBsZXQgaWQgPSBnZXRQYXJlbnRJZCggPE5vZGU+IGV2ZW50LnRhcmdldCk7XHJcbiAgLy93ZSBoYXZlIHNvbWUgYnV0dG9ucyA9IGNoZWNrIHdoaWNoIG9uZSB3ZSBjbGlja2VkXHJcblxyXG4gIC8vd2hlbiBlZGl0IGJ1dHRvbiBjbGlja2VkXHJcbiAgaWYgKCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZ1bmN0aW9uJykgPT0gJ2VkaXQnKXtcclxuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcclxuICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWFkZCcpO1xyXG4gICAgaW5wdXQuZm9jdXMoKTtcclxuICAgICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkucGxhY2Vob2xkZXIgPSAnRWRpdCB0YXNrIG5hbWUgaGVyZSc7XHJcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+YWRkKS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+YWRkKS5pbm5lckhUTUwgPSAnQWRkIGRpc2FibGVkJztcclxuICAgIC8vY29uc29sZS5sb2coZXZlbnQudGFyZ2V0KTtcclxuICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stYWRkJykuO1xyXG4gICAgaWYoIGlkICl7XHJcbiAgICAgIGxldCBuZXduYW1lID0gKDxIVE1MSW5wdXRFbGVtZW50PmlucHV0KS52YWx1ZTtcclxuICAgICAgaWYobmV3bmFtZS5sZW5ndGggPiAwKXtcclxuICAgICAgICB0YXNrbWFuYWdlci5lZGl0KGlkLCBuZXduYW1lLCAoKSA9PiB7XHJcbiAgICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSggdGFza2FycmF5LCAoKSA9PiB7XHJcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5hZGQpLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkucGxhY2Vob2xkZXIgPSAnKyBBZGQgYSB0YXNrJztcclxuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmFkZCkuaW5uZXJIVE1MID0gJ0FkZCc7XHJcbiAgICAgICAgICAgIHRhc2tmb3JtLnJlc2V0KCk7IC8vY2xlYXIgaW5wdXQgdGV4dCBmaWVsZFxyXG4gICAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICggdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpID09ICdzdGF0dXMnKXsvL3N0YXR1cyBidXR0b24gZ2V0IGNsaWNrZWRcclxuICAgIGlmKCBpZCApe1xyXG4gICAgICB0YXNrbWFuYWdlci5jaGFuZ2VTdGF0dXMoIGlkLCAoKSA9PiB7Ly9jYWxsYmFjayB0ZWxsIHRoZSBzeXN0ZW0gY2hhbmdlIHN0YXR1cyB3aGVuIHN0YXR1cyBjaGFuZ2VkXHJcbiAgICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUoIHRhc2thcnJheSwgKCkgPT4ge1xyXG4gICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpID09ICdkZWxldGUnKXtcclxuICAgIGlmKCBpZCApe1xyXG4gICAgICB0YXNrbWFuYWdlci5kZWxldGUoIGlkLCAoKSA9PiB7XHJcbiAgICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCgpPT57XHJcbiAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuIiwiZXhwb3J0IGNsYXNzIFRhc2t7XHJcbiAgaWQ6IHN0cmluZztcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgc3RhdHVzOiBib29sZWFuO1xyXG4gIGNvbnN0cnVjdG9yKHRhc2tuYW1lOiBzdHJpbmcpe1xyXG4gICAgdGhpcy5pZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKCk7XHJcbiAgICB0aGlzLm5hbWUgPSB0YXNrbmFtZTtcclxuICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuLi90cy90YXNrJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVGFza01hbmFnZXIge1xyXG4gIHRhc2tzOiBBcnJheTxUYXNrPjtcclxuXHJcbiAgY29uc3RydWN0b3IoIGFycmF5OiBBcnJheTxUYXNrPil7XHJcbiAgICB0aGlzLnRhc2tzID0gYXJyYXk7XHJcbiAgfVxyXG4gIGFkZCggdGFzazogVGFzayApe1xyXG4gICAgdGhpcy50YXNrcy5wdXNoKHRhc2spO1xyXG4gICAgdGhpcy5zb3J0KCB0aGlzLnRhc2tzICk7XHJcbiAgfVxyXG4gIGVkaXQoIGlkOlN0cmluZywgbmV3bmFtZTpzdHJpbmcsY2FsbGJhY2spOnZvaWR7XHJcbiAgICB0aGlzLnRhc2tzLmZvckVhY2goKHRhc2s6VGFzaykgPT4ge1xyXG4gICAgICBpZih0YXNrLmlkID09IGlkKXtcclxuICAgICAgICB0YXNrLm5hbWUgPSBuZXduYW1lO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNhbGxiYWNrKCk7XHJcbiAgfVxyXG4gIGdldE5hbWUoaWQ6IFN0cmluZywgY2FsbGJhY2spe1xyXG4gICAgdGhpcy50YXNrcy5mb3JFYWNoKCh0YXNrOlRhc2spID0+IHtcclxuICAgICAgaWYodGFzay5pZCA9PSBpZCl7XHJcbiAgICAgICAgcmV0dXJuIHRhc2submFtZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjYWxsYmFjaygpO1xyXG4gIH1cclxuICBjaGFuZ2VTdGF0dXMoIGlkOlN0cmluZywgY2FsbGJhY2sgKTp2b2lke1xyXG4gIHRoaXMudGFza3MuZm9yRWFjaCgodGFzazpUYXNrKSA9PiB7XHJcbiAgICAgIGlmKHRhc2suaWQgPT0gaWQpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIHRhc2suaWQgKTtcclxuICAgICAgICAgIGlmKHRhc2suc3RhdHVzID09IGZhbHNlICl7XHJcbiAgICAgICAgICAgICAgdGFzay5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICB0YXNrLnN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgfSk7XHJcbiAgY2FsbGJhY2soKTtcclxuICB9XHJcbiAgZGVsZXRlKCBpZDpzdHJpbmcsIGNhbGxiYWNrICl7XHJcbiAgICBsZXQgaW5kZXhfdG9fcmVtb3ZlOiBudW1iZXIgPSB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLnRhc2tzLmZvckVhY2goIChpdGVtOiBUYXNrLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLmlkID09IGlkICl7XHJcbiAgICAgICAgaW5kZXhfdG9fcmVtb3ZlID0gaW5kZXg7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy9kZWxldGUgaXRlbSB3aXRoIHNwZWNpZmllZCBpbmRleFxyXG4gICAgaWYgKCBpbmRleF90b19yZW1vdmUgIT09IHVuZGVmaW5lZCApe1xyXG4gICAgICB0aGlzLnRhc2tzLnNwbGljZSAoaW5kZXhfdG9fcmVtb3ZlLCAxKTtcclxuICAgIH1cclxuICAgIHRoaXMuc29ydCggdGhpcy50YXNrcyApO1xyXG4gICAgY2FsbGJhY2soKTtcclxuICB9XHJcbiAgc29ydCggdGFza3M6IEFycmF5PFRhc2s+KXtcclxuICAgIHRhc2tzLnNvcnQoKHRhc2sxLCB0YXNrMikgPT4ge1xyXG4gICAgICBpZiAoIHRhc2sxLnN0YXR1cyA9PSB0cnVlICYmIHRhc2syLnN0YXR1cyA9PSBmYWxzZSl7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCB0YXNrMS5zdGF0dXMgPT0gZmFsc2UgJiYgdGFzazIuc3RhdHVzID09IHRydWUpe1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIHRhc2sxLnN0YXR1cyA9PSB0YXNrMi5zdGF0dXMgKXtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuIl19
