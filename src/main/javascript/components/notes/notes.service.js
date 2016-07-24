angular.module("notes")
    .service("notesService", function(commonBackendService) {
        angular.extend(this, commonBackendService.build('notes'));
    });
