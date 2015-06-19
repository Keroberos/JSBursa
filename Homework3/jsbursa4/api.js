 var dispatcher = new Dispatcher();
  
var roles = 
{
Administrator:'Administrator',
Student:'Student',
Support:'Support'
}

function User(obj)
{
  this.id = obj.id;
  this.name = obj.name;
  this.phone = obj.phone;
  this.location = obj.location;
  this.strikes = obj.strikes;
}

User.prototype.remove = function()
{
  var me = this;
  var xhr = new XMLHttpRequest();
  xhr.open('DELETE', window.crudURL + '/' + me.id);
  xhr.send();
  xhr.addEventListener('load',function()
  {
    dispatcher.fire('user:removed', me);
  })
}

Student.prototype = Object.create(User.prototype);
Student.prototype.constructor = Student;
Admin.prototype = Object.create(User.prototype);
Admin.prototype.constructor = Admin;
Support.prototype = Object.create(User.prototype);
Support.prototype.constructor = Support;

Student.prototype.getStrikesCount = function(){return this.strikes;}
User.prototype.save = function(callback)
{
  var me = this;
  var method;
  if (me.id!==undefined&&me.id!==null&&me.id!=0)
  {
    method  = 'PUT';
  } else {
    method  = 'POST';
  }
    
  var xhr = new XMLHttpRequest();
  xhr.open(method,window.crudURL);
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send(JSON.stringify(me));
  xhr.addEventListener('load',function()
  {
    var isOk = (xhr.status===200);
    if (isOk)
    {
    var data = xhr.responseText;
    me.id = JSON.parse(data).id;      
    }
    callback(!isOk);  
  })
}

function Student(obj)
{
  User.apply(this, arguments);  
}

function Admin(obj)
{
  User.apply(this, arguments);  
}

function Support(obj)
{
  User.apply(this, arguments);  
}

function CreateUser(obj)
{
  switch (obj.role)
  {
  case roles.Student:
    return new Student(obj);
    break;
  case roles.Administrator:
    return new Admin(obj);
    break;
  default:
    return new User(obj);
    break;
  }
}

function parseUsers(data)
{
  var i;
  var result=[];
  
  for (i=0;i<data.length;i++){
    var user = CreateUser(data[i]);
    result.push(user);
  }  
  
  return result;
}

User.load = function(callBack)
{
  var xhr = new XMLHttpRequest();
  xhr.open('GET',window.crudURL);
  xhr.send();
  xhr.addEventListener('load',function()
  {
    var data = JSON.parse(xhr.responseText);
    var list = parseUsers(data);
    callBack(false,list);
  })
}

