angular.module("categories")
    .service("categoriesService", function(commonBackendService) {
        angular.extend(this, commonBackendService.build('categories'));
    });
