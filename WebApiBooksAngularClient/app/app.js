(function () {
    'use strict';

    var app = angular.module('app', ['ngResource','ngRoute']);

    app.config(['$routeProvider', function ($routeProvider) {        

        $routeProvider.when('/welcome', {
            templateUrl: 'app/welcome.html',
            controller: 'welcomeCtrl',
            caseInsensitiveMatch: true
        });
       
        $routeProvider.when('/Books/', {
            templateUrl: 'app/books/books.html',
            controller: 'booksCtrl',
            caseInsensitiveMatch: true
        });
       
        $routeProvider.when('/Books/Add', {
            templateUrl: 'app/addBook/addBook.html',
            controller: 'addBookCtrl',
            caseInsensitiveMatch: true
        });
      
        $routeProvider.otherwise({
            redirectTo: '/welcome'
        });
    }]);
   

    app.run([function () {        
    }]);
})();