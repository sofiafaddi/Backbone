/**
 * Created by amaia.nazabal on 2/09/17.
 *
 * Script pour les collections
 *
 */

var app = app || {};

(function () {
    'use strict';

    /**
     * La collection pour les bookmarks
     */
    var Collection = Backbone.Collection.extend({
        model: app.Model,
        comparator: 'title'
    });

    /**
     * Les instances pour les bookmarks de côté serveur et client
     */
    app.ClientCollection = new Collection();

    app.ServerCollection = new Collection();
    app.ServerCollection.url = '/bookmarks/';

    /**
     * La collections pour les tags
     */
    var TagCollection = Backbone.Collection.extend({
        model: app.Tag
    });

    app.TagCollection = new TagCollection();

    /**
     * La function mettre à jour la collection de Tags quand il y a un événement qui changes
     * les valeurs dans la collections
     * @type {Function}
     */
    var updateTagList = (function () {
        app.TagCollection.reset();

         try {
            _.each(app.ServerCollection.models, function (model) {
                _.forEach(model.get('tags').split(','), function (tag) {
                    app.TagCollection.add({tag: tag});
                });
            }, this);

            _.each(app.ClientCollection.models, function (model) {
                _.forEach(model.get('tags').split(','), function (tag) {
                    app.TagCollection.add({tag: tag});
                });
            }, this);
        }catch (e){
            //console.error("ERROR: The tag list has not been synchronized.")
        }
    });

    /**
     * Ces événements vont appeler la function de mis à jour la collection de Tags
     */

    app.ServerCollection.bind('sync remove', function () {
        updateTagList();
    });

    app.ClientCollection.bind('reset add remove', function () {
        updateTagList();
    });

    if (app.DEBUG) {
        console.debug("DEBUG: Collections loaded.");
    }

})();
