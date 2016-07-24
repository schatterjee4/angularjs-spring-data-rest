// define a module called "app" which depends on the modules "categories" and "notes".
angular.module("app", ["categories", "notes"])
    .constant('backendUrl', '/api/'); // the address of the backend.
