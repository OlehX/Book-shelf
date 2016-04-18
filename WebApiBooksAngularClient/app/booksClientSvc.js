(function () {
    'use strict';

    angular
        .module('app')
        .factory('booksClientSvc', function ($resource) {
            return $resource("api/book/",
                {  },
                {
                    'query': {
                        method: 'GET',
                        url: '/api/book/:pageSize/:pageNumber/',
                        params: { pageSize: '@pageSize', pageNumber: '@pageNumber' }
                    }
                });
        });
})();
