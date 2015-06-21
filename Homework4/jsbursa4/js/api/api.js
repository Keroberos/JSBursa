/*global Dispatcher*/

// region classes
// Здесь объявляются классы
function User(obj) {
  'use strict';
  this.id = obj.id;
  this.name = obj.name;
  this.phone = obj.phone;
}
function Admin(obj) {
  'use strict';
  // вызов базового конструктора
  User.apply(this, [obj]);
  this.role = obj.role;
}
function Student(obj) {
  'use strict';
  // вызов базового конструктора
  User.apply(this, [obj]);
  this.strikes = obj.strikes;
}
function Support(obj) {
  'use strict';
  // вызов базового конструктора
  User.apply(this, [obj]);
  this.role = obj.role;
  this.location = obj.location;
}
// endregion

(function api() {
  'use strict';
  // Создаём такой элемент а, чтобы хранить в нём урл и удобно было брать из него части адреса
  // типа хост, протокол и т.д.
  var urlHolder = document.createElement('a');
  var roles =
  {
    // Две роли админа для совместимости, т.к. встречается и то, и то
    Administrator: 'Administrator',
    Admin: 'Admin',
    Student: 'Student',
    Support: 'Support'
  };

  urlHolder.href = window.crudURL;

  // выполняет запрос с указанными параметрами
  function doRequest(method, data, url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);

    // методу GET не надо добавлять заголовки
    if (method !== 'GET') {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.send(data);
    xhr.addEventListener('load', function onLoad() {
      // вызываем callback функцию только когда её передали
      if (callback !== undefined && callback !== null) {
        callback(xhr);
      }
    });
  }

  // разгребатор, который создаёт нужный объект в зависимости от роли
  function createUser(obj) {
    switch (obj.role) {
      case roles.Student:
        return new Student(obj);
      case roles.Administrator:
      case roles.Admin:
        return new Admin(obj);
      case roles.Support:
        return new Support(obj);
      default:
        return new User(obj);
    }
  }

  // разгребаем ответ от сервера с списком пользователей
  function parseUsers(data) {
    var i;
    var result = [];
    var user;

    for (i = 0; i < data.length; i++) {
      user = createUser(data[i]);
      result.push(user);
    }

    return result;
  }

  // проверяем, есть ли ошибки после выполнения запроса на сервер
  function checkError(xhr) {
    return xhr.status !== 200 && xhr.status !== 204;
  }

  // region prototypes
  // метод сохранения класса User
  User.prototype.save = function saveUser(callback) {
    var me = this;
    // если айдишка у юзера уже есть, значит надо обновить инфу
    if (me.id !== undefined && me.id !== null && me.id !== 0) {
      doRequest('PUT', JSON.stringify(me), urlHolder.href + '/' + me.id, function onUpdate(xhr) {
        callback(checkError(xhr));
      });
    } else {
      // если айдишки не было, значит новый пользователь
      doRequest('POST', JSON.stringify(me), urlHolder.href, function onAdd(xhr) {
        var hasError = checkError(xhr);
        if (!hasError) {
          me.id = JSON.parse(xhr.responseText).id;
        }
        callback(hasError);
      });
    }
  };

  // удаление пользователя
  User.prototype.remove = function removeUser(callback) {
    var me = this;
    var url = urlHolder.href + '/' + me.id;
    doRequest('DELETE', '', url, function onDelete(xhr) {
      callback(checkError(xhr));
    });
  };

  // наследуем админа от юзера
  Admin.prototype = Object.create(User.prototype);

  // переопределяем сохранение у админов
  Admin.prototype.save = function saveAdmin(callback) {
    // вызываем базовый метод сохранения
    User.prototype.save.apply(this, [callback]);

    // и делаем дополнительный запрос. Колбек-функцию не передаём, т.к. плевать на результат
    doRequest('GET', '', urlHolder.protocol + '//' + urlHolder.host + '/refreshAdmins');
  };

  // наследуем студента от юзера
  Student.prototype = Object.create(User.prototype);

  // определяем метод получения штрафов
  Student.prototype.getStrikesCount = function getStrikesCountUser() {
    return this.strikes;
  };

  // наследуем сапорта от юзера
  Support.prototype = Object.create(User.prototype);
  // endregion

  // Таким вот образом определяются статические функции. Эту функцию можно вызвать у самого класса
  // а не экземпляра класса юзера
  User.load = function loadUser(callBack) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlHolder.href);
    xhr.send();
    xhr.addEventListener('load', function onLoad() {
      var data = JSON.parse(xhr.responseText);
      var list = parseUsers(data);
      callBack(checkError(xhr), list);
    });
  };
})();
