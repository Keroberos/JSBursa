/**
 * Created by Kero on 04.07.2015.
 */
(function jsbursa() {
  'use strict';
  angular.module('jsbursa', []).directive('draggableList', function () {
    return {
      restrict: 'E',
      template: '<ul id="{{id}}">' +
      '<li ng-repeat="item in items">' +
      '<h3>{{item.name}}</h3>' +
      '<h4>{{item.phone}}</h4>' +
      '</li>' +
      '</ul>',
      scope: {
        items: '=',
        id: '@'
      }
      ,
      link: function ($scope, $element) {
        Array.prototype.move = function (from, to) {
          this.splice(to, 0, this.splice(from, 1)[0]);
        };
        function getElementById(id) {
          var i;
          for (i = 0; i < $scope.items.length; i++) {
            if ($scope.items[i].id === id.toString()) {
              return $scope.items[i];
            }
          }
        }

        var list = $element.find('ul');
        var directiveId = $element[0].getAttribute('id');
        var hasId = (directiveId !== null && directiveId !== undefined && directiveId !== '');

        if (hasId) {
          var data = JSON.parse(localStorage.getItem(directiveId));
          if (data !== null && data !== undefined && data.length > 0) {
            var q;
            var position = 0;
            for (q = 0; q < data.length; q++) {
              var oldIndex = $scope.items.indexOf(getElementById(data[q]));
              if (oldIndex >= 0) {
                $scope.items.move(oldIndex, position);
                position++;
              }
            }
          }
        }

        var save = function () {
          if (hasId) {
            localStorage.setItem(directiveId, JSON.stringify($scope.items.map(function (item) {
              if (item !== undefined) {
                return item.id;
              }
            })));
          }
        }

        list.sortable({
            connectWith: 'ul',
            start: function (event, ui) {
              oldIndex = ui.item.index();
              ui.item.data('itemList', JSON.stringify($scope.items[oldIndex]));
              ui.item.data('oldIndex', oldIndex);
            },
            remove: function (event, ui) {
              $scope.items.splice(ui.item.data('oldIndex'), 1);
              save();
            },
            receive: function (event, ui) {
              var newIndex = ui.item.index();
              var dragItem = JSON.parse(ui.item.data('itemList'));
              $scope.items.splice(newIndex, 0, dragItem);
              save();
            },
            stop: function (event, ui) {
              if (ui.item.parent()[0].id !== directiveId) {
                return;
              }
              var dragItem = JSON.parse(ui.item.data('itemList'));
              var newIndex = ui.item.index();
              $scope.items.splice(ui.item.data('oldIndex'), 1);
              $scope.items.splice(newIndex, 0, dragItem);
              save();
            }
          }
        )
        ;
      }
    };
  });

  angular.module('jsbursa').controller('myController', function ($scope) {
    $scope.students = JSON.parse('[{"id":"1","name":"Jeremy Lane","phone":"(466) 514-6617","status":"redcard"},{"id":"2","name":"Austin Hunt","phone":"(314) 333-4959","status":"active"},{"id":"3","name":"Ronald Campbell","phone":"(686) 869-6077","status":"removed"},{"id":"4","name":"Don Stewart","phone":"(328) 747-6780","status":"removed"},{"id":"5","name":"Jeremiah Jordan","phone":"(769) 969-5203","status":"removed"},{"id":"6","name":"Susie Frazier","phone":"(917) 781-9869","status":"removed"},{"id":"7","name":"Sally Larson","phone":"(965) 429-2716","status":"removed"},{"id":"8","name":"Glenn Berry","phone":"(266) 740-2428","status":"removed"},{"id":"9","name":"Cordelia Frazier","phone":"(288) 290-8309","status":"removed"},{"id":"10","name":"Clara Howard","phone":"(366) 905-2199","status":"removed"},{"id":"11","name":"Mildred Bennett","phone":"(475) 272-7506","status":"removed"},{"id":"12","name":"Ricardo Ellis","phone":"(770) 558-6195","status":"removed"},{"id":"13","name":"Jon Evans","phone":"(880) 213-2834","status":"active"},{"id":"14","name":"Milton Meyer","phone":"(367) 935-1707","status":"removed"},{"id":"15","name":"Lina Higgins","phone":"(836) 692-5389","status":"removed"},{"id":"16","name":"Frederick Padilla","phone":"(252) 479-4740","status":"removed"},{"id":"17","name":"Eva Barnett","phone":"(442) 464-5978","status":"removed"},{"id":"18","name":"Hallie Davidson","phone":"(659) 314-4355","status":"removed"},{"id":"19","name":"Lula Rowe","phone":"(864) 257-6838","status":"removed"},{"id":"20","name":"Hilda Fowler","phone":"(575) 328-1234","status":"removed"},{"id":"21","name":"Thomas Moore","phone":"(911) 640-6475","status":"removed"},{"id":"22","name":"Delia Gray","phone":"(888) 390-5001","status":"removed"},{"id":"23","name":"John Murray","phone":"(287) 620-9027","status":"removed"},{"id":"24","name":"Theodore Hopkins","phone":"(854) 854-3760","status":"removed"},{"id":"25","name":"Rebecca Jackson","phone":"(832) 982-4971","status":"removed"},{"id":"26","name":"Amanda Meyer","phone":"(577) 982-8384","status":"redcard"},{"id":"27","name":"Travis Meyer","phone":"(958) 356-5566","status":"removed"},{"id":"28","name":"Jennie Daniels","phone":"(914) 686-8543","status":"removed"},{"id":"29","name":"Leah Dawson","phone":"(606) 468-4335","status":"removed"},{"id":"30","name":"Jeff Matthews","phone":"(307) 631-7628","status":"removed"}]');
    $scope.otherstudents = JSON.parse('[{"id":"111","name":"Jeremy Lane","phone":"(466) 514-6617","status":"redcard"}]');
    $scope.add = function () {
      $scope.students.push({name: 'XXX', id: 77, phone: 'xxx'});
    }

    $scope.delete = function () {
      $scope.students.splice(1, 1);
    }
  });

})
();