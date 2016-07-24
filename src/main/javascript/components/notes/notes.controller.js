angular.module("notes")
    .controller("NotesController", function(notesService, $scope) {
        const vm = this;
        vm.selectedCategory = null;
        vm.notes = [];
        vm.titleInput = '';

        this.create = function(title) {
            var note = {
                title: title,
                category: vm.selectedCategory
            };
            notesService.create(note).then(reload);
            vm.titleInput = '';
        };

        this.delete = function (note) {
            notesService.delete(note).then(reload);
        };

        this.switchDone = function(note) {
            notesService.patch(note, {done: note.done});
        };

        $scope.$on("note.moved", function(e, note, category) {
            // when we receive a "note.moved"-event then
            // update the note with the given category and reload all notes after that
            notesService.patch(note, {category: category}).then(reload);
        });

        $scope.$on("category.selected", function(e, category) {
            vm.selectedCategory = category;
            reload();
        });

        function reload() {
            if (vm.selectedCategory != null) {
                // load all notes for the given category
                notesService.getAssociation(vm.selectedCategory).then(function(response) {
                    vm.notes = response.data;
                });
            }
        }

    });

