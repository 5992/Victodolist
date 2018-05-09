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
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\">\n                            <div class=\"task-container\">\n                                <div class=\"task-name\">" + name + "</div>\n                            <div class=\"task-buttons\">\n                                <button type=\"button\" class=\"cancelbutton\" data-function=\"canceledit\">Cancel Edit</button>\n                                <button type=\"button\" data-function=\"edit\">&#9998;</button>\n                                <button type=\"button\" data-function=\"status\">&#x2714;</button>\n                                <button type=\"button\" data-function=\"delete\">&times;</button>\n            </div>\n            </div>\n            <li>";
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
        if (id) {
            var newname = input_1.value;
            if (newname.length > 0) {
                taskmanager.edit(id, newname, function () {
                    taskstorage.store(taskarray, function () {
                        add_1.disabled = false;
                        input_1.placeholder = '+ Add a task';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBO0lBRUU7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdkMsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZO1FBQ3RFLElBQUssV0FBVyxFQUFFO1lBQ2pCLFFBQVEsQ0FBRSxJQUFJLENBQUUsQ0FBQztTQUNqQjthQUNJO1lBQ0gsUUFBUSxDQUFFLEtBQUssQ0FBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUNELDBCQUFJLEdBQUosVUFBTSxRQUFRO1FBQ1YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUMvQixRQUFRLENBQUUsS0FBSyxDQUFFLENBQUM7SUFDdEIsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FwQkEsQUFvQkMsSUFBQTtBQXBCWSxrQ0FBVzs7OztBQ0F4QjtJQUVJLGtCQUFhLE1BQWE7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFFLE1BQU0sQ0FBRSxDQUFDO0lBQ2xELENBQUM7SUFDRCx5QkFBTSxHQUFOLFVBQVEsS0FBaUI7UUFB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LE1BQU0sSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUU7Z0JBQ2pELE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDWDtZQUNELElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSyxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNqQyxPQUFPLENBQUMsQ0FBQzthQUNWO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0Ysa0JBQUM7QUFBRCxDQXJFQSxBQXFFQyxJQUFBO0FBckVZLGtDQUFXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhdGFTdG9yYWdle1xyXG4gIHN0b3JhZ2U7XHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgICAgdGhpcy5zdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZTtcclxuICB9XHJcbiAgc3RvcmUoIGFycmF5OkFycmF5IDxUYXNrPiwgY2FsbGJhY2sgKXtcclxuICAgIGxldCBkYXRhID0gSlNPTi5zdHJpbmdpZnkoIGFycmF5KTtcclxuICAgIGxldCBzdG9yZXN0YXR1cyA9IHRoaXMuc3RvcmFnZS5zZXRJdGVtKCd0YXNrZGF0YScsIGRhdGEpOyAvL3N1Y2Nlc3NmdWxcclxuICAgIGlmICggc3RvcmVzdGF0dXMgKXtcclxuICAgICBjYWxsYmFjayggdHJ1ZSApO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKCBmYWxzZSApO1xyXG4gICAgfVxyXG4gIH1cclxuICByZWFkKCBjYWxsYmFjayApe1xyXG4gICAgICBsZXQgZGF0YSA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKCd0YXNrZGF0YScpO1xyXG4gICAgICBsZXQgYXJyYXkgPSBKU09OLnBhcnNlKCBkYXRhICk7XHJcbiAgICAgIGNhbGxiYWNrKCBhcnJheSApO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlzdFZpZXd7XHJcbiAgICBsaXN0OkhUTUxFbGVtZW50O1xyXG4gICAgY29uc3RydWN0b3IoIGxpc3RpZDpzdHJpbmcgKXtcclxuICAgICAgICB0aGlzLmxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbGlzdGlkICk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoIGl0ZW1zOkFycmF5PFRhc2s+ICl7XHJcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgodGFzaykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0YXNrLmlkO1xyXG4gICAgICAgICAgICBsZXQgbmFtZSA9IHRhc2submFtZTtcclxuICAgICAgICAgICAgbGV0IHN0YXR1cyA9IHRhc2suc3RhdHVzLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGA8bGkgaWQ9XCIke2lkfVwiIGRhdGEtc3RhdHVzPVwiJHtzdGF0dXN9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1uYW1lXCI+JHtuYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stYnV0dG9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2FuY2VsYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cImNhbmNlbGVkaXRcIj5DYW5jZWwgRWRpdDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJlZGl0XCI+JiM5OTk4OzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJzdGF0dXNcIj4mI3gyNzE0OzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJkZWxldGVcIj4mdGltZXM7PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGxpPmA7XHJcbiAgICAgICAgICAgIGxldCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCB0ZW1wbGF0ZSApO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2xlYXIoKXtcclxuICAgICAgICB0aGlzLmxpc3QuaW5uZXJIVE1MID0nJztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBMaXN0VmlldyB9IGZyb20gJy4uL3RzL2xpc3R2aWV3JztcclxuaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5pbXBvcnQgeyBUYXNrTWFuYWdlciB9IGZyb20gJy4uL3RzL3Rhc2ttYW5hZ2VyJztcclxuaW1wb3J0IHsgRGF0YVN0b3JhZ2UgfSBmcm9tICcuLi90cy9kYXRhc3RvcmFnZSc7XHJcblxyXG4vL2luaXRpYWxpc2VcclxudmFyIHRhc2thcnJheTpBcnJheTxhbnk+ID0gW107XHJcbnZhciB0YXNrc3RvcmFnZSA9IG5ldyBEYXRhU3RvcmFnZSgpO1xyXG52YXIgdGFza21hbmFnZXIgPSBuZXcgVGFza01hbmFnZXIodGFza2FycmF5KTtcclxudmFyIGxpc3R2aWV3ID0gbmV3IExpc3RWaWV3KCd0YXNrLWxpc3QnKTtcclxuXHJcblxyXG4vL2NsaWNrIGJ1dHRvbiwgZXZlbnQgY2FsbCB0aGlzIGZ1bmN0aW9uIHRvIGZpbmQgaWQgb2YgYnV0dG9uIGlmIGhhdmVcclxuZnVuY3Rpb24gZ2V0UGFyZW50SWQoZWxtOk5vZGUpe1xyXG4gIC8vbG9vcCBlbGVtZW50IHRvIGZpbmQgdGhlIGlkIHVzaW5nIHdoaWxlXHJcbiAgd2hpbGUoZWxtLnBhcmVudE5vZGUpe1xyXG4gICAgZWxtID0gZWxtLnBhcmVudE5vZGU7XHJcbiAgICBsZXQgaWQ6c3RyaW5nID0gKDxIVE1MRWxlbWVudD4gZWxtKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICBpZiggaWQgKXtcclxuICAgICAgcmV0dXJuIGlkO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLy9hcHAgbG9hZHMgLSBzaG93IGxpc3Qgb2YgdGFza3Mgc3RvcmluZyBpbiBzdG9yYWdlXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICBsZXQgdGFza2RhdGEgPSB0YXNrc3RvcmFnZS5yZWFkKCAoZGF0YSkgPT4ge1xyXG4gICAgIGlmIChkYXRhLmxlbmd0aCA+IDApe1xyXG4gICAgICAgZGF0YS5mb3JFYWNoKCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICB0YXNrYXJyYXkucHVzaChpdGVtKTtcclxuICAgICAgIH0pO1xyXG4gICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XHJcbiAgICAgfVxyXG4gICB9KTtcclxuXHJcbiAgLy9jb25zdCBjYW5jZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FuY2VsJyk7XHJcbiAgLy8oPEhUTUxJbnB1dEVsZW1lbnQ+Y2FuY2VsKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxuXHJcbn0pO1xyXG5cclxuXHJcblxyXG4vL3JlZmVyZW5jZSB0byBmb3JtXHJcbmNvbnN0IHRhc2tmb3JtID0gKDxIVE1MRm9ybUVsZW1lbnQ+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWZvcm0nKSk7XHJcbnRhc2tmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsKCBldmVudDogRXZlbnQpID0+IHtcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcclxuICBsZXQgdGFza25hbWUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQpLnZhbHVlO1xyXG4gICAgdGFza2Zvcm0ucmVzZXQoKTtcclxuIC8vIGNvbnNvbGUubG9nKHRhc2tuYW1lKTtcclxuXHJcbiAgICBpZiAodGFza25hbWUubGVuZ3RoID4gMCl7XHJcbiAgICAgIGxldCB0YXNrID0gbmV3IFRhc2soIHRhc2tuYW1lICk7XHJcbiAgICAgIHRhc2ttYW5hZ2VyLmFkZCggdGFzayApO1xyXG4gICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG5cclxuICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYocmVzdWx0KXtcclxuICAgICAgICAgIHRhc2tmb3JtLnJlc2V0KCk7XHJcbiAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgICAgLy9saXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIC8vZXJyb3IgdG8gZG8gd2l0aCBzdG9yYWdlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcclxuICAgIH1cclxufSk7XHJcblxyXG5cclxuXHJcbmNvbnN0IGxpc3RlbGVtZW50OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stbGlzdCcpO1xyXG5saXN0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICggZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgbGV0IHRhcmdldDpIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD4gZXZlbnQudGFyZ2V0O1xyXG4gIC8vZmluZCBhIHdheSB0byBnZXQgbGkgZWxlbWVudCBjYXVzZSBidXR0b24gaW5zaWRlIDxsaT5cclxuICBsZXQgaWQgPSBnZXRQYXJlbnRJZCggPE5vZGU+IGV2ZW50LnRhcmdldCk7XHJcbiAgLy93ZSBoYXZlIHNvbWUgYnV0dG9ucyA9IGNoZWNrIHdoaWNoIG9uZSB3ZSBjbGlja2VkXHJcblxyXG4gIC8vd2hlbiBlZGl0IGJ1dHRvbiBjbGlja2VkXHJcbiAgaWYgKCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZ1bmN0aW9uJykgPT0gJ2VkaXQnKXtcclxuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcclxuICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWFkZCcpO1xyXG4gICAgLy9jb25zdCBjYW5jZWxFZGl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbmNlbCcpO1xyXG4gICAgLy8oPEhUTUxJbnB1dEVsZW1lbnQ+Y2FuY2VsRWRpdCkuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG5cclxuICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQpLnBsYWNlaG9sZGVyID0gJ0VkaXQgdGFzayBuYW1lIGhlcmUnO1xyXG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PmFkZCkuZGlzYWJsZWQgPSB0cnVlO1xyXG5cclxuICAgIGlmKCBpZCApe1xyXG4gICAgICBsZXQgbmV3bmFtZSA9ICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkudmFsdWU7XHJcbiAgICAgIGlmKG5ld25hbWUubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgdGFza21hbmFnZXIuZWRpdChpZCwgbmV3bmFtZSwgKCkgPT4ge1xyXG4gICAgICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUoIHRhc2thcnJheSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+YWRkKS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQpLnBsYWNlaG9sZGVyID0gJysgQWRkIGEgdGFzayc7XHJcbiAgICAgICAgICAgIC8vKDxIVE1MSW5wdXRFbGVtZW50PmNhbmNlbEVkaXQpLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG4gICAgICAgICAgICB0YXNrZm9ybS5yZXNldCgpOyAvL2NsZWFyIGlucHV0IHRleHQgZmllbGRcclxuICAgICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKSA9PSAnY2FuY2VsZWRpdCcpe1xyXG4gICAgLy9jYW5jZWwgZWRpdCBzdGF0ZVxyXG4gICAgY29uc3QgYWRkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stYWRkJyk7XHJcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWlucHV0Jyk7XHJcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+YWRkKS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PmlucHV0KS5wbGFjZWhvbGRlciA9ICcrIEFkZCBhIHRhc2snO1xyXG4gIH1cclxuXHJcbiAgaWYgKCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZ1bmN0aW9uJykgPT0gJ3N0YXR1cycpey8vc3RhdHVzIGJ1dHRvbiBnZXQgY2xpY2tlZFxyXG4gICAgaWYoIGlkICl7XHJcbiAgICAgIHRhc2ttYW5hZ2VyLmNoYW5nZVN0YXR1cyggaWQsICgpID0+ey8vY2FsbGJhY2sgdGVsbCB0aGUgc3lzdGVtIGNoYW5nZSBzdGF0dXMgd2hlbiBzdGF0dXMgY2hhbmdlZFxyXG4gICAgICAgIHRhc2tzdG9yYWdlLnN0b3JlKCB0YXNrYXJyYXksICgpID0+IHtcclxuICAgICAgICAgIC8vY2FuY2VsIGVkaXQgc3RhdGVcclxuICAgICAgICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWFkZCcpO1xyXG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xyXG4gICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmFkZCkuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkucGxhY2Vob2xkZXIgPSAnKyBBZGQgYSB0YXNrJztcclxuXHJcbiAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZ1bmN0aW9uJykgPT0gJ2RlbGV0ZScpe1xyXG4gICAgaWYoIGlkICl7XHJcbiAgICAgIHRhc2ttYW5hZ2VyLmRlbGV0ZSggaWQsICgpID0+IHtcclxuICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSh0YXNrYXJyYXksKCk9PntcclxuICAgICAgICAgIC8vY2FuY2VsIGVkaXQgc3RhdGVcclxuICAgICAgICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWFkZCcpO1xyXG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xyXG4gICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmFkZCkuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkucGxhY2Vob2xkZXIgPSAnKyBBZGQgYSB0YXNrJztcclxuXHJcbiAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuIiwiZXhwb3J0IGNsYXNzIFRhc2t7XHJcbiAgaWQ6IHN0cmluZztcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgc3RhdHVzOiBib29sZWFuO1xyXG4gIGNvbnN0cnVjdG9yKHRhc2tuYW1lOiBzdHJpbmcpe1xyXG4gICAgdGhpcy5pZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKCk7XHJcbiAgICB0aGlzLm5hbWUgPSB0YXNrbmFtZTtcclxuICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuLi90cy90YXNrJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVGFza01hbmFnZXIge1xyXG4gIHRhc2tzOiBBcnJheTxUYXNrPjtcclxuXHJcbiAgY29uc3RydWN0b3IoIGFycmF5OiBBcnJheTxUYXNrPil7XHJcbiAgICB0aGlzLnRhc2tzID0gYXJyYXk7XHJcbiAgfVxyXG4gIGFkZCggdGFzazogVGFzayApe1xyXG4gICAgdGhpcy50YXNrcy5wdXNoKHRhc2spO1xyXG4gICAgdGhpcy5zb3J0KCB0aGlzLnRhc2tzICk7XHJcbiAgfVxyXG4gIGVkaXQoIGlkOlN0cmluZywgbmV3bmFtZTpzdHJpbmcsY2FsbGJhY2spOnZvaWR7XHJcbiAgICB0aGlzLnRhc2tzLmZvckVhY2goKHRhc2s6VGFzaykgPT4ge1xyXG4gICAgICBpZih0YXNrLmlkID09IGlkKXtcclxuICAgICAgICB0YXNrLm5hbWUgPSBuZXduYW1lO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNhbGxiYWNrKCk7XHJcbiAgfVxyXG4gIGdldE5hbWUoaWQ6IFN0cmluZywgY2FsbGJhY2spe1xyXG4gICAgdGhpcy50YXNrcy5mb3JFYWNoKCh0YXNrOlRhc2spID0+IHtcclxuICAgICAgaWYodGFzay5pZCA9PSBpZCl7XHJcbiAgICAgICAgcmV0dXJuIHRhc2submFtZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjYWxsYmFjaygpO1xyXG4gIH1cclxuICBjaGFuZ2VTdGF0dXMoIGlkOlN0cmluZywgY2FsbGJhY2sgKTp2b2lke1xyXG4gICAgdGhpcy50YXNrcy5mb3JFYWNoKCh0YXNrOlRhc2spID0+IHtcclxuICAgICAgICBpZih0YXNrLmlkID09IGlkKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coIHRhc2suaWQgKTtcclxuICAgICAgICAgICAgaWYodGFzay5zdGF0dXMgPT0gZmFsc2UgKXtcclxuICAgICAgICAgICAgICAgIHRhc2suc3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdGFzay5zdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy5zb3J0KCB0aGlzLnRhc2tzICk7XHJcbiAgICBjYWxsYmFjaygpO1xyXG4gIH1cclxuICBkZWxldGUoIGlkOnN0cmluZywgY2FsbGJhY2sgKXtcclxuICAgIGxldCBpbmRleF90b19yZW1vdmU6IG51bWJlciA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMudGFza3MuZm9yRWFjaCggKGl0ZW06IFRhc2ssIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uaWQgPT0gaWQgKXtcclxuICAgICAgICBpbmRleF90b19yZW1vdmUgPSBpbmRleDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvL2RlbGV0ZSBpdGVtIHdpdGggc3BlY2lmaWVkIGluZGV4XHJcbiAgICBpZiAoIGluZGV4X3RvX3JlbW92ZSAhPT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHRoaXMudGFza3Muc3BsaWNlIChpbmRleF90b19yZW1vdmUsIDEpO1xyXG4gICAgfVxyXG4gICAgY2FsbGJhY2soKTtcclxuICB9XHJcbiAgc29ydCggdGFza3M6QXJyYXk8VGFzaz4gKXtcclxuICAgdGFza3Muc29ydCgodGFzazEsdGFzazIpID0+IHtcclxuICAgICBsZXQgaWQxOm51bWJlciA9IHBhcnNlSW50KCB0YXNrMS5pZCApO1xyXG4gICAgIGxldCBpZDI6bnVtYmVyID0gcGFyc2VJbnQoIHRhc2syLmlkICk7XHJcbiAgICAgaWYoIHRhc2sxLnN0YXR1cyA9PSB0cnVlICYmIHRhc2syLnN0YXR1cyA9PSBmYWxzZSApe1xyXG4gICAgICAgcmV0dXJuIDE7XHJcbiAgICAgfVxyXG4gICAgIGlmKCB0YXNrMS5zdGF0dXMgPT0gZmFsc2UgJiYgdGFzazIuc3RhdHVzID09IHRydWUgKXtcclxuICAgICAgIHJldHVybiAtMTtcclxuICAgICB9XHJcbiAgICAgaWYoIHRhc2sxLnN0YXR1cyAgPT0gdGFzazIuc3RhdHVzICl7XHJcbiAgICAgICByZXR1cm4gMDtcclxuICAgICB9XHJcbiAgIH0pXHJcbiB9XHJcbn1cclxuIl19
