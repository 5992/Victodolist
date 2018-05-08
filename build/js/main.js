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
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\">\n                      <div class=\"task-container\">\n                          <div class=\"task-name\">" + name + "</div>\n                      <div class=\"task-buttons\">\n                          <button type=\"button\" data-function=\"status\">&#x2714;</button>\n                          <button type=\"button\" data-function-\"delete\">&times;</button>\n      </div>\n      </div>\n      <li>";
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
    var task = new task_1.Task(taskname);
    taskmanager.add(task);
    listview.clear();
    taskstorage.store(taskarray, function (result) {
        if (result) {
            taskform.reset();
            listview.clear();
            listview.render(taskarray);
        }
        else {
            //error to do with storage
        }
    });
    listview.render(taskarray);
});
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
var listelement = document.getElementById('task-list');
listelement.addEventListener('click', function (event) {
    var target = event.target;
    //find a way to get li element cause button inside <li>
    var id = getParentId(event.target);
    //console.log( id );
    //we have 2 button = check which one we clicked
    if (target.getAttribute('data-function') == 'status') { //status button get clicked
        if (id) {
            taskmanager.changeStatus(id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
                //listview.clear();
                //listview.reander(taskarray);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBO0lBRUU7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdkMsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZO1FBQ3RFLElBQUssV0FBVyxFQUFFO1lBQ2pCLFFBQVEsQ0FBRSxJQUFJLENBQUUsQ0FBQztTQUNqQjthQUNJO1lBQ0gsUUFBUSxDQUFFLEtBQUssQ0FBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUNELDBCQUFJLEdBQUosVUFBTSxRQUFRO1FBQ1YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUMvQixRQUFRLENBQUUsS0FBSyxDQUFFLENBQUM7SUFDdEIsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FwQkEsQUFvQkMsSUFBQTtBQXBCWSxrQ0FBVzs7OztBQ0F4QjtJQUVFLGtCQUFhLE1BQWE7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFFLE1BQU0sQ0FBRSxDQUFDO0lBQ2hELENBQUM7SUFDRCx5QkFBTSxHQUFOLFVBQVEsS0FBaUI7UUFB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SUFDSCxrQkFBQztBQUFELENBbkRBLEFBbURDLElBQUE7QUFuRFksa0NBQVciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcblxyXG5leHBvcnQgY2xhc3MgRGF0YVN0b3JhZ2V7XHJcbiAgc3RvcmFnZTtcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICB0aGlzLnN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xyXG4gIH1cclxuICBzdG9yZSggYXJyYXk6QXJyYXkgPFRhc2s+LCBjYWxsYmFjayApe1xyXG4gICAgbGV0IGRhdGEgPSBKU09OLnN0cmluZ2lmeSggYXJyYXkpO1xyXG4gICAgbGV0IHN0b3Jlc3RhdHVzID0gdGhpcy5zdG9yYWdlLnNldEl0ZW0oJ3Rhc2tkYXRhJywgZGF0YSk7IC8vc3VjY2Vzc2Z1bFxyXG4gICAgaWYgKCBzdG9yZXN0YXR1cyApe1xyXG4gICAgIGNhbGxiYWNrKCB0cnVlICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY2FsbGJhY2soIGZhbHNlICk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlYWQoIGNhbGxiYWNrICl7XHJcbiAgICAgIGxldCBkYXRhID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0oJ3Rhc2tkYXRhJyk7XHJcbiAgICAgIGxldCBhcnJheSA9IEpTT04ucGFyc2UoIGRhdGEgKTtcclxuICAgICAgY2FsbGJhY2soIGFycmF5ICk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuLi90cy90YXNrJztcclxuXHJcbmV4cG9ydCBjbGFzcyBMaXN0Vmlld3tcclxuICBsaXN0OkhUTUxFbGVtZW50O1xyXG4gIGNvbnN0cnVjdG9yKCBsaXN0aWQ6c3RyaW5nICl7XHJcbiAgICB0aGlzLmxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbGlzdGlkICk7XHJcbiAgfVxyXG4gIHJlbmRlciggaXRlbXM6QXJyYXk8VGFzaz4gKXtcclxuICAgIGl0ZW1zLmZvckVhY2goKHRhc2spID0+IHtcclxuICAgICAgbGV0IGlkID0gdGFzay5pZDtcclxuICAgICAgbGV0IG5hbWUgPSB0YXNrLm5hbWU7XHJcbiAgICAgIGxldCBzdGF0dXMgPSB0YXNrLnN0YXR1cy50b1N0cmluZygpO1xyXG4gICAgICBsZXQgdGVtcGxhdGUgPSBgPGxpIGlkPVwiJHtpZH1cIiBkYXRhLXN0YXR1cz1cIiR7c3RhdHVzfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stbmFtZVwiPiR7bmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLWJ1dHRvbnNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWZ1bmN0aW9uPVwic3RhdHVzXCI+JiN4MjcxNDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWZ1bmN0aW9uLVwiZGVsZXRlXCI+JnRpbWVzOzwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxsaT5gO1xyXG4gICAgICBsZXQgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudCggdGVtcGxhdGUgKTtcclxuICAgICAgdGhpcy5saXN0LmFwcGVuZENoaWxkKGZyYWdtZW50KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBjbGVhcigpe1xyXG4gICAgdGhpcy5saXN0LmlubmVySFRNTCA9Jyc7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IExpc3RWaWV3IH0gZnJvbSAnLi4vdHMvbGlzdHZpZXcnO1xyXG5pbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcbmltcG9ydCB7IFRhc2tNYW5hZ2VyIH0gZnJvbSAnLi4vdHMvdGFza21hbmFnZXInO1xyXG5pbXBvcnQgeyBEYXRhU3RvcmFnZSB9IGZyb20gJy4uL3RzL2RhdGFzdG9yYWdlJztcclxuXHJcbi8vaW5pdGlhbGlzZVxyXG52YXIgdGFza2FycmF5OkFycmF5PGFueT4gPSBbXTtcclxudmFyIHRhc2tzdG9yYWdlID0gbmV3IERhdGFTdG9yYWdlKCk7XHJcbnZhciB0YXNrbWFuYWdlciA9IG5ldyBUYXNrTWFuYWdlcih0YXNrYXJyYXkpO1xyXG52YXIgbGlzdHZpZXcgPSBuZXcgTGlzdFZpZXcoJ3Rhc2stbGlzdCcpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgIGxldCB0YXNrZGF0YSA9IHRhc2tzdG9yYWdlLnJlYWQoIChkYXRhKSA9PiB7XHJcbiAgICAgaWYgKGRhdGEubGVuZ3RoID4gMCl7XHJcbiAgICAgICBkYXRhLmZvckVhY2goIChpdGVtKSA9PiB7XHJcbiAgICAgICAgIHRhc2thcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgfSk7XHJcbiAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcclxuICAgICB9XHJcbiAgIH0pO1xyXG59KTtcclxuXHJcbi8vcmVmZXJlbmNlIHRvIGZvcm1cclxuY29uc3QgdGFza2Zvcm0gPSAoPEhUTUxGb3JtRWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stZm9ybScpKTtcclxudGFza2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywoIGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbmNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcclxuICBsZXQgdGFza25hbWUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+aW5wdXQpLnZhbHVlO1xyXG4gICAgdGFza2Zvcm0ucmVzZXQoKTtcclxuIC8vIGNvbnNvbGUubG9nKHRhc2tuYW1lKTtcclxuICAgIGxldCB0YXNrID0gbmV3IFRhc2soIHRhc2tuYW1lICk7XHJcbiAgICB0YXNrbWFuYWdlci5hZGQoIHRhc2sgKTtcclxuICAgIGxpc3R2aWV3LmNsZWFyKCk7XHJcbiAgICB0YXNrc3RvcmFnZS5zdG9yZSh0YXNrYXJyYXksIChyZXN1bHQpID0+IHtcclxuICAgICAgaWYocmVzdWx0KXtcclxuICAgICAgICB0YXNrZm9ybS5yZXNldCgpO1xyXG4gICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XHJcbiAgICAgICAgbGlzdHZpZXcucmVuZGVyKHRhc2thcnJheSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICAgIC8vZXJyb3IgdG8gZG8gd2l0aCBzdG9yYWdlXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xyXG59KTtcclxuXHJcbi8vY2xpY2sgYnV0dG9uLCBldmVudCBjYWxsIHRoaXMgZnVuY3Rpb24gdG8gZmluZCBpZCBvZiBidXR0b24gaWYgaGF2ZVxyXG5mdW5jdGlvbiBnZXRQYXJlbnRJZChlbG06Tm9kZSl7XHJcbiAgLy9sb29wIGVsZW1lbnQgdG8gZmluZCB0aGUgaWQgdXNpbmcgd2hpbGVcclxuICB3aGlsZShlbG0ucGFyZW50Tm9kZSl7XHJcbiAgICBlbG0gPSBlbG0ucGFyZW50Tm9kZTtcclxuICAgIGxldCBpZDpzdHJpbmcgPSAoPEhUTUxFbGVtZW50PiBlbG0pLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICAgIGlmKCBpZCApe1xyXG4gICAgICByZXR1cm4gaWQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5jb25zdCBsaXN0ZWxlbWVudDpIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWxpc3QnKTtcclxubGlzdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoIGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gIGxldCB0YXJnZXQ6SFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+IGV2ZW50LnRhcmdldDtcclxuICAvL2ZpbmQgYSB3YXkgdG8gZ2V0IGxpIGVsZW1lbnQgY2F1c2UgYnV0dG9uIGluc2lkZSA8bGk+XHJcbiAgbGV0IGlkID0gZ2V0UGFyZW50SWQoIDxOb2RlPiBldmVudC50YXJnZXQpO1xyXG4gIC8vY29uc29sZS5sb2coIGlkICk7XHJcbiAgLy93ZSBoYXZlIDIgYnV0dG9uID0gY2hlY2sgd2hpY2ggb25lIHdlIGNsaWNrZWRcclxuICBpZiAoIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKSA9PSAnc3RhdHVzJyl7Ly9zdGF0dXMgYnV0dG9uIGdldCBjbGlja2VkXHJcbiAgICBpZiggaWQgKXtcclxuICAgICAgdGFza21hbmFnZXIuY2hhbmdlU3RhdHVzKCBpZCwgKCkgPT4gey8vY2FsbGJhY2sgdGVsbCB0aGUgc3lzdGVtIGNoYW5nZSBzdGF0dXMgd2hlbiBzdGF0dXMgY2hhbmdlZFxyXG4gICAgICAgIHRhc2tzdG9yYWdlLnN0b3JlKCB0YXNrYXJyYXksICgpID0+IHtcclxuICAgICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XHJcbiAgICAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgICAvL2xpc3R2aWV3LnJlYW5kZXIodGFza2FycmF5KTtcclxuICAgICAgfSApO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpID09ICdkZWxldGUnKXtcclxuICAgIGlmKCBpZCApe1xyXG4gICAgICB0YXNrbWFuYWdlci5kZWxldGUoIGlkLCAoKSA9PiB7XHJcbiAgICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCgpPT57XHJcbiAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0pO1xyXG4iLCJleHBvcnQgY2xhc3MgVGFza3tcclxuICBpZDogc3RyaW5nO1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBzdGF0dXM6IGJvb2xlYW47XHJcbiAgY29uc3RydWN0b3IodGFza25hbWU6IHN0cmluZyl7XHJcbiAgICB0aGlzLmlkID0gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKTtcclxuICAgIHRoaXMubmFtZSA9IHRhc2tuYW1lO1xyXG4gICAgdGhpcy5zdGF0dXMgPSBmYWxzZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhc2tNYW5hZ2VyIHtcclxuICB0YXNrczogQXJyYXk8VGFzaz47XHJcblxyXG4gIGNvbnN0cnVjdG9yKCBhcnJheTogQXJyYXk8VGFzaz4pe1xyXG4gICAgdGhpcy50YXNrcyA9IGFycmF5O1xyXG4gIH1cclxuICBhZGQoIHRhc2s6IFRhc2sgKXtcclxuICAgIHRoaXMudGFza3MucHVzaCh0YXNrKTtcclxuICAgIHRoaXMuc29ydCggdGhpcy50YXNrcyApO1xyXG4gIH1cclxuICBjaGFuZ2VTdGF0dXMoIGlkOlN0cmluZywgY2FsbGJhY2sgKTp2b2lke1xyXG4gIHRoaXMudGFza3MuZm9yRWFjaCgodGFzazpUYXNrKSA9PiB7XHJcbiAgICAgIGlmKHRhc2suaWQgPT0gaWQpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIHRhc2suaWQgKTtcclxuICAgICAgICAgIGlmKHRhc2suc3RhdHVzID09IGZhbHNlICl7XHJcbiAgICAgICAgICAgICAgdGFzay5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICB0YXNrLnN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgfSk7XHJcbiAgY2FsbGJhY2soKTtcclxuICB9XHJcbiAgZGVsZXRlKCBpZDpzdHJpbmcsIGNhbGxiYWNrICl7XHJcbiAgICBsZXQgaW5kZXhfdG9fcmVtb3ZlOiBudW1iZXIgPSB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLnRhc2tzLmZvckVhY2goIChpdGVtOiBUYXNrLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLmlkID09IGlkICl7XHJcbiAgICAgICAgaW5kZXhfdG9fcmVtb3ZlID0gaW5kZXg7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy9kZWxldGUgaXRlbSB3aXRoIHNwZWNpZmllZCBpbmRleFxyXG4gICAgaWYgKCBpbmRleF90b19yZW1vdmUgIT09IHVuZGVmaW5lZCApe1xyXG4gICAgICB0aGlzLnRhc2tzLnNwbGljZSAoaW5kZXhfdG9fcmVtb3ZlLCAxKTtcclxuICAgIH1cclxuICAgIHRoaXMuc29ydCggdGhpcy50YXNrcyApO1xyXG4gICAgY2FsbGJhY2soKTtcclxuICB9XHJcbiAgc29ydCggdGFza3M6IEFycmF5PFRhc2s+KXtcclxuICAgIHRhc2tzLnNvcnQoKHRhc2sxLCB0YXNrMikgPT4ge1xyXG4gICAgICBpZiAoIHRhc2sxLnN0YXR1cyA9PSB0cnVlICYmIHRhc2syLnN0YXR1cyA9PSBmYWxzZSl7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCB0YXNrMS5zdGF0dXMgPT0gZmFsc2UgJiYgdGFzazIuc3RhdHVzID09IHRydWUpe1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIHRhc2sxLnN0YXR1cyA9PSB0YXNrMi5zdGF0dXMgKXtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuIl19
