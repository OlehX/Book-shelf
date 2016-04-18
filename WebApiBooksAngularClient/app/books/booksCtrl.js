(function () {
    'use strict';

    angular
        .module('app')
        .controller('booksCtrl', booksCtrl);

    booksCtrl.$inject = ['$scope', '$sce', 'booksSvc'];

    function booksCtrl($scope, $sce, booksSvc) {
        $scope.title = 'Books';
        $scope.description = 'Click to image to download this file';
        $scope.sce = $sce;
        $scope.pages = booksSvc.pages;
        $scope.info = booksSvc.paging.info;
        $scope.options = booksSvc.paging.options;
        $scope.books = booksSvc.books;
        $scope.orderProp = "Any";
        $scope.navigate = navigate;
        $scope.clear = optionsChanged;
        $scope.changeany = function (value) {

            if (value == "Any")
              return true;
            else
                return false;
        };
        $scope.change = function (value) {

            if (value == "Authors")
                return true;
            else
                return false;
        };
        $scope.changebook = function (value) {

            if (value == "Book")
                return true;
            else
                return false;
        };
      
       // $scope.getTypes = getType;

        $scope.status = {
            type: "info",
            message: "ready",
            busy: false
        };

      

       optionsChanged();


        function activate() {
            //if this is the first activation of the controller load the first page
            if (booksSvc.paging.info.currentPage === 0) {
                 navigate(1);
              
            }

        }

        function navigate(pageNumber) {
            $scope.status.busy = true;
            $scope.status.message = "loading records";

            booksSvc.navigate(pageNumber)
                            .then(function () {
                                $scope.status.message = "ready";
                            }, function (result) {
                                $scope.status.message = "something went wrong: " + (result.error || result.statusText);
                            })
                            ['finally'](function () {
                                $scope.status.busy = false;
                            });
        }

        function optionsChanged() {
            booksSvc.clear();
            activate();
        }

        }
        })();
      