angular.module("common")
    .service("commonBackendService", function(backendUrl, $http) {

        // commonBackendService is kind of a baseclass for our other services.
        // It provides common functionality for Spring Data Rest backends.
        this.build = function(entityName) {
            var defaultResponseTransformer = {
                transformResponse: function(data) {
                    // Spring data Rest provides entities like the following:
                    // {
                    //   _embedded: {
                    //     notes: [ /* here is the interesting stuff */ ]
                    //   }
                    // }
                    // This code unwraps it:
                    return JSON.parse(data)._embedded[entityName];
                }
            };

            return {
                fetch: function() {
                    // fetch all entities and return the promise for it
                    return $http.get(backendUrl + entityName, defaultResponseTransformer);
                },
                create: function(entity) {
                    // create a new entity and return the promise for it
                    return $http.post(backendUrl + entityName, replaceNestedObjectsWithLinks(entity));
                },
                patch: function(entity, data) {
                    // update some properties of a given entity
                    return $http.patch(extractSelfLink(entity), replaceNestedObjectsWithLinks(data));
                },
                getAssociation: function(entity) {
                    // This one is open for discussion.
                    // It fetches all subentities of the name of the entity this service is responsible for.
                    // If the subentity has another name or the same name but another type then this will lead to confusion.
                    // An alternative approach would be to add a method in the notesService directly, like fetchAllNotesOfCategory(category)
                    return $http.get(extractLink(entity, entityName), defaultResponseTransformer)
                },
                delete: function(entity) {
                    return $http.delete(extractSelfLink(entity));
                },
                extractSelfLink: extractSelfLink,
                extractLink: extractLink
            }
        };

        function extractSelfLink(entity) {
            return extractLink(entity, 'self');
        }

        function extractLink(entity, link) {
            return entity._links[link].href;
        }

        function replaceNestedObjectsWithLinks(entity) {
            // this function assumes that every resource has its own endpoint.
            // if this is the case you can substitue objects in an entity with the corresponding link.
            var entityToPost = angular.extend({}, entity);
            for (var property in entityToPost) {
                // convert nested properties to self link
                if (angular.isObject(entityToPost[property])) {
                    entityToPost[property] = extractSelfLink(entity[property]);
                }
            }
            return entityToPost;
        }
    });
