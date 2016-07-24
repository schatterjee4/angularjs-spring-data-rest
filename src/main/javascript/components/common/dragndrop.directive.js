angular.module('common')
    // directives may be used in HTML.
    .directive('draggableModel', function() {
        return {
            restrict: 'A', // only on attributes as "draggable-model" allowed
            scope: {
                // take the attribute value as name for a variable in the scope.
                // This local scope now has a property called "model" which has the value of the variable referenced in draggableModel
                'model': '<draggableModel'
            },
            link: function(scope, iElement, iAttrs, controller, transcludeFn) {
                $(iElement).on("dragstart", function(e) {
                    // when dragging is started then add the model as dataTransfer attribute.
                    // see https://developer.mozilla.org/de/docs/Web/API/DataTransfer
                    e.originalEvent.dataTransfer.setData("application/json", JSON.stringify(scope.model));
                    $(iElement).addClass("dragging");
                });

                $(iElement).on("dragend", function() {
                    // when drag is over remove the "dragging"-class
                    $(iElement).removeClass("dragging");
                });
            }
        }
    })
    .directive('droppable', function() {
        return {
            restrict: 'A', // use directive droppable only as html-attribute
            scope: {
                'dropHandler': '<dropHandler',
                'dropDataAdditional': '<dropDataAdditional'
            },
            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                $(iElement).on('dragover', function (e) {
                    // this signals that the element with "droppable" allows dropping of elements
                    e.preventDefault();
                    return false;
                });

                $(iElement).on("drop", function(e) {
                    // if a drop is successful then load the data and call the function referenced in the
                    // "drop-handler"-attribute together with variables referenced in "drop-data-additional"
                    var data = e.originalEvent.dataTransfer.getData("application/json");
                    var model = JSON.parse(data);
                    scope.dropHandler(model, scope.dropDataAdditional);
                })
            }
        }
    });
