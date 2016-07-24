angular.module("categories")
    .controller("CategoriesController", function (categoriesService, $rootScope) {
        var vm = this;
        vm.categories = [];
        vm.activeCategory = null;
        init();

        this.create = function() {
            categoriesService.create({title: vm.titleInput}).then(function(response) {
                // we could reload, but then we would have to select the correct category again
                vm.categories.push(response.data);
            });

            // clear and hide input for new category name
            vm.titleInput = '';
            vm.isCreateMode = false;
        };

        this.drop = function(note, category) {
            // notify notes controller on successful drag'n'drop on a category
            $rootScope.$broadcast("note.moved", note, category);
        };

        this.delete = function(category) {
            categoriesService.delete(category).then(function() {
                // remove category from categories list
                _.pull(vm.categories, category);

                // if we just deleted the selected category then select another one
                if( ! _.includes(vm.categories, category)) {
                    vm.select(vm.categories[0]);
                }
            });
        };

        this.isActive = function(category) {
            return vm.activeCategory === category;
        };

        this.select = function(category) {
            vm.activeCategory = category;

            // notify everyone that the selected category changed, notes controller needs it to update the displayed notes
            $rootScope.$broadcast("category.selected", category);
        };

        function init() {
            reload().then(function() {
                vm.select(vm.categories[0]);
            });
        }

        function reload() {
            return categoriesService.fetch().then(function(response) {
                vm.categories = response.data;
            });
        }
    });
