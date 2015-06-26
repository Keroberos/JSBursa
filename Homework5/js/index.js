/*global $ _*/
(function global() {
  'use strict';
  var allStudents;
  var activeList;
  var redCardList;
  var removedList;
  var processLater = [];
  var statuses = {
    active: 'active',
    redcard: 'redcard',
    removed: 'removed'
  };
  var model;
  var clones;

  function savePositions() {
    model = {
      activeList: [],
      redCardList: [],
      removedList: []
    };

    _.forEach(activeList.find('li'), function save(item) {
      var id = $(item).data('studentId');
      model.activeList.push(id);
    });

    _.forEach(redCardList.find('li'), function save(item) {
      var id = $(item).data('studentId');
      model.redCardList.push(id);
    });

    _.forEach(removedList.find('li'), function save(item) {
      var id = $(item).data('studentId');
      model.removedList.push(id);
    });

    localStorage.setItem('students', JSON.stringify(model));
  }

  // noinspection JSUnusedLocalSymbols
  function onDrop(event, ui) {
    var item = ui.item;
    var student;
    var newStatus;
    var myUrl;
    var dataToSend;

    if (item === undefined || item === null) {
      return;
    }

    student = _.find(allStudents, {id: item.data('studentId')});
    newStatus = item.parent().data('status');

    function isOk() {
      student.status = newStatus;
      savePositions();
    }

    if (student.status === newStatus) {
      isOk();
      return;
    }

    myUrl = window.url + '/' + student.id;
    dataToSend = {status: newStatus};

    $.ajax({
      url: myUrl,
      method: 'POST',
      data: dataToSend
    }).done(function onDone() {
      isOk();
    }).fail(function onFail() {
      $(ui.sender).sortable('cancel');
    });
  }

  function init() {
    activeList = $('.col-md-4.active').find('ul');
    redCardList = $('.col-md-4.redcard').find('ul');
    removedList = $('.col-md-4.removed').find('ul');

    activeList.sortable({connectWith: 'ul', update: onDrop, placeholder: 'placeholder'});
    redCardList.sortable({connectWith: 'ul', update: onDrop, placeholder: 'placeholder'});
    removedList.sortable({update: onDrop, placeholder: 'placeholder'});

    activeList.data('status', statuses.active);
    redCardList.data('status', statuses.redcard);
    removedList.data('status', statuses.removed);
  }

  function createListItem(student) {
    var result = $('<li> <h3>' + student.name + '</h3> <h4>' + student.phone + '</h4> </li>');
    result.data('studentId', student.id);
    return result;
  }

  function processStudent(student) {
    switch (student.status) {
      case statuses.active:
        activeList.append(createListItem(student));
        break;
      case statuses.redcard:
        redCardList.append(createListItem(student));
        break;
      case statuses.removed:
        removedList.append(createListItem(student));
        break;
      default :
        break;
    }
  }

  function addSortedStudent(status) {
    return function add(studentId) {
      var student = _.find(allStudents, {id: studentId});
      if (student !== undefined && student !== null) {
        _.remove(clones, function filter(p) {
          return p.id === studentId;
        });

        if (student.status === status) {
          processStudent(student);
        } else {
          processLater.push(student);
        }
      }
    };
  }

  function render() {
    processLater = [];
    clones = _.clone(allStudents);
    if (model !== null && model !== undefined) {
      _.forEach(model.activeList, addSortedStudent(statuses.active));
      _.forEach(model.redCardList, addSortedStudent(statuses.redcard));
      _.forEach(model.removedList, addSortedStudent(statuses.removed));
      _.forEach(processLater, processStudent);
      _.forEach(clones, processStudent);
    } else {
      _.forEach(allStudents, processStudent);
    }
  }

  $(function onLoad() {
    init();
    $.get(window.url, function onGet(data) {
      allStudents = data;
      model = JSON.parse(localStorage.getItem('students'));
      render();
    });
  });
})();
