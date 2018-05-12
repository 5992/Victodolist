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
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\" class=\"parent\">\n                            <div class=\"task-container\">\n                                <div class=\"task-name\">" + name + "</div>\n                            <div class=\"task-buttons\">\n                                <button type=\"button\" class=\"child\" id='canceledit' data-function=\"canceledit\">Cancel edit</button>\n                                <button type=\"button\" data-function=\"edit\">&#9998;</button>\n                                <button type=\"button\" data-function=\"status\">&#x2714;</button>\n                                <button type=\"button\" data-function=\"delete\">&times;</button>\n            </div>\n            </div>\n            <li>";
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
    if (taskname.length > 0) {
        var task = new task_1.Task(taskname);
        taskmanager.add(task);
        listview.clear();
        taskstorage.store(taskarray, function (result) {
            if (result) {
                taskform.reset();
                listview.clear();
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
    console.log(id);
    //we have some buttons = check which one we clicked
    //when edit button clicked
    if (target.getAttribute('data-function') == 'edit') {
        //focus on input and disable add task button
        var input_1 = document.getElementById('task-input');
        var add_1 = document.getElementById('task-add');
        input_1.focus();
        input_1.placeholder = 'Edit task name here'; // change the placeholder text
        add_1.disabled = true;
        var li = document.getElementById(id);
        var cancel_1 = li.getElementsByClassName("child")[0];
        if (id) {
            //make cancel button enable
            cancel_1.style.visibility = "visible";
            var newname = input_1.value;
            if (newname.length > 0) {
                taskmanager.edit(id, newname, function () {
                    taskstorage.store(taskarray, function () {
                        // enable the add button
                        add_1.disabled = false;
                        input_1.placeholder = '+ Add a task';
                        //hide the cancel edit button after finish edit stage
                        cancel_1.style.visibility = "hidden";
                        taskform.reset(); //clear input text field
                        listview.clear();
                        listview.render(taskarray);
                    });
                });
            }
        }
    }
    if (target.getAttribute('data-function') == 'canceledit') {
        if (id) {
            //cancel edit state
            var add = document.getElementById('task-add');
            var input = document.getElementById('task-input');
            add.disabled = false;
            input.placeholder = '+ Add a task';
            //hide cancel button
            //const cancel = document.getElementById('canceledit');
            var li = document.getElementById(id);
            var cancel = li.getElementsByClassName("child")[0];
            cancel.style.visibility = "hidden";
            taskform.reset();
        }
    }
    if (target.getAttribute('data-function') == 'status') { //status button get clicked
        if (id) {
            taskmanager.changeStatus(id, function () {
                taskstorage.store(taskarray, function () {
                    //cancel edit state
                    var add = document.getElementById('task-add');
                    var input = document.getElementById('task-input');
                    add.disabled = false;
                    input.placeholder = '+ Add a task';
                    //hide the cancel button
                    var cancel = document.getElementById('canceledit');
                    cancel.style.visibility = "hidden";
                    taskform.reset();
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
                    //cancel edit state
                    var add = document.getElementById('task-add');
                    var input = document.getElementById('task-input');
                    add.disabled = false;
                    input.placeholder = '+ Add a task';
                    //hide the cancel button
                    var cancel = document.getElementById('canceledit');
                    cancel.style.visibility = "hidden";
                    taskform.reset();
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
        this.sort(this.tasks);
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
        callback();
    };
    TaskManager.prototype.sort = function (tasks) {
        tasks.sort(function (task1, task2) {
            var id1 = parseInt(task1.id);
            var id2 = parseInt(task2.id);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBO0lBRUU7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdkMsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZO1FBQ3RFLElBQUssV0FBVyxFQUFFO1lBQ2pCLFFBQVEsQ0FBRSxJQUFJLENBQUUsQ0FBQztTQUNqQjthQUNJO1lBQ0gsUUFBUSxDQUFFLEtBQUssQ0FBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUNELDBCQUFJLEdBQUosVUFBTSxRQUFRO1FBQ1YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUMvQixRQUFRLENBQUUsS0FBSyxDQUFFLENBQUM7SUFDdEIsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FwQkEsQUFvQkMsSUFBQTtBQXBCWSxrQ0FBVzs7OztBQ0F4QjtJQUVJLGtCQUFhLE1BQWE7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFFLE1BQU0sQ0FBRSxDQUFDO0lBQ2xELENBQUM7SUFDRCx5QkFBTSxHQUFOLFVBQVEsS0FBaUI7UUFB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LENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxVQUFDLElBQVUsRUFBRSxLQUFhO1lBQzVDLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQ2pCLGVBQWUsR0FBRyxLQUFLLENBQUM7YUFDekI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILGtDQUFrQztRQUNsQyxJQUFLLGVBQWUsS0FBSyxTQUFTLEVBQUU7WUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsUUFBUSxFQUFFLENBQUM7SUFDYixDQUFDO0lBQ0QsMEJBQUksR0FBSixVQUFNLEtBQWlCO1FBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFLLEVBQUMsS0FBSztZQUNyQixJQUFJLEdBQUcsR0FBVSxRQUFRLENBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBRSxDQUFDO1lBQ3RDLElBQUksR0FBRyxHQUFVLFFBQVEsQ0FBRSxLQUFLLENBQUMsRUFBRSxDQUFFLENBQUM7WUFDdEMsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBRTtnQkFDakQsT0FBTyxDQUFDLENBQUM7YUFDVjtZQUNELElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUU7Z0JBQ2pELE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDWDtZQUNELElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSyxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNqQyxPQUFPLENBQUMsQ0FBQzthQUNWO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0Ysa0JBQUM7QUFBRCxDQTdEQSxBQTZEQyxJQUFBO0FBN0RZLGtDQUFXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhdGFTdG9yYWdle1xyXG4gIHN0b3JhZ2U7XHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgICAgdGhpcy5zdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZTtcclxuICB9XHJcbiAgc3RvcmUoIGFycmF5OkFycmF5IDxUYXNrPiwgY2FsbGJhY2sgKXtcclxuICAgIGxldCBkYXRhID0gSlNPTi5zdHJpbmdpZnkoIGFycmF5KTtcclxuICAgIGxldCBzdG9yZXN0YXR1cyA9IHRoaXMuc3RvcmFnZS5zZXRJdGVtKCd0YXNrZGF0YScsIGRhdGEpOyAvL3N1Y2Nlc3NmdWxcclxuICAgIGlmICggc3RvcmVzdGF0dXMgKXtcclxuICAgICBjYWxsYmFjayggdHJ1ZSApO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKCBmYWxzZSApO1xyXG4gICAgfVxyXG4gIH1cclxuICByZWFkKCBjYWxsYmFjayApe1xyXG4gICAgICBsZXQgZGF0YSA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKCd0YXNrZGF0YScpO1xyXG4gICAgICBsZXQgYXJyYXkgPSBKU09OLnBhcnNlKCBkYXRhICk7XHJcbiAgICAgIGNhbGxiYWNrKCBhcnJheSApO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlzdFZpZXd7XHJcbiAgICBsaXN0OkhUTUxFbGVtZW50O1xyXG4gICAgY29uc3RydWN0b3IoIGxpc3RpZDpzdHJpbmcgKXtcclxuICAgICAgICB0aGlzLmxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbGlzdGlkICk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoIGl0ZW1zOkFycmF5PFRhc2s+ICl7XHJcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgodGFzaykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0YXNrLmlkO1xyXG4gICAgICAgICAgICBsZXQgbmFtZSA9IHRhc2submFtZTtcclxuICAgICAgICAgICAgbGV0IHN0YXR1cyA9IHRhc2suc3RhdHVzLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGA8bGkgaWQ9XCIke2lkfVwiIGRhdGEtc3RhdHVzPVwiJHtzdGF0dXN9XCIgY2xhc3M9XCJwYXJlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLW5hbWVcIj4ke25hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1idXR0b25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjaGlsZFwiIGlkPSdjYW5jZWxlZGl0JyBkYXRhLWZ1bmN0aW9uPVwiY2FuY2VsZWRpdFwiPkNhbmNlbCBlZGl0PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cImVkaXRcIj4mIzk5OTg7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cInN0YXR1c1wiPiYjeDI3MTQ7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cImRlbGV0ZVwiPiZ0aW1lczs8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8bGk+YDtcclxuICAgICAgICAgICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoIHRlbXBsYXRlICk7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpe1xyXG4gICAgICAgIHRoaXMubGlzdC5pbm5lckhUTUwgPScnO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IExpc3RWaWV3IH0gZnJvbSAnLi4vdHMvbGlzdHZpZXcnO1xyXG5pbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcbmltcG9ydCB7IFRhc2tNYW5hZ2VyIH0gZnJvbSAnLi4vdHMvdGFza21hbmFnZXInO1xyXG5pbXBvcnQgeyBEYXRhU3RvcmFnZSB9IGZyb20gJy4uL3RzL2RhdGFzdG9yYWdlJztcclxuXHJcbi8vaW5pdGlhbGlzZVxyXG52YXIgdGFza2FycmF5OkFycmF5PGFueT4gPSBbXTtcclxudmFyIHRhc2tzdG9yYWdlID0gbmV3IERhdGFTdG9yYWdlKCk7XHJcbnZhciB0YXNrbWFuYWdlciA9IG5ldyBUYXNrTWFuYWdlcih0YXNrYXJyYXkpO1xyXG52YXIgbGlzdHZpZXcgPSBuZXcgTGlzdFZpZXcoJ3Rhc2stbGlzdCcpO1xyXG5cclxuLy9jbGljayBidXR0b24sIGV2ZW50IGNhbGwgdGhpcyBmdW5jdGlvbiB0byBmaW5kIGlkIG9mIGJ1dHRvbiBpZiBoYXZlXHJcbmZ1bmN0aW9uIGdldFBhcmVudElkKGVsbTpOb2RlKXtcclxuICAvL2xvb3AgZWxlbWVudCB0byBmaW5kIHRoZSBpZCB1c2luZyB3aGlsZVxyXG4gIHdoaWxlKGVsbS5wYXJlbnROb2RlKXtcclxuICAgIGVsbSA9IGVsbS5wYXJlbnROb2RlO1xyXG4gICAgbGV0IGlkOnN0cmluZyA9ICg8SFRNTEVsZW1lbnQ+IGVsbSkuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgaWYoIGlkICl7XHJcbiAgICAgIHJldHVybiBpZDtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbi8vYXBwIGxvYWRzIC0gc2hvdyBsaXN0IG9mIHRhc2tzIHN0b3JpbmcgaW4gc3RvcmFnZVxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgbGV0IHRhc2tkYXRhID0gdGFza3N0b3JhZ2UucmVhZCggKGRhdGEpID0+IHtcclxuICAgICBpZiAoZGF0YS5sZW5ndGggPiAwKXtcclxuICAgICAgIGRhdGEuZm9yRWFjaCggKGl0ZW0pID0+IHtcclxuICAgICAgICAgdGFza2FycmF5LnB1c2goaXRlbSk7XHJcbiAgICAgICB9KTtcclxuICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XHJcbiAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xyXG5cclxuICAgICB9XHJcbiAgIH0pO1xyXG59KTtcclxuXHJcbi8vcmVmZXJlbmNlIHRvIGZvcm1cclxuY29uc3QgdGFza2Zvcm0gPSAoPEhUTUxGb3JtRWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stZm9ybScpKTtcclxudGFza2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywoIGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xyXG4gIGxldCB0YXNrbmFtZSA9ICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkudmFsdWU7XHJcbiAgICB0YXNrZm9ybS5yZXNldCgpO1xyXG4gICAgaWYgKHRhc2tuYW1lLmxlbmd0aCA+IDApe1xyXG4gICAgICBsZXQgdGFzayA9IG5ldyBUYXNrKCB0YXNrbmFtZSApO1xyXG4gICAgICB0YXNrbWFuYWdlci5hZGQoIHRhc2sgKTtcclxuICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuXHJcbiAgICAgIHRhc2tzdG9yYWdlLnN0b3JlKHRhc2thcnJheSwgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKHJlc3VsdCl7XHJcbiAgICAgICAgICB0YXNrZm9ybS5yZXNldCgpO1xyXG4gICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIC8vZXJyb3IgdG8gZG8gd2l0aCBzdG9yYWdlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcclxuICAgIH1cclxufSk7XHJcblxyXG5cclxuXHJcbmNvbnN0IGxpc3RlbGVtZW50OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stbGlzdCcpO1xyXG5saXN0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICggZXZlbnQ6IEV2ZW50KSA9PiB7XHJcblxyXG4gIGxldCB0YXJnZXQ6SFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+IGV2ZW50LnRhcmdldDtcclxuICAvL2ZpbmQgYSB3YXkgdG8gZ2V0IGxpIGVsZW1lbnQgY2F1c2UgYnV0dG9uIGluc2lkZSA8bGk+XHJcbiAgbGV0IGlkID0gZ2V0UGFyZW50SWQoIDxOb2RlPiBldmVudC50YXJnZXQpO1xyXG5cclxuICBjb25zb2xlLmxvZyhpZCk7XHJcbiAgLy93ZSBoYXZlIHNvbWUgYnV0dG9ucyA9IGNoZWNrIHdoaWNoIG9uZSB3ZSBjbGlja2VkXHJcbiAgLy93aGVuIGVkaXQgYnV0dG9uIGNsaWNrZWRcclxuICBpZiAoIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKSA9PSAnZWRpdCcpe1xyXG4gICAgLy9mb2N1cyBvbiBpbnB1dCBhbmQgZGlzYWJsZSBhZGQgdGFzayBidXR0b25cclxuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcclxuICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWFkZCcpO1xyXG4gICAgaW5wdXQuZm9jdXMoKTtcclxuICAgICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkucGxhY2Vob2xkZXIgPSAnRWRpdCB0YXNrIG5hbWUgaGVyZSc7IC8vIGNoYW5nZSB0aGUgcGxhY2Vob2xkZXIgdGV4dFxyXG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PmFkZCkuZGlzYWJsZWQgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgY29uc3QgY2FuY2VsID0gbGkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNoaWxkXCIpWzBdO1xyXG5cclxuICAgIGlmKCBpZCApe1xyXG4gICAgICAvL21ha2UgY2FuY2VsIGJ1dHRvbiBlbmFibGVcclxuICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmNhbmNlbCkuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG5cclxuICAgICAgbGV0IG5ld25hbWUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQpLnZhbHVlO1xyXG4gICAgICBpZihuZXduYW1lLmxlbmd0aCA+IDApe1xyXG4gICAgICAgIHRhc2ttYW5hZ2VyLmVkaXQoaWQsIG5ld25hbWUsICgpID0+IHtcclxuICAgICAgICAgIHRhc2tzdG9yYWdlLnN0b3JlKCB0YXNrYXJyYXksICgpID0+IHtcclxuICAgICAgICAgICAgLy8gZW5hYmxlIHRoZSBhZGQgYnV0dG9uXHJcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5hZGQpLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkucGxhY2Vob2xkZXIgPSAnKyBBZGQgYSB0YXNrJztcclxuICAgICAgICAgICAgLy9oaWRlIHRoZSBjYW5jZWwgZWRpdCBidXR0b24gYWZ0ZXIgZmluaXNoIGVkaXQgc3RhZ2VcclxuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmNhbmNlbCkuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XHJcbiAgICAgICAgICAgIHRhc2tmb3JtLnJlc2V0KCk7IC8vY2xlYXIgaW5wdXQgdGV4dCBmaWVsZFxyXG4gICAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICggdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpID09ICdjYW5jZWxlZGl0Jyl7XHJcbiAgICBpZiggaWQgKXtcclxuICAgIC8vY2FuY2VsIGVkaXQgc3RhdGVcclxuICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWFkZCcpO1xyXG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xyXG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PmFkZCkuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkucGxhY2Vob2xkZXIgPSAnKyBBZGQgYSB0YXNrJztcclxuICAgIC8vaGlkZSBjYW5jZWwgYnV0dG9uXHJcbiAgICAvL2NvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW5jZWxlZGl0Jyk7XHJcbiAgICBjb25zdCBsaSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgIGNvbnN0IGNhbmNlbCA9IGxpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjaGlsZFwiKVswXTtcclxuICAgICg8SFRNTElucHV0RWxlbWVudD5jYW5jZWwpLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG4gICAgdGFza2Zvcm0ucmVzZXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICggdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpID09ICdzdGF0dXMnKXsvL3N0YXR1cyBidXR0b24gZ2V0IGNsaWNrZWRcclxuICAgIGlmKCBpZCApe1xyXG4gICAgICB0YXNrbWFuYWdlci5jaGFuZ2VTdGF0dXMoIGlkLCAoKSA9PnsvL2NhbGxiYWNrIHRlbGwgdGhlIHN5c3RlbSBjaGFuZ2Ugc3RhdHVzIHdoZW4gc3RhdHVzIGNoYW5nZWRcclxuICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSggdGFza2FycmF5LCAoKSA9PiB7XHJcbiAgICAgICAgICAvL2NhbmNlbCBlZGl0IHN0YXRlXHJcbiAgICAgICAgICBjb25zdCBhZGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1hZGQnKTtcclxuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcclxuICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5hZGQpLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQpLnBsYWNlaG9sZGVyID0gJysgQWRkIGEgdGFzayc7XHJcblxyXG4gICAgICAgICAgLy9oaWRlIHRoZSBjYW5jZWwgYnV0dG9uXHJcbiAgICAgICAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FuY2VsZWRpdCcpO1xyXG4gICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmNhbmNlbCkuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XHJcbiAgICAgICAgICB0YXNrZm9ybS5yZXNldCgpO1xyXG4gICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpID09ICdkZWxldGUnKXtcclxuICAgIGlmKCBpZCApe1xyXG4gICAgICB0YXNrbWFuYWdlci5kZWxldGUoIGlkLCAoKSA9PiB7XHJcbiAgICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCgpPT57XHJcbiAgICAgICAgICAvL2NhbmNlbCBlZGl0IHN0YXRlXHJcbiAgICAgICAgICBjb25zdCBhZGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1hZGQnKTtcclxuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcclxuICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5hZGQpLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQpLnBsYWNlaG9sZGVyID0gJysgQWRkIGEgdGFzayc7XHJcblxyXG4gICAgICAgICAgLy9oaWRlIHRoZSBjYW5jZWwgYnV0dG9uXHJcbiAgICAgICAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FuY2VsZWRpdCcpO1xyXG4gICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmNhbmNlbCkuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XHJcbiAgICAgICAgICB0YXNrZm9ybS5yZXNldCgpO1xyXG4gICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcbiIsImV4cG9ydCBjbGFzcyBUYXNre1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIHN0YXR1czogYm9vbGVhbjtcclxuICBjb25zdHJ1Y3Rvcih0YXNrbmFtZTogc3RyaW5nKXtcclxuICAgIHRoaXMuaWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpO1xyXG4gICAgdGhpcy5uYW1lID0gdGFza25hbWU7XHJcbiAgICB0aGlzLnN0YXR1cyA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFRhc2tNYW5hZ2VyIHtcclxuICB0YXNrczogQXJyYXk8VGFzaz47XHJcblxyXG4gIGNvbnN0cnVjdG9yKCBhcnJheTogQXJyYXk8VGFzaz4pe1xyXG4gICAgdGhpcy50YXNrcyA9IGFycmF5O1xyXG4gIH1cclxuICBhZGQoIHRhc2s6IFRhc2sgKXtcclxuICAgIHRoaXMudGFza3MucHVzaCh0YXNrKTtcclxuICAgIHRoaXMuc29ydCggdGhpcy50YXNrcyApO1xyXG4gIH1cclxuICBlZGl0KCBpZDpTdHJpbmcsIG5ld25hbWU6c3RyaW5nLGNhbGxiYWNrKTp2b2lke1xyXG4gICAgdGhpcy50YXNrcy5mb3JFYWNoKCh0YXNrOlRhc2spID0+IHtcclxuICAgICAgaWYodGFzay5pZCA9PSBpZCl7XHJcbiAgICAgICAgdGFzay5uYW1lID0gbmV3bmFtZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjYWxsYmFjaygpO1xyXG4gIH1cclxuICBjaGFuZ2VTdGF0dXMoIGlkOlN0cmluZywgY2FsbGJhY2sgKTp2b2lke1xyXG4gICAgdGhpcy50YXNrcy5mb3JFYWNoKCh0YXNrOlRhc2spID0+IHtcclxuICAgICAgICBpZih0YXNrLmlkID09IGlkKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coIHRhc2suaWQgKTtcclxuICAgICAgICAgICAgaWYodGFzay5zdGF0dXMgPT0gZmFsc2UgKXtcclxuICAgICAgICAgICAgICAgIHRhc2suc3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdGFzay5zdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy5zb3J0KCB0aGlzLnRhc2tzICk7XHJcbiAgICBjYWxsYmFjaygpO1xyXG4gIH1cclxuICBkZWxldGUoIGlkOnN0cmluZywgY2FsbGJhY2sgKXtcclxuICAgIGxldCBpbmRleF90b19yZW1vdmU6IG51bWJlciA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMudGFza3MuZm9yRWFjaCggKGl0ZW06IFRhc2ssIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uaWQgPT0gaWQgKXtcclxuICAgICAgICBpbmRleF90b19yZW1vdmUgPSBpbmRleDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvL2RlbGV0ZSBpdGVtIHdpdGggc3BlY2lmaWVkIGluZGV4XHJcbiAgICBpZiAoIGluZGV4X3RvX3JlbW92ZSAhPT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHRoaXMudGFza3Muc3BsaWNlIChpbmRleF90b19yZW1vdmUsIDEpO1xyXG4gICAgfVxyXG4gICAgY2FsbGJhY2soKTtcclxuICB9XHJcbiAgc29ydCggdGFza3M6QXJyYXk8VGFzaz4gKXtcclxuICAgdGFza3Muc29ydCgodGFzazEsdGFzazIpID0+IHtcclxuICAgICBsZXQgaWQxOm51bWJlciA9IHBhcnNlSW50KCB0YXNrMS5pZCApO1xyXG4gICAgIGxldCBpZDI6bnVtYmVyID0gcGFyc2VJbnQoIHRhc2syLmlkICk7XHJcbiAgICAgaWYoIHRhc2sxLnN0YXR1cyA9PSB0cnVlICYmIHRhc2syLnN0YXR1cyA9PSBmYWxzZSApe1xyXG4gICAgICAgcmV0dXJuIDE7XHJcbiAgICAgfVxyXG4gICAgIGlmKCB0YXNrMS5zdGF0dXMgPT0gZmFsc2UgJiYgdGFzazIuc3RhdHVzID09IHRydWUgKXtcclxuICAgICAgIHJldHVybiAtMTtcclxuICAgICB9XHJcbiAgICAgaWYoIHRhc2sxLnN0YXR1cyAgPT0gdGFzazIuc3RhdHVzICl7XHJcbiAgICAgICByZXR1cm4gMDtcclxuICAgICB9XHJcbiAgIH0pXHJcbiB9XHJcbn1cclxuIl19
