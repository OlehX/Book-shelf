(function () {
    'use strict';

    angular
        .module('app')
        .controller('addBookCtrl', addBookCtrl);

    addBookCtrl.$inject = ['$scope', '$http'];

    function addBookCtrl($scope, $http) {
        var isErrors = true;
        $scope.composeBook = {};

        $scope.addBook = function () {

            var book = { "Name": $scope.composeBook.name, "File": $scope.composeBook.file, "Image": $scope.composeBook.image, "Description": $scope.composeBook.description, "Authors": split($scope.composeBook.authors) };

            if (book.Name != null ) {
                setErrors(book);
                if (!isErrors) {

                    $http({
                        method: 'POST',
                        url: '/api/book',
                        data:  JSON.stringify(book) , //forms user object
                        headers: { 'Content-Type': 'application/json' }
                    }).success(function (book) {
                        alert("Book added");
                       setTimeout('location="#/Books";', 1000);
                    });

               
                };
            }

        };

        function split(auth) {
            var authors;
           var isfirst = true;
            angular.forEach(auth, function (value, key) {
               
                if (isfirst) {
                    authors = [{ "Name": value.split(' ')[0], "SName": value.split(' ')[1] }];
                    isfirst = false;
                }else
                authors.push({ "Name": value.split(' ')[0], "SName": value.split(' ')[1] });
            });
            return authors;
        }

        function setErrors(book) {
            $scope.error = {};

            if ((book.Name + '').length < 3) {
                $scope.error.SName = "Too Short Name";

            } 
            else {
                isErrors = false;
            }
        }
    }



})();
