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
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\">\n                            <div class=\"task-container\">\n                                <div class=\"task-name\">" + name + "</div>\n                            <div class=\"task-buttons\">\n                                <button type=\"button\" name=\"cancelbutton\" data-function=\"canceledit\">Cancel Edit</button>\n                                <button type=\"button\" data-function=\"edit\">&#9998;</button>\n                                <button type=\"button\" data-function=\"status\">&#x2714;</button>\n                                <button type=\"button\" data-function=\"delete\">&times;</button>\n            </div>\n            </div>\n            <li>";
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
    //const cancel = document.getElementById('cancel');
    //(<HTMLInputElement>cancel).style.visibility = "hidden";
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
        //const cancelEdit = document.getElementById('cancel');
        //(<HTMLInputElement>cancelEdit).style.visibility = "visible";
        input_1.focus();
        input_1.placeholder = 'Edit task name here';
        add_1.disabled = true;
        add_1.innerHTML = 'Add disabled';
        if (id) {
            var newname = input_1.value;
            if (newname.length > 0) {
                taskmanager.edit(id, newname, function () {
                    taskstorage.store(taskarray, function () {
                        add_1.disabled = false;
                        input_1.placeholder = '+ Add a task';
                        add_1.innerHTML = 'Add';
                        //(<HTMLInputElement>cancelEdit).style.visibility = "hidden";
                        taskform.reset(); //clear input text field
                        listview.clear();
                        listview.render(taskarray);
                    });
                });
            }
        }
    }
    if (target.getAttribute('data-function') == 'canceledit') {
        //cancel edit state
        var add = document.getElementById('task-add');
        var input = document.getElementById('task-input');
        add.disabled = false;
        input.placeholder = '+ Add a task';
        add.innerHTML = 'Add';
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
                    add.innerHTML = 'Add';
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
                    add.innerHTML = 'Add';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBO0lBRUU7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdkMsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZO1FBQ3RFLElBQUssV0FBVyxFQUFFO1lBQ2pCLFFBQVEsQ0FBRSxJQUFJLENBQUUsQ0FBQztTQUNqQjthQUNJO1lBQ0gsUUFBUSxDQUFFLEtBQUssQ0FBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUNELDBCQUFJLEdBQUosVUFBTSxRQUFRO1FBQ1YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUMvQixRQUFRLENBQUUsS0FBSyxDQUFFLENBQUM7SUFDdEIsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FwQkEsQUFvQkMsSUFBQTtBQXBCWSxrQ0FBVzs7OztBQ0F4QjtJQUVJLGtCQUFhLE1BQWE7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFFLE1BQU0sQ0FBRSxDQUFDO0lBQ2xELENBQUM7SUFDRCx5QkFBTSxHQUFOLFVBQVEsS0FBaUI7UUFBekIsaUJBbUJDO1FBbEJHLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNqQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3JCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDcEMsSUFBSSxRQUFRLEdBQUcsY0FBVyxFQUFFLHlCQUFrQixNQUFNLGtJQUVQLElBQUksd2lCQVE1QyxDQUFDO1lBQ04sSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLHdCQUF3QixDQUFFLFFBQVEsQ0FBRSxDQUFDO1lBQzNFLEtBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNELHdCQUFLLEdBQUw7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRSxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUNMLGVBQUM7QUFBRCxDQTVCQSxBQTRCQyxJQUFBO0FBNUJZLDRCQUFROzs7O0FDRnJCLDJDQUEwQztBQUMxQyxtQ0FBa0M7QUFDbEMsaURBQWdEO0FBQ2hELGlEQUFnRDtBQUVoRCxZQUFZO0FBQ1osSUFBSSxTQUFTLEdBQWMsRUFBRSxDQUFDO0FBQzlCLElBQUksV0FBVyxHQUFHLElBQUkseUJBQVcsRUFBRSxDQUFDO0FBQ3BDLElBQUksV0FBVyxHQUFHLElBQUkseUJBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QyxJQUFJLFFBQVEsR0FBRyxJQUFJLG1CQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7QUFHekMscUVBQXFFO0FBQ3JFLHFCQUFxQixHQUFRO0lBQzNCLHlDQUF5QztJQUN6QyxPQUFNLEdBQUcsQ0FBQyxVQUFVLEVBQUM7UUFDbkIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7UUFDckIsSUFBSSxFQUFFLEdBQXlCLEdBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxFQUFFLEVBQUU7WUFDTixPQUFPLEVBQUUsQ0FBQztTQUNYO0tBQ0Y7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxtREFBbUQ7QUFDbkQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRTtJQUM3QixJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFFLFVBQUMsSUFBSTtRQUNwQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFDO1lBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUUsVUFBQyxJQUFJO2dCQUNqQixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2pCLFFBQVEsQ0FBQyxNQUFNLENBQUUsU0FBUyxDQUFFLENBQUM7U0FDOUI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVKLG1EQUFtRDtJQUNuRCx5REFBeUQ7QUFFM0QsQ0FBQyxDQUFDLENBQUM7QUFJSCxtQkFBbUI7QUFDbkIsSUFBTSxRQUFRLEdBQXNCLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFFLENBQUM7QUFDMUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBQyxVQUFFLEtBQVk7SUFDL0MsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3ZCLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDcEQsSUFBSSxRQUFRLEdBQXNCLEtBQU0sQ0FBQyxLQUFLLENBQUM7SUFDN0MsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3BCLHlCQUF5QjtJQUV0QixJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFDO1FBQ3RCLElBQUksSUFBSSxHQUFHLElBQUksV0FBSSxDQUFFLFFBQVEsQ0FBRSxDQUFDO1FBQ2hDLFdBQVcsQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFFLENBQUM7UUFDeEIsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRWpCLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLFVBQUMsTUFBTTtZQUNsQyxJQUFHLE1BQU0sRUFBQztnQkFDUixRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2pCLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDakIsNkJBQTZCO2FBQzlCO2lCQUNHO2dCQUNGLDBCQUEwQjthQUMzQjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0QsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM5QjtBQUNMLENBQUMsQ0FBQyxDQUFDO0FBSUgsSUFBTSxXQUFXLEdBQWUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyRSxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUUsS0FBWTtJQUNsRCxJQUFJLE1BQU0sR0FBNkIsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUNwRCx1REFBdUQ7SUFDdkQsSUFBSSxFQUFFLEdBQUcsV0FBVyxDQUFTLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQyxtREFBbUQ7SUFFbkQsMEJBQTBCO0lBQzFCLElBQUssTUFBTSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxNQUFNLEVBQUM7UUFDbEQsSUFBTSxPQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNwRCxJQUFNLEtBQUcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hELHVEQUF1RDtRQUN2RCw4REFBOEQ7UUFFOUQsT0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ0ssT0FBTSxDQUFDLFdBQVcsR0FBRyxxQkFBcUIsQ0FBQztRQUMzQyxLQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixLQUFJLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQztRQUVuRCxJQUFJLEVBQUUsRUFBRTtZQUNOLElBQUksT0FBTyxHQUFzQixPQUFNLENBQUMsS0FBSyxDQUFDO1lBQzlDLElBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7Z0JBQ3BCLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtvQkFDNUIsV0FBVyxDQUFDLEtBQUssQ0FBRSxTQUFTLEVBQUU7d0JBQ1QsS0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7d0JBQ3RCLE9BQU0sQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDO3dCQUNwQyxLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQzt3QkFDMUMsNkRBQTZEO3dCQUM3RCxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyx3QkFBd0I7d0JBQzFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDakIsUUFBUSxDQUFDLE1BQU0sQ0FBRSxTQUFTLENBQUUsQ0FBQztvQkFDL0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7YUFDSjtTQUNGO0tBQ0Y7SUFFRCxJQUFLLE1BQU0sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksWUFBWSxFQUFDO1FBQ3hELG1CQUFtQjtRQUNuQixJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hELElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDakMsR0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsS0FBTSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUM7UUFDcEMsR0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7S0FDM0M7SUFFRCxJQUFLLE1BQU0sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksUUFBUSxFQUFDLEVBQUMsMkJBQTJCO1FBQ2hGLElBQUksRUFBRSxFQUFFO1lBQ04sV0FBVyxDQUFDLFlBQVksQ0FBRSxFQUFFLEVBQUU7Z0JBQzVCLFdBQVcsQ0FBQyxLQUFLLENBQUUsU0FBUyxFQUFFO29CQUM1QixtQkFBbUI7b0JBQ25CLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ2hELElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQ2pDLEdBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO29CQUN0QixLQUFNLENBQUMsV0FBVyxHQUFHLGNBQWMsQ0FBQztvQkFDcEMsR0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7b0JBRTFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDakIsUUFBUSxDQUFDLE1BQU0sQ0FBRSxTQUFTLENBQUUsQ0FBQztnQkFDL0IsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNKO0tBQ0Y7SUFDRCxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksUUFBUSxFQUFDO1FBQ25ELElBQUksRUFBRSxFQUFFO1lBQ04sV0FBVyxDQUFDLFFBQU0sQ0FBQSxDQUFFLEVBQUUsRUFBRTtnQkFDdEIsV0FBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUM7b0JBQzFCLG1CQUFtQjtvQkFDbkIsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDaEQsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDakMsR0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7b0JBQ3RCLEtBQU0sQ0FBQyxXQUFXLEdBQUcsY0FBYyxDQUFDO29CQUNwQyxHQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztvQkFFMUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNqQixRQUFRLENBQUMsTUFBTSxDQUFFLFNBQVMsQ0FBRSxDQUFDO2dCQUMvQixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ0o7S0FDRjtBQUNILENBQUMsQ0FBQyxDQUFDOzs7O0FDMUpIO0lBSUUsY0FBWSxRQUFnQjtRQUMxQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUNILFdBQUM7QUFBRCxDQVRBLEFBU0MsSUFBQTtBQVRZLG9CQUFJOzs7O0FDR2pCO0lBR0UscUJBQWEsS0FBa0I7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUNELHlCQUFHLEdBQUgsVUFBSyxJQUFVO1FBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFFLENBQUM7SUFDMUIsQ0FBQztJQUNELDBCQUFJLEdBQUosVUFBTSxFQUFTLEVBQUUsT0FBYyxFQUFDLFFBQVE7UUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFTO1lBQzNCLElBQUcsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUM7Z0JBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7YUFDckI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILFFBQVEsRUFBRSxDQUFDO0lBQ2IsQ0FBQztJQUNELDZCQUFPLEdBQVAsVUFBUSxFQUFVLEVBQUUsUUFBUTtRQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQVM7WUFDM0IsSUFBRyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBQztnQkFDZixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDbEI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILFFBQVEsRUFBRSxDQUFDO0lBQ2IsQ0FBQztJQUNELGtDQUFZLEdBQVosVUFBYyxFQUFTLEVBQUUsUUFBUTtRQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQVM7WUFDekIsSUFBRyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBQztnQkFDYixPQUFPLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxFQUFFLENBQUUsQ0FBQztnQkFDdkIsSUFBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBRTtvQkFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7aUJBQ3RCO3FCQUNHO29CQUNBLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2lCQUN2QjthQUNKO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUUsQ0FBQztRQUN4QixRQUFRLEVBQUUsQ0FBQztJQUNiLENBQUM7SUFDRCxzQkFBQSxRQUFNLENBQUEsR0FBTixVQUFRLEVBQVMsRUFBRSxRQUFRO1FBQ3pCLElBQUksZUFBZSxHQUFXLFNBQVMsQ0FBQztRQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxVQUFDLElBQVUsRUFBRSxLQUFhO1lBQzVDLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQ2pCLGVBQWUsR0FBRyxLQUFLLENBQUM7YUFDekI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILGtDQUFrQztRQUNsQyxJQUFLLGVBQWUsS0FBSyxTQUFTLEVBQUU7WUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsUUFBUSxFQUFFLENBQUM7SUFDYixDQUFDO0lBQ0QsMEJBQUksR0FBSixVQUFNLEtBQWlCO1FBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFLLEVBQUMsS0FBSztZQUNyQixJQUFJLEdBQUcsR0FBVSxRQUFRLENBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBRSxDQUFDO1lBQ3RDLElBQUksR0FBRyxHQUFVLFFBQVEsQ0FBRSxLQUFLLENBQUMsRUFBRSxDQUFFLENBQUM7WUFDdEMsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssRUFBRTtnQkFDakQsT0FBTyxDQUFDLENBQUM7YUFDVjtZQUNELElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUU7Z0JBQ2pELE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDWDtZQUNELElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSyxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNqQyxPQUFPLENBQUMsQ0FBQzthQUNWO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0Ysa0JBQUM7QUFBRCxDQXJFQSxBQXFFQyxJQUFBO0FBckVZLGtDQUFXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhdGFTdG9yYWdle1xyXG4gIHN0b3JhZ2U7XHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgICAgdGhpcy5zdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZTtcclxuICB9XHJcbiAgc3RvcmUoIGFycmF5OkFycmF5IDxUYXNrPiwgY2FsbGJhY2sgKXtcclxuICAgIGxldCBkYXRhID0gSlNPTi5zdHJpbmdpZnkoIGFycmF5KTtcclxuICAgIGxldCBzdG9yZXN0YXR1cyA9IHRoaXMuc3RvcmFnZS5zZXRJdGVtKCd0YXNrZGF0YScsIGRhdGEpOyAvL3N1Y2Nlc3NmdWxcclxuICAgIGlmICggc3RvcmVzdGF0dXMgKXtcclxuICAgICBjYWxsYmFjayggdHJ1ZSApO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKCBmYWxzZSApO1xyXG4gICAgfVxyXG4gIH1cclxuICByZWFkKCBjYWxsYmFjayApe1xyXG4gICAgICBsZXQgZGF0YSA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKCd0YXNrZGF0YScpO1xyXG4gICAgICBsZXQgYXJyYXkgPSBKU09OLnBhcnNlKCBkYXRhICk7XHJcbiAgICAgIGNhbGxiYWNrKCBhcnJheSApO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlzdFZpZXd7XHJcbiAgICBsaXN0OkhUTUxFbGVtZW50O1xyXG4gICAgY29uc3RydWN0b3IoIGxpc3RpZDpzdHJpbmcgKXtcclxuICAgICAgICB0aGlzLmxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbGlzdGlkICk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoIGl0ZW1zOkFycmF5PFRhc2s+ICl7XHJcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgodGFzaykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0YXNrLmlkO1xyXG4gICAgICAgICAgICBsZXQgbmFtZSA9IHRhc2submFtZTtcclxuICAgICAgICAgICAgbGV0IHN0YXR1cyA9IHRhc2suc3RhdHVzLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGA8bGkgaWQ9XCIke2lkfVwiIGRhdGEtc3RhdHVzPVwiJHtzdGF0dXN9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1uYW1lXCI+JHtuYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stYnV0dG9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG5hbWU9XCJjYW5jZWxidXR0b25cIiBkYXRhLWZ1bmN0aW9uPVwiY2FuY2VsZWRpdFwiPkNhbmNlbCBFZGl0PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cImVkaXRcIj4mIzk5OTg7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cInN0YXR1c1wiPiYjeDI3MTQ7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cImRlbGV0ZVwiPiZ0aW1lczs8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8bGk+YDtcclxuICAgICAgICAgICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoIHRlbXBsYXRlICk7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjbGVhcigpe1xyXG4gICAgICAgIHRoaXMubGlzdC5pbm5lckhUTUwgPScnO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IExpc3RWaWV3IH0gZnJvbSAnLi4vdHMvbGlzdHZpZXcnO1xyXG5pbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcbmltcG9ydCB7IFRhc2tNYW5hZ2VyIH0gZnJvbSAnLi4vdHMvdGFza21hbmFnZXInO1xyXG5pbXBvcnQgeyBEYXRhU3RvcmFnZSB9IGZyb20gJy4uL3RzL2RhdGFzdG9yYWdlJztcclxuXHJcbi8vaW5pdGlhbGlzZVxyXG52YXIgdGFza2FycmF5OkFycmF5PGFueT4gPSBbXTtcclxudmFyIHRhc2tzdG9yYWdlID0gbmV3IERhdGFTdG9yYWdlKCk7XHJcbnZhciB0YXNrbWFuYWdlciA9IG5ldyBUYXNrTWFuYWdlcih0YXNrYXJyYXkpO1xyXG52YXIgbGlzdHZpZXcgPSBuZXcgTGlzdFZpZXcoJ3Rhc2stbGlzdCcpO1xyXG5cclxuXHJcbi8vY2xpY2sgYnV0dG9uLCBldmVudCBjYWxsIHRoaXMgZnVuY3Rpb24gdG8gZmluZCBpZCBvZiBidXR0b24gaWYgaGF2ZVxyXG5mdW5jdGlvbiBnZXRQYXJlbnRJZChlbG06Tm9kZSl7XHJcbiAgLy9sb29wIGVsZW1lbnQgdG8gZmluZCB0aGUgaWQgdXNpbmcgd2hpbGVcclxuICB3aGlsZShlbG0ucGFyZW50Tm9kZSl7XHJcbiAgICBlbG0gPSBlbG0ucGFyZW50Tm9kZTtcclxuICAgIGxldCBpZDpzdHJpbmcgPSAoPEhUTUxFbGVtZW50PiBlbG0pLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICAgIGlmKCBpZCApe1xyXG4gICAgICByZXR1cm4gaWQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4vL2FwcCBsb2FkcyAtIHNob3cgbGlzdCBvZiB0YXNrcyBzdG9yaW5nIGluIHN0b3JhZ2Vcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgIGxldCB0YXNrZGF0YSA9IHRhc2tzdG9yYWdlLnJlYWQoIChkYXRhKSA9PiB7XHJcbiAgICAgaWYgKGRhdGEubGVuZ3RoID4gMCl7XHJcbiAgICAgICBkYXRhLmZvckVhY2goIChpdGVtKSA9PiB7XHJcbiAgICAgICAgIHRhc2thcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgfSk7XHJcbiAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcclxuICAgICB9XHJcbiAgIH0pO1xyXG5cclxuICAvL2NvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW5jZWwnKTtcclxuICAvLyg8SFRNTElucHV0RWxlbWVudD5jYW5jZWwpLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG5cclxufSk7XHJcblxyXG5cclxuXHJcbi8vcmVmZXJlbmNlIHRvIGZvcm1cclxuY29uc3QgdGFza2Zvcm0gPSAoPEhUTUxGb3JtRWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stZm9ybScpKTtcclxudGFza2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywoIGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xyXG4gIGxldCB0YXNrbmFtZSA9ICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkudmFsdWU7XHJcbiAgICB0YXNrZm9ybS5yZXNldCgpO1xyXG4gLy8gY29uc29sZS5sb2codGFza25hbWUpO1xyXG5cclxuICAgIGlmICh0YXNrbmFtZS5sZW5ndGggPiAwKXtcclxuICAgICAgbGV0IHRhc2sgPSBuZXcgVGFzayggdGFza25hbWUgKTtcclxuICAgICAgdGFza21hbmFnZXIuYWRkKCB0YXNrICk7XHJcbiAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XHJcblxyXG4gICAgICB0YXNrc3RvcmFnZS5zdG9yZSh0YXNrYXJyYXksIChyZXN1bHQpID0+IHtcclxuICAgICAgICBpZihyZXN1bHQpe1xyXG4gICAgICAgICAgdGFza2Zvcm0ucmVzZXQoKTtcclxuICAgICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XHJcbiAgICAgICAgICAvL2xpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgLy9lcnJvciB0byBkbyB3aXRoIHN0b3JhZ2VcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAgIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG5cclxuY29uc3QgbGlzdGVsZW1lbnQ6SFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1saXN0Jyk7XHJcbmxpc3RlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCBldmVudDogRXZlbnQpID0+IHtcclxuICBsZXQgdGFyZ2V0OkhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PiBldmVudC50YXJnZXQ7XHJcbiAgLy9maW5kIGEgd2F5IHRvIGdldCBsaSBlbGVtZW50IGNhdXNlIGJ1dHRvbiBpbnNpZGUgPGxpPlxyXG4gIGxldCBpZCA9IGdldFBhcmVudElkKCA8Tm9kZT4gZXZlbnQudGFyZ2V0KTtcclxuICAvL3dlIGhhdmUgc29tZSBidXR0b25zID0gY2hlY2sgd2hpY2ggb25lIHdlIGNsaWNrZWRcclxuXHJcbiAgLy93aGVuIGVkaXQgYnV0dG9uIGNsaWNrZWRcclxuICBpZiAoIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKSA9PSAnZWRpdCcpe1xyXG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xyXG4gICAgY29uc3QgYWRkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stYWRkJyk7XHJcbiAgICAvL2NvbnN0IGNhbmNlbEVkaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FuY2VsJyk7XHJcbiAgICAvLyg8SFRNTElucHV0RWxlbWVudD5jYW5jZWxFZGl0KS5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcblxyXG4gICAgaW5wdXQuZm9jdXMoKTtcclxuICAgICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkucGxhY2Vob2xkZXIgPSAnRWRpdCB0YXNrIG5hbWUgaGVyZSc7XHJcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+YWRkKS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+YWRkKS5pbm5lckhUTUwgPSAnQWRkIGRpc2FibGVkJztcclxuXHJcbiAgICBpZiggaWQgKXtcclxuICAgICAgbGV0IG5ld25hbWUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQpLnZhbHVlO1xyXG4gICAgICBpZihuZXduYW1lLmxlbmd0aCA+IDApe1xyXG4gICAgICAgIHRhc2ttYW5hZ2VyLmVkaXQoaWQsIG5ld25hbWUsICgpID0+IHtcclxuICAgICAgICAgIHRhc2tzdG9yYWdlLnN0b3JlKCB0YXNrYXJyYXksICgpID0+IHtcclxuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmFkZCkuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmlucHV0KS5wbGFjZWhvbGRlciA9ICcrIEFkZCBhIHRhc2snO1xyXG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+YWRkKS5pbm5lckhUTUwgPSAnQWRkJztcclxuICAgICAgICAgICAgLy8oPEhUTUxJbnB1dEVsZW1lbnQ+Y2FuY2VsRWRpdCkuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XHJcbiAgICAgICAgICAgIHRhc2tmb3JtLnJlc2V0KCk7IC8vY2xlYXIgaW5wdXQgdGV4dCBmaWVsZFxyXG4gICAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICggdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpID09ICdjYW5jZWxlZGl0Jyl7XHJcbiAgICAvL2NhbmNlbCBlZGl0IHN0YXRlXHJcbiAgICBjb25zdCBhZGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1hZGQnKTtcclxuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcclxuICAgICg8SFRNTElucHV0RWxlbWVudD5hZGQpLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQpLnBsYWNlaG9sZGVyID0gJysgQWRkIGEgdGFzayc7XHJcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+YWRkKS5pbm5lckhUTUwgPSAnQWRkJztcclxuICB9XHJcblxyXG4gIGlmICggdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpID09ICdzdGF0dXMnKXsvL3N0YXR1cyBidXR0b24gZ2V0IGNsaWNrZWRcclxuICAgIGlmKCBpZCApe1xyXG4gICAgICB0YXNrbWFuYWdlci5jaGFuZ2VTdGF0dXMoIGlkLCAoKSA9PnsvL2NhbGxiYWNrIHRlbGwgdGhlIHN5c3RlbSBjaGFuZ2Ugc3RhdHVzIHdoZW4gc3RhdHVzIGNoYW5nZWRcclxuICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSggdGFza2FycmF5LCAoKSA9PiB7XHJcbiAgICAgICAgICAvL2NhbmNlbCBlZGl0IHN0YXRlXHJcbiAgICAgICAgICBjb25zdCBhZGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1hZGQnKTtcclxuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcclxuICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5hZGQpLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQpLnBsYWNlaG9sZGVyID0gJysgQWRkIGEgdGFzayc7XHJcbiAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+YWRkKS5pbm5lckhUTUwgPSAnQWRkJztcclxuXHJcbiAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZ1bmN0aW9uJykgPT0gJ2RlbGV0ZScpe1xyXG4gICAgaWYoIGlkICl7XHJcbiAgICAgIHRhc2ttYW5hZ2VyLmRlbGV0ZSggaWQsICgpID0+IHtcclxuICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSh0YXNrYXJyYXksKCk9PntcclxuICAgICAgICAgIC8vY2FuY2VsIGVkaXQgc3RhdGVcclxuICAgICAgICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWFkZCcpO1xyXG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xyXG4gICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmFkZCkuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkucGxhY2Vob2xkZXIgPSAnKyBBZGQgYSB0YXNrJztcclxuICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5hZGQpLmlubmVySFRNTCA9ICdBZGQnO1xyXG5cclxuICAgICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XHJcbiAgICAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG4iLCJleHBvcnQgY2xhc3MgVGFza3tcclxuICBpZDogc3RyaW5nO1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBzdGF0dXM6IGJvb2xlYW47XHJcbiAgY29uc3RydWN0b3IodGFza25hbWU6IHN0cmluZyl7XHJcbiAgICB0aGlzLmlkID0gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKTtcclxuICAgIHRoaXMubmFtZSA9IHRhc2tuYW1lO1xyXG4gICAgdGhpcy5zdGF0dXMgPSBmYWxzZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBUYXNrTWFuYWdlciB7XHJcbiAgdGFza3M6IEFycmF5PFRhc2s+O1xyXG5cclxuICBjb25zdHJ1Y3RvciggYXJyYXk6IEFycmF5PFRhc2s+KXtcclxuICAgIHRoaXMudGFza3MgPSBhcnJheTtcclxuICB9XHJcbiAgYWRkKCB0YXNrOiBUYXNrICl7XHJcbiAgICB0aGlzLnRhc2tzLnB1c2godGFzayk7XHJcbiAgICB0aGlzLnNvcnQoIHRoaXMudGFza3MgKTtcclxuICB9XHJcbiAgZWRpdCggaWQ6U3RyaW5nLCBuZXduYW1lOnN0cmluZyxjYWxsYmFjayk6dm9pZHtcclxuICAgIHRoaXMudGFza3MuZm9yRWFjaCgodGFzazpUYXNrKSA9PiB7XHJcbiAgICAgIGlmKHRhc2suaWQgPT0gaWQpe1xyXG4gICAgICAgIHRhc2submFtZSA9IG5ld25hbWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgY2FsbGJhY2soKTtcclxuICB9XHJcbiAgZ2V0TmFtZShpZDogU3RyaW5nLCBjYWxsYmFjayl7XHJcbiAgICB0aGlzLnRhc2tzLmZvckVhY2goKHRhc2s6VGFzaykgPT4ge1xyXG4gICAgICBpZih0YXNrLmlkID09IGlkKXtcclxuICAgICAgICByZXR1cm4gdGFzay5uYW1lO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNhbGxiYWNrKCk7XHJcbiAgfVxyXG4gIGNoYW5nZVN0YXR1cyggaWQ6U3RyaW5nLCBjYWxsYmFjayApOnZvaWR7XHJcbiAgICB0aGlzLnRhc2tzLmZvckVhY2goKHRhc2s6VGFzaykgPT4ge1xyXG4gICAgICAgIGlmKHRhc2suaWQgPT0gaWQpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggdGFzay5pZCApO1xyXG4gICAgICAgICAgICBpZih0YXNrLnN0YXR1cyA9PSBmYWxzZSApe1xyXG4gICAgICAgICAgICAgICAgdGFzay5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICB0YXNrLnN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNvcnQoIHRoaXMudGFza3MgKTtcclxuICAgIGNhbGxiYWNrKCk7XHJcbiAgfVxyXG4gIGRlbGV0ZSggaWQ6c3RyaW5nLCBjYWxsYmFjayApe1xyXG4gICAgbGV0IGluZGV4X3RvX3JlbW92ZTogbnVtYmVyID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy50YXNrcy5mb3JFYWNoKCAoaXRlbTogVGFzaywgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICBpZiAoaXRlbS5pZCA9PSBpZCApe1xyXG4gICAgICAgIGluZGV4X3RvX3JlbW92ZSA9IGluZGV4O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vZGVsZXRlIGl0ZW0gd2l0aCBzcGVjaWZpZWQgaW5kZXhcclxuICAgIGlmICggaW5kZXhfdG9fcmVtb3ZlICE9PSB1bmRlZmluZWQgKXtcclxuICAgICAgdGhpcy50YXNrcy5zcGxpY2UgKGluZGV4X3RvX3JlbW92ZSwgMSk7XHJcbiAgICB9XHJcbiAgICBjYWxsYmFjaygpO1xyXG4gIH1cclxuICBzb3J0KCB0YXNrczpBcnJheTxUYXNrPiApe1xyXG4gICB0YXNrcy5zb3J0KCh0YXNrMSx0YXNrMikgPT4ge1xyXG4gICAgIGxldCBpZDE6bnVtYmVyID0gcGFyc2VJbnQoIHRhc2sxLmlkICk7XHJcbiAgICAgbGV0IGlkMjpudW1iZXIgPSBwYXJzZUludCggdGFzazIuaWQgKTtcclxuICAgICBpZiggdGFzazEuc3RhdHVzID09IHRydWUgJiYgdGFzazIuc3RhdHVzID09IGZhbHNlICl7XHJcbiAgICAgICByZXR1cm4gMTtcclxuICAgICB9XHJcbiAgICAgaWYoIHRhc2sxLnN0YXR1cyA9PSBmYWxzZSAmJiB0YXNrMi5zdGF0dXMgPT0gdHJ1ZSApe1xyXG4gICAgICAgcmV0dXJuIC0xO1xyXG4gICAgIH1cclxuICAgICBpZiggdGFzazEuc3RhdHVzICA9PSB0YXNrMi5zdGF0dXMgKXtcclxuICAgICAgIHJldHVybiAwO1xyXG4gICAgIH1cclxuICAgfSlcclxuIH1cclxufVxyXG4iXX0=
