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
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\">\n                            <div class=\"task-container\">\n                                <div class=\"task-name\">" + name + "</div>\n                            <div class=\"task-buttons\">\n                                <button type=\"button\" data-function=\"status\">&#x2714;</button>\n                                <button type=\"button\" data-function=\"delete\">&times;</button>\n            </div>\n            </div>\n            <li>";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBO0lBRUU7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdkMsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZO1FBQ3RFLElBQUssV0FBVyxFQUFFO1lBQ2pCLFFBQVEsQ0FBRSxJQUFJLENBQUUsQ0FBQztTQUNqQjthQUNJO1lBQ0gsUUFBUSxDQUFFLEtBQUssQ0FBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUNELDBCQUFJLEdBQUosVUFBTSxRQUFRO1FBQ1YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUMvQixRQUFRLENBQUUsS0FBSyxDQUFFLENBQUM7SUFDdEIsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FwQkEsQUFvQkMsSUFBQTtBQXBCWSxrQ0FBVzs7OztBQ0R4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUVIO0lBRUksa0JBQWEsTUFBYTtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUUsTUFBTSxDQUFFLENBQUM7SUFDbEQsQ0FB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VjtRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FuREEsQUFtREMsSUFBQTtBQW5EWSxrQ0FBVyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IFRhc2sgfSBmcm9tICcuLi90cy90YXNrJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEYXRhU3RvcmFnZXtcclxuICBzdG9yYWdlO1xyXG4gIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgIHRoaXMuc3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XHJcbiAgfVxyXG4gIHN0b3JlKCBhcnJheTpBcnJheSA8VGFzaz4sIGNhbGxiYWNrICl7XHJcbiAgICBsZXQgZGF0YSA9IEpTT04uc3RyaW5naWZ5KCBhcnJheSk7XHJcbiAgICBsZXQgc3RvcmVzdGF0dXMgPSB0aGlzLnN0b3JhZ2Uuc2V0SXRlbSgndGFza2RhdGEnLCBkYXRhKTsgLy9zdWNjZXNzZnVsXHJcbiAgICBpZiAoIHN0b3Jlc3RhdHVzICl7XHJcbiAgICAgY2FsbGJhY2soIHRydWUgKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBjYWxsYmFjayggZmFsc2UgKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmVhZCggY2FsbGJhY2sgKXtcclxuICAgICAgbGV0IGRhdGEgPSB0aGlzLnN0b3JhZ2UuZ2V0SXRlbSgndGFza2RhdGEnKTtcclxuICAgICAgbGV0IGFycmF5ID0gSlNPTi5wYXJzZSggZGF0YSApO1xyXG4gICAgICBjYWxsYmFjayggYXJyYXkgKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG4vKlxyXG5leHBvcnQgY2xhc3MgTGlzdFZpZXd7XHJcbiAgbGlzdDogSFRNTEVsZW1lbnQ7XHJcbiAgY29uc3RydWN0b3IoIGxpc3RpZDogc3RyaW5nICl7XHJcbiAgICB0aGlzLmxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1saXN0Jyk7XHJcbiAgfVxyXG4gIGNsZWFyKCl7XHJcbiAgICB0aGlzLmxpc3QuaW5uZXJIVE1MID0gJyc7XHJcbiAgfVxyXG4gIHJlbmRlciggaXRlbXM6QXJyYXk8VGFzaz4gKXtcclxuICAgIC8vY2xlYXIgdGhlIHZpZXdcclxuICAgIC8vcmVuZGVyIGFycmF5IHVzaW5nIHRlbXBsYXRlXHJcbiAgICBpdGVtcy5mb3JFYWNoKCAodGFzaykgPT4ge1xyXG4gICAgbGV0IGlkPSB0YXNrLmlkO1xyXG4gICAgbGV0IG5hbWUgPSB0YXNrLm5hbWU7XHJcbiAgICBsZXQgc3RhdHVzID0gdGFzay5zdGF0dXMudG9TdHJpbmcoKTtcclxuICAgIGxldCBpdGVtID0gdGVtcGxhdGUucG9wdWxhdGUoaWQsbmFtZSxzdGF0dXMpO1xyXG4gICAgLy8gY29udmVydCBvdXIgc3RyaW5nIHRvIEhUTUwgTm9kZVxyXG4gICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoaXRlbSk7XHJcbiAgICB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0qL1xyXG5cclxuZXhwb3J0IGNsYXNzIExpc3RWaWV3e1xyXG4gICAgbGlzdDpIVE1MRWxlbWVudDtcclxuICAgIGNvbnN0cnVjdG9yKCBsaXN0aWQ6c3RyaW5nICl7XHJcbiAgICAgICAgdGhpcy5saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGxpc3RpZCApO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCBpdGVtczpBcnJheTxUYXNrPiApe1xyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goKHRhc2spID0+IHtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGFzay5pZDtcclxuICAgICAgICAgICAgbGV0IG5hbWUgPSB0YXNrLm5hbWU7XHJcbiAgICAgICAgICAgIGxldCBzdGF0dXMgPSB0YXNrLnN0YXR1cy50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBgPGxpIGlkPVwiJHtpZH1cIiBkYXRhLXN0YXR1cz1cIiR7c3RhdHVzfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stbmFtZVwiPiR7bmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLWJ1dHRvbnNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWZ1bmN0aW9uPVwic3RhdHVzXCI+JiN4MjcxNDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWZ1bmN0aW9uPVwiZGVsZXRlXCI+JnRpbWVzOzwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxsaT5gO1xyXG4gICAgICAgICAgICBsZXQgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudCggdGVtcGxhdGUgKTtcclxuICAgICAgICAgICAgdGhpcy5saXN0LmFwcGVuZENoaWxkKGZyYWdtZW50KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNsZWFyKCl7XHJcbiAgICAgICAgdGhpcy5saXN0LmlubmVySFRNTCA9Jyc7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgTGlzdFZpZXcgfSBmcm9tICcuLi90cy9saXN0dmlldyc7XHJcbmltcG9ydCB7IFRhc2sgfSBmcm9tICcuLi90cy90YXNrJztcclxuaW1wb3J0IHsgVGFza01hbmFnZXIgfSBmcm9tICcuLi90cy90YXNrbWFuYWdlcic7XHJcbmltcG9ydCB7IERhdGFTdG9yYWdlIH0gZnJvbSAnLi4vdHMvZGF0YXN0b3JhZ2UnO1xyXG5cclxuLy9pbml0aWFsaXNlXHJcbnZhciB0YXNrYXJyYXk6QXJyYXk8YW55PiA9IFtdO1xyXG52YXIgdGFza3N0b3JhZ2UgPSBuZXcgRGF0YVN0b3JhZ2UoKTtcclxudmFyIHRhc2ttYW5hZ2VyID0gbmV3IFRhc2tNYW5hZ2VyKHRhc2thcnJheSk7XHJcbnZhciBsaXN0dmlldyA9IG5ldyBMaXN0VmlldygndGFzay1saXN0Jyk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgbGV0IHRhc2tkYXRhID0gdGFza3N0b3JhZ2UucmVhZCggKGRhdGEpID0+IHtcclxuICAgICBpZiAoZGF0YS5sZW5ndGggPiAwKXtcclxuICAgICAgIGRhdGEuZm9yRWFjaCggKGl0ZW0pID0+IHtcclxuICAgICAgICAgdGFza2FycmF5LnB1c2goaXRlbSk7XHJcbiAgICAgICB9KTtcclxuICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XHJcbiAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xyXG4gICAgIH1cclxuICAgfSk7XHJcbn0pO1xyXG5cclxuLy9yZWZlcmVuY2UgdG8gZm9ybVxyXG5jb25zdCB0YXNrZm9ybSA9ICg8SFRNTEZvcm1FbGVtZW50PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1mb3JtJykpO1xyXG50YXNrZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCggZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xyXG4gIGxldCB0YXNrbmFtZSA9ICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkudmFsdWU7XHJcbiAgICB0YXNrZm9ybS5yZXNldCgpO1xyXG4gLy8gY29uc29sZS5sb2codGFza25hbWUpO1xyXG4gICAgbGV0IHRhc2sgPSBuZXcgVGFzayggdGFza25hbWUgKTtcclxuICAgIHRhc2ttYW5hZ2VyLmFkZCggdGFzayApO1xyXG4gICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgIHRhc2tzdG9yYWdlLnN0b3JlKHRhc2thcnJheSwgKHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZihyZXN1bHQpe1xyXG4gICAgICAgIHRhc2tmb3JtLnJlc2V0KCk7XHJcbiAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgICAgLy9lcnJvciB0byBkbyB3aXRoIHN0b3JhZ2VcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgbGlzdHZpZXcucmVuZGVyKHRhc2thcnJheSk7XHJcbn0pO1xyXG5cclxuLy9jbGljayBidXR0b24sIGV2ZW50IGNhbGwgdGhpcyBmdW5jdGlvbiB0byBmaW5kIGlkIG9mIGJ1dHRvbiBpZiBoYXZlXHJcbmZ1bmN0aW9uIGdldFBhcmVudElkKGVsbTpOb2RlKXtcclxuICAvL2xvb3AgZWxlbWVudCB0byBmaW5kIHRoZSBpZCB1c2luZyB3aGlsZVxyXG4gIHdoaWxlKGVsbS5wYXJlbnROb2RlKXtcclxuICAgIGVsbSA9IGVsbS5wYXJlbnROb2RlO1xyXG4gICAgbGV0IGlkOnN0cmluZyA9ICg8SFRNTEVsZW1lbnQ+IGVsbSkuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgaWYoIGlkICl7XHJcbiAgICAgIHJldHVybiBpZDtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmNvbnN0IGxpc3RlbGVtZW50OkhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stbGlzdCcpO1xyXG5saXN0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICggZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgbGV0IHRhcmdldDpIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD4gZXZlbnQudGFyZ2V0O1xyXG4gIC8vZmluZCBhIHdheSB0byBnZXQgbGkgZWxlbWVudCBjYXVzZSBidXR0b24gaW5zaWRlIDxsaT5cclxuICBsZXQgaWQgPSBnZXRQYXJlbnRJZCggPE5vZGU+IGV2ZW50LnRhcmdldCk7XHJcbiAgLy9jb25zb2xlLmxvZyggaWQgKTtcclxuICAvL3dlIGhhdmUgMiBidXR0b24gPSBjaGVjayB3aGljaCBvbmUgd2UgY2xpY2tlZFxyXG4gIGlmICggdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpID09ICdzdGF0dXMnKXsvL3N0YXR1cyBidXR0b24gZ2V0IGNsaWNrZWRcclxuICAgIGlmKCBpZCApe1xyXG4gICAgICB0YXNrbWFuYWdlci5jaGFuZ2VTdGF0dXMoIGlkLCAoKSA9PiB7Ly9jYWxsYmFjayB0ZWxsIHRoZSBzeXN0ZW0gY2hhbmdlIHN0YXR1cyB3aGVuIHN0YXR1cyBjaGFuZ2VkXHJcbiAgICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUoIHRhc2thcnJheSwgKCkgPT4ge1xyXG4gICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy9saXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgIC8vbGlzdHZpZXcucmVhbmRlcih0YXNrYXJyYXkpO1xyXG4gICAgICB9ICk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZ1bmN0aW9uJykgPT0gJ2RlbGV0ZScpe1xyXG4gICAgaWYoIGlkICl7XHJcbiAgICAgIHRhc2ttYW5hZ2VyLmRlbGV0ZSggaWQsICgpID0+IHtcclxuICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSh0YXNrYXJyYXksKCk9PntcclxuICAgICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XHJcbiAgICAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSk7XHJcbiIsImV4cG9ydCBjbGFzcyBUYXNre1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIHN0YXR1czogYm9vbGVhbjtcclxuICBjb25zdHJ1Y3Rvcih0YXNrbmFtZTogc3RyaW5nKXtcclxuICAgIHRoaXMuaWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpO1xyXG4gICAgdGhpcy5uYW1lID0gdGFza25hbWU7XHJcbiAgICB0aGlzLnN0YXR1cyA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFRhc2tNYW5hZ2VyIHtcclxuICB0YXNrczogQXJyYXk8VGFzaz47XHJcblxyXG4gIGNvbnN0cnVjdG9yKCBhcnJheTogQXJyYXk8VGFzaz4pe1xyXG4gICAgdGhpcy50YXNrcyA9IGFycmF5O1xyXG4gIH1cclxuICBhZGQoIHRhc2s6IFRhc2sgKXtcclxuICAgIHRoaXMudGFza3MucHVzaCh0YXNrKTtcclxuICAgIHRoaXMuc29ydCggdGhpcy50YXNrcyApO1xyXG4gIH1cclxuICBjaGFuZ2VTdGF0dXMoIGlkOlN0cmluZywgY2FsbGJhY2sgKTp2b2lke1xyXG4gIHRoaXMudGFza3MuZm9yRWFjaCgodGFzazpUYXNrKSA9PiB7XHJcbiAgICAgIGlmKHRhc2suaWQgPT0gaWQpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIHRhc2suaWQgKTtcclxuICAgICAgICAgIGlmKHRhc2suc3RhdHVzID09IGZhbHNlICl7XHJcbiAgICAgICAgICAgICAgdGFzay5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICB0YXNrLnN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgfSk7XHJcbiAgY2FsbGJhY2soKTtcclxuICB9XHJcbiAgZGVsZXRlKCBpZDpzdHJpbmcsIGNhbGxiYWNrICl7XHJcbiAgICBsZXQgaW5kZXhfdG9fcmVtb3ZlOiBudW1iZXIgPSB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLnRhc2tzLmZvckVhY2goIChpdGVtOiBUYXNrLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLmlkID09IGlkICl7XHJcbiAgICAgICAgaW5kZXhfdG9fcmVtb3ZlID0gaW5kZXg7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy9kZWxldGUgaXRlbSB3aXRoIHNwZWNpZmllZCBpbmRleFxyXG4gICAgaWYgKCBpbmRleF90b19yZW1vdmUgIT09IHVuZGVmaW5lZCApe1xyXG4gICAgICB0aGlzLnRhc2tzLnNwbGljZSAoaW5kZXhfdG9fcmVtb3ZlLCAxKTtcclxuICAgIH1cclxuICAgIHRoaXMuc29ydCggdGhpcy50YXNrcyApO1xyXG4gICAgY2FsbGJhY2soKTtcclxuICB9XHJcbiAgc29ydCggdGFza3M6IEFycmF5PFRhc2s+KXtcclxuICAgIHRhc2tzLnNvcnQoKHRhc2sxLCB0YXNrMikgPT4ge1xyXG4gICAgICBpZiAoIHRhc2sxLnN0YXR1cyA9PSB0cnVlICYmIHRhc2syLnN0YXR1cyA9PSBmYWxzZSl7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCB0YXNrMS5zdGF0dXMgPT0gZmFsc2UgJiYgdGFzazIuc3RhdHVzID09IHRydWUpe1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIHRhc2sxLnN0YXR1cyA9PSB0YXNrMi5zdGF0dXMgKXtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuIl19
