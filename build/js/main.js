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
        var input = document.getElementById('task-input');
        input.focus();
        input.placeholder = 'Edit task name here';
        if (id) {
            var input_1 = document.getElementById('task-input');
            var newname = input_1.value;
            if (newname.length > 0) {
                taskmanager.edit(id, newname, function () {
                    taskstorage.store(taskarray, function () {
                        input_1.placeholder = '+ Add a task';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBO0lBRUU7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdkMsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZO1FBQ3RFLElBQUssV0FBVyxFQUFFO1lBQ2pCLFFBQVEsQ0FBRSxJQUFJLENBQUUsQ0FBQztTQUNqQjthQUNJO1lBQ0gsUUFBUSxDQUFFLEtBQUssQ0FBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUNELDBCQUFJLEdBQUosVUFBTSxRQUFRO1FBQ1YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUMvQixRQUFRLENBQUUsS0FBSyxDQUFFLENBQUM7SUFDdEIsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FwQkEsQUFvQkMsSUFBQTtBQXBCWSxrQ0FBVzs7OztBQ0R4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUVIO0lBRUksa0JBQWEsTUFBYTtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUUsTUFBTSxDQUFFLENBQUM7SUFDbEQsQ0FB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WUFDRCxJQUFLLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFDO2dCQUNqRCxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ1g7WUFDRCxJQUFLLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtnQkFDakMsT0FBTyxDQUFDLENBQUM7YUFDVjtRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FuRUEsQUFtRUMsSUFBQTtBQW5FWSxrQ0FBVyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuLi90cy90YXNrJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEYXRhU3RvcmFnZXtcclxuICBzdG9yYWdlO1xyXG4gIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgIHRoaXMuc3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XHJcbiAgfVxyXG4gIHN0b3JlKCBhcnJheTpBcnJheSA8VGFzaz4sIGNhbGxiYWNrICl7XHJcbiAgICBsZXQgZGF0YSA9IEpTT04uc3RyaW5naWZ5KCBhcnJheSk7XHJcbiAgICBsZXQgc3RvcmVzdGF0dXMgPSB0aGlzLnN0b3JhZ2Uuc2V0SXRlbSgndGFza2RhdGEnLCBkYXRhKTsgLy9zdWNjZXNzZnVsXHJcbiAgICBpZiAoIHN0b3Jlc3RhdHVzICl7XHJcbiAgICAgY2FsbGJhY2soIHRydWUgKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBjYWxsYmFjayggZmFsc2UgKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmVhZCggY2FsbGJhY2sgKXtcclxuICAgICAgbGV0IGRhdGEgPSB0aGlzLnN0b3JhZ2UuZ2V0SXRlbSgndGFza2RhdGEnKTtcclxuICAgICAgbGV0IGFycmF5ID0gSlNPTi5wYXJzZSggZGF0YSApO1xyXG4gICAgICBjYWxsYmFjayggYXJyYXkgKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG4vKlxyXG5leHBvcnQgY2xhc3MgTGlzdFZpZXd7XHJcbiAgbGlzdDogSFRNTEVsZW1lbnQ7XHJcbiAgY29uc3RydWN0b3IoIGxpc3RpZDogc3RyaW5nICl7XHJcbiAgICB0aGlzLmxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1saXN0Jyk7XHJcbiAgfVxyXG4gIGNsZWFyKCl7XHJcbiAgICB0aGlzLmxpc3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgfVxyXG4gIHJlbmRlciggaXRlbXM6QXJyYXk8VGFzaz4gKXtcclxuICAgIC8vY2xlYXIgdGhlIHZpZXdcclxuICAgIC8vcmVuZGVyIGFycmF5IHVzaW5nIHRlbXBsYXRlXHJcbiAgICBpdGVtcy5mb3JFYWNoKCAodGFzaykgPT4ge1xyXG4gICAgbGV0IGlkPSB0YXNrLmlkO1xyXG4gICAgbGV0IG5hbWUgPSB0YXNrLm5hbWU7XHJcbiAgICBsZXQgc3RhdHVzID0gdGFzay5zdGF0dXMudG9TdHJpbmcoKTtcclxuICAgIGxldCBpdGVtID0gdGVtcGxhdGUucG9wdWxhdGUoaWQsbmFtZSxzdGF0dXMpO1xyXG4gICAgLy8gY29udmVydCBvdXIgc3RyaW5nIHRvIEhUTUwgTm9kZVxyXG4gICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoaXRlbSk7XHJcbiAgICB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0qL1xyXG5cclxuZXhwb3J0IGNsYXNzIExpc3RWaWV3e1xyXG4gICAgbGlzdDpIVE1MRWxlbWVudDtcclxuICAgIGNvbnN0cnVjdG9yKCBsaXN0aWQ6c3RyaW5nICl7XHJcbiAgICAgICAgdGhpcy5saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGxpc3RpZCApO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCBpdGVtczpBcnJheTxUYXNrPiApe1xyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goKHRhc2spID0+IHtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGFzay5pZDtcclxuICAgICAgICAgICAgbGV0IG5hbWUgPSB0YXNrLm5hbWU7XHJcbiAgICAgICAgICAgIGxldCBzdGF0dXMgPSB0YXNrLnN0YXR1cy50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBgPGxpIGlkPVwiJHtpZH1cIiBkYXRhLXN0YXR1cz1cIiR7c3RhdHVzfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stbmFtZVwiPiR7bmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLWJ1dHRvbnNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWZ1bmN0aW9uPVwiZWRpdFwiPiYjOTk5ODs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWZ1bmN0aW9uPVwic3RhdHVzXCI+JiN4MjcxNDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWZ1bmN0aW9uPVwiZGVsZXRlXCI+JnRpbWVzOzwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8bGk+YDtcclxuICAgICAgICAgICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoIHRlbXBsYXRlICk7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpe1xyXG4gICAgICAgIHRoaXMubGlzdC5pbm5lckhUTUwgPScnO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IExpc3RWaWV3IH0gZnJvbSAnLi4vdHMvbGlzdHZpZXcnO1xyXG5pbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcbmltcG9ydCB7IFRhc2tNYW5hZ2VyIH0gZnJvbSAnLi4vdHMvdGFza21hbmFnZXInO1xyXG5pbXBvcnQgeyBEYXRhU3RvcmFnZSB9IGZyb20gJy4uL3RzL2RhdGFzdG9yYWdlJztcclxuXHJcbi8vaW5pdGlhbGlzZVxyXG52YXIgdGFza2FycmF5OkFycmF5PGFueT4gPSBbXTtcclxudmFyIHRhc2tzdG9yYWdlID0gbmV3IERhdGFTdG9yYWdlKCk7XHJcbnZhciB0YXNrbWFuYWdlciA9IG5ldyBUYXNrTWFuYWdlcih0YXNrYXJyYXkpO1xyXG52YXIgbGlzdHZpZXcgPSBuZXcgTGlzdFZpZXcoJ3Rhc2stbGlzdCcpO1xyXG5cclxuXHJcbi8vY2xpY2sgYnV0dG9uLCBldmVudCBjYWxsIHRoaXMgZnVuY3Rpb24gdG8gZmluZCBpZCBvZiBidXR0b24gaWYgaGF2ZVxyXG5mdW5jdGlvbiBnZXRQYXJlbnRJZChlbG06Tm9kZSl7XHJcbiAgLy9sb29wIGVsZW1lbnQgdG8gZmluZCB0aGUgaWQgdXNpbmcgd2hpbGVcclxuICB3aGlsZShlbG0ucGFyZW50Tm9kZSl7XHJcbiAgICBlbG0gPSBlbG0ucGFyZW50Tm9kZTtcclxuICAgIGxldCBpZDpzdHJpbmcgPSAoPEhUTUxFbGVtZW50PiBlbG0pLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICAgIGlmKCBpZCApe1xyXG4gICAgICByZXR1cm4gaWQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5cclxuLy9hcHAgbG9hZHMgLSBzaG93IGxpc3Qgb2YgdGFza3Mgc3RvcmluZyBpbiBzdG9yYWdlXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICBsZXQgdGFza2RhdGEgPSB0YXNrc3RvcmFnZS5yZWFkKCAoZGF0YSkgPT4ge1xyXG4gICAgIGlmIChkYXRhLmxlbmd0aCA+IDApe1xyXG4gICAgICAgZGF0YS5mb3JFYWNoKCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICB0YXNrYXJyYXkucHVzaChpdGVtKTtcclxuICAgICAgIH0pO1xyXG4gICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XHJcbiAgICAgfVxyXG4gICB9KTtcclxufSk7XHJcblxyXG5cclxuXHJcblxyXG4vL3JlZmVyZW5jZSB0byBmb3JtXHJcbmNvbnN0IHRhc2tmb3JtID0gKDxIVE1MRm9ybUVsZW1lbnQ+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWZvcm0nKSk7XHJcbnRhc2tmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsKCBldmVudDogRXZlbnQpID0+IHtcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5jb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWlucHV0Jyk7XHJcbiAgbGV0IHRhc2tuYW1lID0gKDxIVE1MSW5wdXRFbGVtZW50PmlucHV0KS52YWx1ZTtcclxuICAgIHRhc2tmb3JtLnJlc2V0KCk7XHJcbiAvLyBjb25zb2xlLmxvZyh0YXNrbmFtZSk7XHJcblxyXG4gICAgaWYgKHRhc2tuYW1lLmxlbmd0aCA+IDApe1xyXG4gICAgICBsZXQgdGFzayA9IG5ldyBUYXNrKCB0YXNrbmFtZSApO1xyXG4gICAgICB0YXNrbWFuYWdlci5hZGQoIHRhc2sgKTtcclxuICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuXHJcbiAgICAgIHRhc2tzdG9yYWdlLnN0b3JlKHRhc2thcnJheSwgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKHJlc3VsdCl7XHJcbiAgICAgICAgICB0YXNrZm9ybS5yZXNldCgpO1xyXG4gICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgICAgIC8vbGlzdHZpZXcucmVuZGVyKHRhc2thcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAvL2Vycm9yIHRvIGRvIHdpdGggc3RvcmFnZVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgICAgbGlzdHZpZXcucmVuZGVyKHRhc2thcnJheSk7XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcblxyXG5cclxuY29uc3QgbGlzdGVsZW1lbnQ6SFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1saXN0Jyk7XHJcbmxpc3RlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCBldmVudDogRXZlbnQpID0+IHtcclxuICBsZXQgdGFyZ2V0OkhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PiBldmVudC50YXJnZXQ7XHJcbiAgLy9maW5kIGEgd2F5IHRvIGdldCBsaSBlbGVtZW50IGNhdXNlIGJ1dHRvbiBpbnNpZGUgPGxpPlxyXG4gIGxldCBpZCA9IGdldFBhcmVudElkKCA8Tm9kZT4gZXZlbnQudGFyZ2V0KTtcclxuICAvL3dlIGhhdmUgc29tZSBidXR0b25zID0gY2hlY2sgd2hpY2ggb25lIHdlIGNsaWNrZWRcclxuXHJcbiAgLy93aGVuIGVkaXQgYnV0dG9uIGNsaWNrZWRcclxuICBpZiAoIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKSA9PSAnZWRpdCcpe1xyXG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xyXG4gICAgaW5wdXQuZm9jdXMoKTtcclxuICAgICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkucGxhY2Vob2xkZXIgPSAnRWRpdCB0YXNrIG5hbWUgaGVyZSc7XHJcblxyXG4gICAgaWYoIGlkICl7XHJcbiAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcclxuICAgICAgbGV0IG5ld25hbWUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQpLnZhbHVlO1xyXG4gICAgICBpZihuZXduYW1lLmxlbmd0aCA+IDApe1xyXG4gICAgICAgIHRhc2ttYW5hZ2VyLmVkaXQoaWQsIG5ld25hbWUsICgpID0+IHtcclxuICAgICAgICAgIHRhc2tzdG9yYWdlLnN0b3JlKCB0YXNrYXJyYXksICgpID0+IHtcclxuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmlucHV0KS5wbGFjZWhvbGRlciA9ICcrIEFkZCBhIHRhc2snO1xyXG4gICAgICAgICAgICB0YXNrZm9ybS5yZXNldCgpOyAvL2NsZWFyIGlucHV0IHRleHQgZmllbGRcclxuICAgICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKSA9PSAnc3RhdHVzJyl7Ly9zdGF0dXMgYnV0dG9uIGdldCBjbGlja2VkXHJcbiAgICBpZiggaWQgKXtcclxuICAgICAgdGFza21hbmFnZXIuY2hhbmdlU3RhdHVzKCBpZCwgKCkgPT4gey8vY2FsbGJhY2sgdGVsbCB0aGUgc3lzdGVtIGNoYW5nZSBzdGF0dXMgd2hlbiBzdGF0dXMgY2hhbmdlZFxyXG4gICAgICAgIHRhc2tzdG9yYWdlLnN0b3JlKCB0YXNrYXJyYXksICgpID0+IHtcclxuICAgICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XHJcbiAgICAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKSA9PSAnZGVsZXRlJyl7XHJcbiAgICBpZiggaWQgKXtcclxuICAgICAgdGFza21hbmFnZXIuZGVsZXRlKCBpZCwgKCkgPT4ge1xyXG4gICAgICAgIHRhc2tzdG9yYWdlLnN0b3JlKHRhc2thcnJheSwoKT0+e1xyXG4gICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcbiIsImV4cG9ydCBjbGFzcyBUYXNre1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIHN0YXR1czogYm9vbGVhbjtcclxuICBjb25zdHJ1Y3Rvcih0YXNrbmFtZTogc3RyaW5nKXtcclxuICAgIHRoaXMuaWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpO1xyXG4gICAgdGhpcy5uYW1lID0gdGFza25hbWU7XHJcbiAgICB0aGlzLnN0YXR1cyA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFRhc2tNYW5hZ2VyIHtcclxuICB0YXNrczogQXJyYXk8VGFzaz47XHJcblxyXG4gIGNvbnN0cnVjdG9yKCBhcnJheTogQXJyYXk8VGFzaz4pe1xyXG4gICAgdGhpcy50YXNrcyA9IGFycmF5O1xyXG4gIH1cclxuICBhZGQoIHRhc2s6IFRhc2sgKXtcclxuICAgIHRoaXMudGFza3MucHVzaCh0YXNrKTtcclxuICAgIHRoaXMuc29ydCggdGhpcy50YXNrcyApO1xyXG4gIH1cclxuICBlZGl0KCBpZDpTdHJpbmcsIG5ld25hbWU6c3RyaW5nLGNhbGxiYWNrKTp2b2lke1xyXG4gICAgdGhpcy50YXNrcy5mb3JFYWNoKCh0YXNrOlRhc2spID0+IHtcclxuICAgICAgaWYodGFzay5pZCA9PSBpZCl7XHJcbiAgICAgICAgdGFzay5uYW1lID0gbmV3bmFtZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjYWxsYmFjaygpO1xyXG4gIH1cclxuICBnZXROYW1lKGlkOiBTdHJpbmcsIGNhbGxiYWNrKXtcclxuICAgIHRoaXMudGFza3MuZm9yRWFjaCgodGFzazpUYXNrKSA9PiB7XHJcbiAgICAgIGlmKHRhc2suaWQgPT0gaWQpe1xyXG4gICAgICAgIHJldHVybiB0YXNrLm5hbWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgY2FsbGJhY2soKTtcclxuICB9XHJcbiAgY2hhbmdlU3RhdHVzKCBpZDpTdHJpbmcsIGNhbGxiYWNrICk6dm9pZHtcclxuICB0aGlzLnRhc2tzLmZvckVhY2goKHRhc2s6VGFzaykgPT4ge1xyXG4gICAgICBpZih0YXNrLmlkID09IGlkKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCB0YXNrLmlkICk7XHJcbiAgICAgICAgICBpZih0YXNrLnN0YXR1cyA9PSBmYWxzZSApe1xyXG4gICAgICAgICAgICAgIHRhc2suc3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgdGFzay5zdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gIH0pO1xyXG4gIGNhbGxiYWNrKCk7XHJcbiAgfVxyXG4gIGRlbGV0ZSggaWQ6c3RyaW5nLCBjYWxsYmFjayApe1xyXG4gICAgbGV0IGluZGV4X3RvX3JlbW92ZTogbnVtYmVyID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy50YXNrcy5mb3JFYWNoKCAoaXRlbTogVGFzaywgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICBpZiAoaXRlbS5pZCA9PSBpZCApe1xyXG4gICAgICAgIGluZGV4X3RvX3JlbW92ZSA9IGluZGV4O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vZGVsZXRlIGl0ZW0gd2l0aCBzcGVjaWZpZWQgaW5kZXhcclxuICAgIGlmICggaW5kZXhfdG9fcmVtb3ZlICE9PSB1bmRlZmluZWQgKXtcclxuICAgICAgdGhpcy50YXNrcy5zcGxpY2UgKGluZGV4X3RvX3JlbW92ZSwgMSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNvcnQoIHRoaXMudGFza3MgKTtcclxuICAgIGNhbGxiYWNrKCk7XHJcbiAgfVxyXG4gIHNvcnQoIHRhc2tzOiBBcnJheTxUYXNrPil7XHJcbiAgICB0YXNrcy5zb3J0KCh0YXNrMSwgdGFzazIpID0+IHtcclxuICAgICAgaWYgKCB0YXNrMS5zdGF0dXMgPT0gdHJ1ZSAmJiB0YXNrMi5zdGF0dXMgPT0gZmFsc2Upe1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICggdGFzazEuc3RhdHVzID09IGZhbHNlICYmIHRhc2syLnN0YXR1cyA9PSB0cnVlKXtcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCB0YXNrMS5zdGF0dXMgPT0gdGFzazIuc3RhdHVzICl7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbiJdfQ==
