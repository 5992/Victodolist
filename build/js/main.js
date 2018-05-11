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
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\">\n                            <div class=\"task-container\">\n                                <div class=\"task-name\">" + name + "</div>\n                            <div class=\"task-buttons\">\n                                <button type=\"button\" class=\"cancelbutton\" id='canceledit' data-function=\"canceledit\">Cancel Edit</button>\n                                <button type=\"button\" data-function=\"edit\">&#9998;</button>\n                                <button type=\"button\" data-function=\"status\">&#x2714;</button>\n                                <button type=\"button\" data-function=\"delete\">&times;</button>\n            </div>\n            </div>\n            <li>";
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
        //make cancel button visible
        var cancel_1 = document.getElementById('canceledit');
        cancel_1.style.visibility = "visible";
        //focus on input and disable add task button
        var input_1 = document.getElementById('task-input');
        var add_1 = document.getElementById('task-add');
        input_1.focus();
        input_1.placeholder = 'Edit task name here'; // change the placeholder text
        add_1.disabled = true;
        if (id) {
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
        //cancel edit state
        var add = document.getElementById('task-add');
        var input = document.getElementById('task-input');
        add.disabled = false;
        input.placeholder = '+ Add a task';
        //hide the cancel button
        var cancel = document.getElementById('canceledit');
        cancel.style.visibility = "hidden";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBO0lBRUU7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdkMsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZO1FBQ3RFLElBQUssV0FBVyxFQUFFO1lBQ2pCLFFBQVEsQ0FBRSxJQUFJLENBQUUsQ0FBQztTQUNqQjthQUNJO1lBQ0gsUUFBUSxDQUFFLEtBQUssQ0FBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUNELDBCQUFJLEdBQUosVUFBTSxRQUFRO1FBQ1YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUMvQixRQUFRLENBQUUsS0FBSyxDQUFFLENBQUM7SUFDdEIsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FwQkEsQUFvQkMsSUFBQTtBQXBCWSxrQ0FBVzs7OztBQ0F4QjtJQUVJLGtCQUFhLE1BQWE7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFFLE1BQU0sQ0FBRSxDQUFDO0lBQ2xELENBQUM7SUFDRCx5QkFBTSxHQUFOLFVBQVEsS0FBaUI7UUFB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RUFBRTtnQkFDakIsZUFBZSxHQUFHLEtBQUssQ0FBQzthQUN6QjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsa0NBQWtDO1FBQ2xDLElBQUssZUFBZSxLQUFLLFNBQVMsRUFBRTtZQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDeEM7UUFDRCxRQUFRLEVBQUUsQ0FBQztJQUNiLENBQUM7SUFDRCwwQkFBSSxHQUFKLFVBQU0sS0FBaUI7UUFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFDLEtBQUssRUFBQyxLQUFLO1lBQ3JCLElBQUksR0FBRyxHQUFVLFFBQVEsQ0FBRSxLQUFLLENBQUMsRUFBRSxDQUFFLENBQUM7WUFDdEMsSUFBSSxHQUFHLEdBQVUsUUFBUSxDQUFFLEtBQUssQ0FBQyxFQUFFLENBQUUsQ0FBQztZQUN0QyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFFO2dCQUNqRCxPQUFPLENBQUMsQ0FBQzthQUNWO1lBQ0QsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtnQkFDakQsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUNYO1lBQ0QsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ2pDLE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7UUFDSCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRixrQkFBQztBQUFELENBckVBLEFBcUVDLElBQUE7QUFyRVksa0NBQVciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcblxyXG5leHBvcnQgY2xhc3MgRGF0YVN0b3JhZ2V7XHJcbiAgc3RvcmFnZTtcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICB0aGlzLnN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xyXG4gIH1cclxuICBzdG9yZSggYXJyYXk6QXJyYXkgPFRhc2s+LCBjYWxsYmFjayApe1xyXG4gICAgbGV0IGRhdGEgPSBKU09OLnN0cmluZ2lmeSggYXJyYXkpO1xyXG4gICAgbGV0IHN0b3Jlc3RhdHVzID0gdGhpcy5zdG9yYWdlLnNldEl0ZW0oJ3Rhc2tkYXRhJywgZGF0YSk7IC8vc3VjY2Vzc2Z1bFxyXG4gICAgaWYgKCBzdG9yZXN0YXR1cyApe1xyXG4gICAgIGNhbGxiYWNrKCB0cnVlICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY2FsbGJhY2soIGZhbHNlICk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlYWQoIGNhbGxiYWNrICl7XHJcbiAgICAgIGxldCBkYXRhID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0oJ3Rhc2tkYXRhJyk7XHJcbiAgICAgIGxldCBhcnJheSA9IEpTT04ucGFyc2UoIGRhdGEgKTtcclxuICAgICAgY2FsbGJhY2soIGFycmF5ICk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuLi90cy90YXNrJztcclxuXHJcbmV4cG9ydCBjbGFzcyBMaXN0Vmlld3tcclxuICAgIGxpc3Q6SFRNTEVsZW1lbnQ7XHJcbiAgICBjb25zdHJ1Y3RvciggbGlzdGlkOnN0cmluZyApe1xyXG4gICAgICAgIHRoaXMubGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBsaXN0aWQgKTtcclxuICAgIH1cclxuICAgIHJlbmRlciggaXRlbXM6QXJyYXk8VGFzaz4gKXtcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKCh0YXNrKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRhc2suaWQ7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gdGFzay5uYW1lO1xyXG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gdGFzay5zdGF0dXMudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gYDxsaSBpZD1cIiR7aWR9XCIgZGF0YS1zdGF0dXM9XCIke3N0YXR1c31cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLW5hbWVcIj4ke25hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1idXR0b25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjYW5jZWxidXR0b25cIiBpZD0nY2FuY2VsZWRpdCcgZGF0YS1mdW5jdGlvbj1cImNhbmNlbGVkaXRcIj5DYW5jZWwgRWRpdDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJlZGl0XCI+JiM5OTk4OzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJzdGF0dXNcIj4mI3gyNzE0OzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJkZWxldGVcIj4mdGltZXM7PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGxpPmA7XHJcbiAgICAgICAgICAgIGxldCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCB0ZW1wbGF0ZSApO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2xlYXIoKXtcclxuICAgICAgICB0aGlzLmxpc3QuaW5uZXJIVE1MID0nJztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBMaXN0VmlldyB9IGZyb20gJy4uL3RzL2xpc3R2aWV3JztcclxuaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5pbXBvcnQgeyBUYXNrTWFuYWdlciB9IGZyb20gJy4uL3RzL3Rhc2ttYW5hZ2VyJztcclxuaW1wb3J0IHsgRGF0YVN0b3JhZ2UgfSBmcm9tICcuLi90cy9kYXRhc3RvcmFnZSc7XHJcblxyXG4vL2luaXRpYWxpc2VcclxudmFyIHRhc2thcnJheTpBcnJheTxhbnk+ID0gW107XHJcbnZhciB0YXNrc3RvcmFnZSA9IG5ldyBEYXRhU3RvcmFnZSgpO1xyXG52YXIgdGFza21hbmFnZXIgPSBuZXcgVGFza01hbmFnZXIodGFza2FycmF5KTtcclxudmFyIGxpc3R2aWV3ID0gbmV3IExpc3RWaWV3KCd0YXNrLWxpc3QnKTtcclxuXHJcblxyXG4vL2NsaWNrIGJ1dHRvbiwgZXZlbnQgY2FsbCB0aGlzIGZ1bmN0aW9uIHRvIGZpbmQgaWQgb2YgYnV0dG9uIGlmIGhhdmVcclxuZnVuY3Rpb24gZ2V0UGFyZW50SWQoZWxtOk5vZGUpe1xyXG4gIC8vbG9vcCBlbGVtZW50IHRvIGZpbmQgdGhlIGlkIHVzaW5nIHdoaWxlXHJcbiAgd2hpbGUoZWxtLnBhcmVudE5vZGUpe1xyXG4gICAgZWxtID0gZWxtLnBhcmVudE5vZGU7XHJcbiAgICBsZXQgaWQ6c3RyaW5nID0gKDxIVE1MRWxlbWVudD4gZWxtKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICBpZiggaWQgKXtcclxuICAgICAgcmV0dXJuIGlkO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLy9hcHAgbG9hZHMgLSBzaG93IGxpc3Qgb2YgdGFza3Mgc3RvcmluZyBpbiBzdG9yYWdlXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICBsZXQgdGFza2RhdGEgPSB0YXNrc3RvcmFnZS5yZWFkKCAoZGF0YSkgPT4ge1xyXG4gICAgIGlmIChkYXRhLmxlbmd0aCA+IDApe1xyXG4gICAgICAgZGF0YS5mb3JFYWNoKCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICB0YXNrYXJyYXkucHVzaChpdGVtKTtcclxuICAgICAgIH0pO1xyXG4gICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XHJcblxyXG4gICAgIH1cclxuICAgfSk7XHJcbn0pO1xyXG5cclxuXHJcblxyXG4vL3JlZmVyZW5jZSB0byBmb3JtXHJcbmNvbnN0IHRhc2tmb3JtID0gKDxIVE1MRm9ybUVsZW1lbnQ+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWZvcm0nKSk7XHJcbnRhc2tmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsKCBldmVudDogRXZlbnQpID0+IHtcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcclxuICBsZXQgdGFza25hbWUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQpLnZhbHVlO1xyXG4gICAgdGFza2Zvcm0ucmVzZXQoKTtcclxuIC8vIGNvbnNvbGUubG9nKHRhc2tuYW1lKTtcclxuXHJcbiAgICBpZiAodGFza25hbWUubGVuZ3RoID4gMCl7XHJcbiAgICAgIGxldCB0YXNrID0gbmV3IFRhc2soIHRhc2tuYW1lICk7XHJcbiAgICAgIHRhc2ttYW5hZ2VyLmFkZCggdGFzayApO1xyXG4gICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG5cclxuICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYocmVzdWx0KXtcclxuICAgICAgICAgIHRhc2tmb3JtLnJlc2V0KCk7XHJcbiAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgICAgLy9saXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIC8vZXJyb3IgdG8gZG8gd2l0aCBzdG9yYWdlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcclxuICAgIH1cclxufSk7XHJcblxyXG5cclxuXHJcbmNvbnN0IGxpc3RlbGVtZW50OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stbGlzdCcpO1xyXG5saXN0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICggZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgbGV0IHRhcmdldDpIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD4gZXZlbnQudGFyZ2V0O1xyXG4gIC8vZmluZCBhIHdheSB0byBnZXQgbGkgZWxlbWVudCBjYXVzZSBidXR0b24gaW5zaWRlIDxsaT5cclxuICBsZXQgaWQgPSBnZXRQYXJlbnRJZCggPE5vZGU+IGV2ZW50LnRhcmdldCk7XHJcbiAgLy93ZSBoYXZlIHNvbWUgYnV0dG9ucyA9IGNoZWNrIHdoaWNoIG9uZSB3ZSBjbGlja2VkXHJcblxyXG4gIC8vd2hlbiBlZGl0IGJ1dHRvbiBjbGlja2VkXHJcbiAgaWYgKCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZ1bmN0aW9uJykgPT0gJ2VkaXQnKXtcclxuICAgIC8vbWFrZSBjYW5jZWwgYnV0dG9uIHZpc2libGVcclxuICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW5jZWxlZGl0Jyk7XHJcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+Y2FuY2VsKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICAvL2ZvY3VzIG9uIGlucHV0IGFuZCBkaXNhYmxlIGFkZCB0YXNrIGJ1dHRvblxyXG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xyXG4gICAgY29uc3QgYWRkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stYWRkJyk7XHJcbiAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PmlucHV0KS5wbGFjZWhvbGRlciA9ICdFZGl0IHRhc2sgbmFtZSBoZXJlJzsgLy8gY2hhbmdlIHRoZSBwbGFjZWhvbGRlciB0ZXh0XHJcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+YWRkKS5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG4gICAgaWYoIGlkICl7XHJcbiAgICAgIGxldCBuZXduYW1lID0gKDxIVE1MSW5wdXRFbGVtZW50PmlucHV0KS52YWx1ZTtcclxuICAgICAgaWYobmV3bmFtZS5sZW5ndGggPiAwKXtcclxuICAgICAgICB0YXNrbWFuYWdlci5lZGl0KGlkLCBuZXduYW1lLCAoKSA9PiB7XHJcbiAgICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSggdGFza2FycmF5LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGVuYWJsZSB0aGUgYWRkIGJ1dHRvblxyXG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+YWRkKS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQpLnBsYWNlaG9sZGVyID0gJysgQWRkIGEgdGFzayc7XHJcbiAgICAgICAgICAgIC8vaGlkZSB0aGUgY2FuY2VsIGVkaXQgYnV0dG9uIGFmdGVyIGZpbmlzaCBlZGl0IHN0YWdlXHJcbiAgICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5jYW5jZWwpLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG4gICAgICAgICAgICB0YXNrZm9ybS5yZXNldCgpOyAvL2NsZWFyIGlucHV0IHRleHQgZmllbGRcclxuICAgICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKSA9PSAnY2FuY2VsZWRpdCcpe1xyXG4gICAgLy9jYW5jZWwgZWRpdCBzdGF0ZVxyXG4gICAgY29uc3QgYWRkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stYWRkJyk7XHJcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWlucHV0Jyk7XHJcbiAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+YWRkKS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgKDxIVE1MSW5wdXRFbGVtZW50PmlucHV0KS5wbGFjZWhvbGRlciA9ICcrIEFkZCBhIHRhc2snO1xyXG5cclxuICAgIC8vaGlkZSB0aGUgY2FuY2VsIGJ1dHRvblxyXG4gICAgY29uc3QgY2FuY2VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbmNlbGVkaXQnKTtcclxuICAgICg8SFRNTElucHV0RWxlbWVudD5jYW5jZWwpLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG4gIH1cclxuXHJcbiAgaWYgKCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZ1bmN0aW9uJykgPT0gJ3N0YXR1cycpey8vc3RhdHVzIGJ1dHRvbiBnZXQgY2xpY2tlZFxyXG4gICAgaWYoIGlkICl7XHJcbiAgICAgIHRhc2ttYW5hZ2VyLmNoYW5nZVN0YXR1cyggaWQsICgpID0+ey8vY2FsbGJhY2sgdGVsbCB0aGUgc3lzdGVtIGNoYW5nZSBzdGF0dXMgd2hlbiBzdGF0dXMgY2hhbmdlZFxyXG4gICAgICAgIHRhc2tzdG9yYWdlLnN0b3JlKCB0YXNrYXJyYXksICgpID0+IHtcclxuICAgICAgICAgIC8vY2FuY2VsIGVkaXQgc3RhdGVcclxuICAgICAgICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWFkZCcpO1xyXG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xyXG4gICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmFkZCkuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkucGxhY2Vob2xkZXIgPSAnKyBBZGQgYSB0YXNrJztcclxuXHJcbiAgICAgICAgICAvL2hpZGUgdGhlIGNhbmNlbCBidXR0b25cclxuICAgICAgICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW5jZWxlZGl0Jyk7XHJcbiAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+Y2FuY2VsKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxuXHJcbiAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZ1bmN0aW9uJykgPT0gJ2RlbGV0ZScpe1xyXG4gICAgaWYoIGlkICl7XHJcbiAgICAgIHRhc2ttYW5hZ2VyLmRlbGV0ZSggaWQsICgpID0+IHtcclxuICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSh0YXNrYXJyYXksKCk9PntcclxuICAgICAgICAgIC8vY2FuY2VsIGVkaXQgc3RhdGVcclxuICAgICAgICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWFkZCcpO1xyXG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xyXG4gICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmFkZCkuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkucGxhY2Vob2xkZXIgPSAnKyBBZGQgYSB0YXNrJztcclxuXHJcbiAgICAgICAgICAvL2hpZGUgdGhlIGNhbmNlbCBidXR0b25cclxuICAgICAgICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW5jZWxlZGl0Jyk7XHJcbiAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+Y2FuY2VsKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxuXHJcbiAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuIiwiZXhwb3J0IGNsYXNzIFRhc2t7XHJcbiAgaWQ6IHN0cmluZztcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgc3RhdHVzOiBib29sZWFuO1xyXG4gIGNvbnN0cnVjdG9yKHRhc2tuYW1lOiBzdHJpbmcpe1xyXG4gICAgdGhpcy5pZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKCk7XHJcbiAgICB0aGlzLm5hbWUgPSB0YXNrbmFtZTtcclxuICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuLi90cy90YXNrJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVGFza01hbmFnZXIge1xyXG4gIHRhc2tzOiBBcnJheTxUYXNrPjtcclxuXHJcbiAgY29uc3RydWN0b3IoIGFycmF5OiBBcnJheTxUYXNrPil7XHJcbiAgICB0aGlzLnRhc2tzID0gYXJyYXk7XHJcbiAgfVxyXG4gIGFkZCggdGFzazogVGFzayApe1xyXG4gICAgdGhpcy50YXNrcy5wdXNoKHRhc2spO1xyXG4gICAgdGhpcy5zb3J0KCB0aGlzLnRhc2tzICk7XHJcbiAgfVxyXG4gIGVkaXQoIGlkOlN0cmluZywgbmV3bmFtZTpzdHJpbmcsY2FsbGJhY2spOnZvaWR7XHJcbiAgICB0aGlzLnRhc2tzLmZvckVhY2goKHRhc2s6VGFzaykgPT4ge1xyXG4gICAgICBpZih0YXNrLmlkID09IGlkKXtcclxuICAgICAgICB0YXNrLm5hbWUgPSBuZXduYW1lO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNhbGxiYWNrKCk7XHJcbiAgfVxyXG4gIGdldE5hbWUoaWQ6IFN0cmluZywgY2FsbGJhY2spe1xyXG4gICAgdGhpcy50YXNrcy5mb3JFYWNoKCh0YXNrOlRhc2spID0+IHtcclxuICAgICAgaWYodGFzay5pZCA9PSBpZCl7XHJcbiAgICAgICAgcmV0dXJuIHRhc2submFtZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjYWxsYmFjaygpO1xyXG4gIH1cclxuICBjaGFuZ2VTdGF0dXMoIGlkOlN0cmluZywgY2FsbGJhY2sgKTp2b2lke1xyXG4gICAgdGhpcy50YXNrcy5mb3JFYWNoKCh0YXNrOlRhc2spID0+IHtcclxuICAgICAgICBpZih0YXNrLmlkID09IGlkKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coIHRhc2suaWQgKTtcclxuICAgICAgICAgICAgaWYodGFzay5zdGF0dXMgPT0gZmFsc2UgKXtcclxuICAgICAgICAgICAgICAgIHRhc2suc3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdGFzay5zdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy5zb3J0KCB0aGlzLnRhc2tzICk7XHJcbiAgICBjYWxsYmFjaygpO1xyXG4gIH1cclxuICBkZWxldGUoIGlkOnN0cmluZywgY2FsbGJhY2sgKXtcclxuICAgIGxldCBpbmRleF90b19yZW1vdmU6IG51bWJlciA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMudGFza3MuZm9yRWFjaCggKGl0ZW06IFRhc2ssIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uaWQgPT0gaWQgKXtcclxuICAgICAgICBpbmRleF90b19yZW1vdmUgPSBpbmRleDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvL2RlbGV0ZSBpdGVtIHdpdGggc3BlY2lmaWVkIGluZGV4XHJcbiAgICBpZiAoIGluZGV4X3RvX3JlbW92ZSAhPT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHRoaXMudGFza3Muc3BsaWNlIChpbmRleF90b19yZW1vdmUsIDEpO1xyXG4gICAgfVxyXG4gICAgY2FsbGJhY2soKTtcclxuICB9XHJcbiAgc29ydCggdGFza3M6QXJyYXk8VGFzaz4gKXtcclxuICAgdGFza3Muc29ydCgodGFzazEsdGFzazIpID0+IHtcclxuICAgICBsZXQgaWQxOm51bWJlciA9IHBhcnNlSW50KCB0YXNrMS5pZCApO1xyXG4gICAgIGxldCBpZDI6bnVtYmVyID0gcGFyc2VJbnQoIHRhc2syLmlkICk7XHJcbiAgICAgaWYoIHRhc2sxLnN0YXR1cyA9PSB0cnVlICYmIHRhc2syLnN0YXR1cyA9PSBmYWxzZSApe1xyXG4gICAgICAgcmV0dXJuIDE7XHJcbiAgICAgfVxyXG4gICAgIGlmKCB0YXNrMS5zdGF0dXMgPT0gZmFsc2UgJiYgdGFzazIuc3RhdHVzID09IHRydWUgKXtcclxuICAgICAgIHJldHVybiAtMTtcclxuICAgICB9XHJcbiAgICAgaWYoIHRhc2sxLnN0YXR1cyAgPT0gdGFzazIuc3RhdHVzICl7XHJcbiAgICAgICByZXR1cm4gMDtcclxuICAgICB9XHJcbiAgIH0pXHJcbiB9XHJcbn1cclxuIl19
