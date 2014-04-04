// main.js
angular.module('myApp', ['ngGrid', 'ui.bootstrap'])
.controller('MyCtrl', function($scope, $http, employee) {

  $scope.employeeData = [];

  $scope.getEmployee = function(employeeName){
    return employee.getEmployee(employeeName);
  };
    
  $scope.addEmployee = function(employee) {
    $scope.employeeData.push({name: employee.name, department: employee.department});
    // $scope.$apply(); // Force new row add before attempting to focus on it. // MBE : this is bad !
    var lastRowId = "#employee-input-" + ($scope.employeeData.length-1);
    $scope.selected = '';
   //  $(lastRowId).focus();// guy !!! you should use a directive for manipulating DOM !
  };
  
  $scope.removeEmployee = function(employeeIndex) {
    if(employeeIndex >= 0 && employeeIndex < $scope.employeeData.length) {
      $scope.employeeData.splice(employeeIndex, 1);
    }
  };

  $scope.employeeOptions = {
    data: 'employeeData',
    enableCellEdit: true,
    columnDefs: [{field: 'name', displayName: 'Name'}
    ,{field: 'department', displayName: 'Department'}
    ]
  };
})

.constant('URL', 'http://eu-west-1.searchbox.io/api-key/azskxqtzpliu2ggns9b7ayizuflv8vu9/employees')

.factory('employee', function($http, URL){
  return {

    getEmployee : function(employeeName){

      return $http.get(URL+'/_search?q='+employeeName+'*').then(function(result){
        var employeesMatching = [];
   	    angular.forEach(result.data.hits.hits, function(item){
          employeesMatching.push(item);
        });
        return employeesMatching;
        });

    }
  };
});