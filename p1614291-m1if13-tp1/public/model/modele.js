/**
 * Created by amaia.nazabal on 2/09/17.
 *
 * Script pour les modèles
 *
 */

var app = app || {};

(function () {
    'use strict';

    /**
     * Le model pour le site, l'identificateur c'est le title, ne pourrant pas avoir deux sites
     * avec le même nom.
     */
    app.Model = Backbone.Model.extend({
        defaults: {
            title: '',
            url: '',
            tags: []
        },
        idAttribute: 'title',
        url: function() {
            return "/bookmarks/" + this.get("title");
        }
    });

    /**
     * Le model pour la collection de tags, l'identificateur est le tag, alors, ne pourra pas avoir
     * deux tags avec le même nom
     */
    app.Tag = Backbone.Model.extend({
        defaults: {
            tag: ''
        },
        idAttribute: 'tag'
    });

    if (app.DEBUG) {
        console.debug("DEBUG: Models loaded.");
    }
})();
