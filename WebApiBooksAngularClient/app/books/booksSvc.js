(function () {
    'use strict';

    angular
        .module('app')
        .factory('booksSvc', booksSvc);

    booksSvc.$inject = ['$q', 'booksClientSvc'];

    function booksSvc($q, booksClientSvc) {
        var initialOptions = {
            size: 3
        },
        service = {
            initialize: initialize,
            navigate: navigate,
            clear: clear,
            books: [],
            pages: [],
            paging: {
                options: angular.copy(initialOptions),
                info: {
                    totalItems: 0,
                    totalPages: 1,
                    currentPage: 0
                }
            }
        };

        return service;

        function initialize() {
            var queryArgs = {
                pageSize: service.paging.options.size,
                pageNumber: service.paging.info.currentPage
            };
            return booksClientSvc.query(queryArgs).$promise.then(
                  function (result) {
                      var newPage = {
                          number: pageNumber,
                          books: []
                      };
                      result.books.forEach(function (result) {
                          newPage.books.push(result);
                      });

                      service.pages.push(newPage);
                      service.paging.info.currentPage = 1;
                      service.paging.info.totalPages = result.totalPages;
                      service.paging.info.totalItems = result.totalItems;

                      return result.$promise;
                  }, function (result) {
                      return $q.reject(result);
                  });
        }
        

        function navigate(pageNumber) {
            var dfd = $q.defer();

            if (pageNumber > service.paging.info.totalPages) {
                return dfd.reject({ error: "page number out of range" });
            }

            if (service.pages[pageNumber]) {
                service.paging.info.currentPage = pageNumber;
                dfd.resolve();
            } else {
                return load(pageNumber);
            }

            return dfd.promise;
        }
        
        function load(pageNumber) {
            var queryArgs = {
                pageSize: service.paging.options.size,
                pageNumber: pageNumber
            };
            return booksClientSvc.query(queryArgs).$promise.then(
               function (result) {
                   var newPage = {

                       number: service.paging.info.pageNumber,
                       books: []
                   };
                   result.books.forEach(function (result) {
                       newPage.books.push(result);
                   });

                   service.pages[pageNumber] = newPage;
                   service.paging.info.currentPage = pageNumber;
                   service.paging.info.totalPages = result.totalPages;
                   service.paging.info.totalItems = result.totalItems;
                 //  service.paging.info.countFiles = result.countFiles;

                   return result.$promise;
               }, function (result) {
                   return $q.reject(result);
               });

        }

        function clear() {
            service.pages.length = 0;
            service.paging.info.totalItems = 0;
            service.paging.info.currentPage = 0;
            service.paging.info.totalPages = 1;

        }
    }
})();