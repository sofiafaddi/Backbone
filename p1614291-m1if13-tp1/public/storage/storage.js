/**
 * Created by amaia.nazabal on 3/16/17.
 */

var app = app || {};

(function ($) {
    'use strict';

    /**
     * 
     * @type {Function}
     */
    var getModel = (function (title, url, tags) {
        var model = {
            title: title.val(),
            url: url.val(),
            tags: tags.val()
        };

        title.val('');
        url.val('');
        tags.val('');

        return model;
    });


    /**
     *
     * @type {Function}
     */
    var consoleDebug = (function (msg) {
        if (app.DEBUG)
            console.debug(msg)
    });


    app.AddEvent = _.extend({}, Backbone.Events);


    if (typeof (Storage) !== 'undefined') {

        var server_modal = $('#serverModal');
        var client_modal = $('#clientModal');

        /**
         *
         */
        server_modal.on('hidden.bs.modal', function () {
            var title_selector = $('#key-server');
            if (title_selector.val() !== '') {
                localStorage.setItem('_server_cache', JSON.stringify(getModel(title_selector, $('#value-server'),
                    $('#tags-server'))));
                consoleDebug("DEBUG: server cache stored.");
            }
        });

        /**
         *
         */
        client_modal.on('hidden.bs.modal', function () {
            var title_selector = $('#key-client');

            if (title_selector.val() !== '') {
                localStorage.setItem('_client_cache', JSON.stringify(getModel(title_selector, $('#value-client'),
                    $('#tags-client'))));
                consoleDebug("DEBUG: client cache stored.");
            }
        });


        /**
         *
         */
        server_modal.on('show.bs.modal', function () {

            if (localStorage.hasOwnProperty('_server_cache')) {
                var model = JSON.parse(localStorage.getItem('_server_cache'));

                $('#key-server').val(model.title);
                $('#value-server').val(model.url);
                $('#tags-server').val(model.tags);

                localStorage.removeItem('_server_cache');
                consoleDebug("DEBUG: server cache restored.");
            }
        });

        /**
         *
         */
        client_modal.on('show.bs.modal', function () {

            if (localStorage.hasOwnProperty('_client_cache')) {
                var model = JSON.parse(localStorage.getItem('_client_cache'));

                $('#key-client').val(model.title);
                $('#value-client').val(model.url);
                $('#tags-client').val(model.tags);

                localStorage.removeItem('_client_cache');
                consoleDebug("DEBUG: client cache restored.");
            }
        });
    }

})(jQuery);


(function () {
    'use strict';

    var MAX_HISTORY = 5;

    /**
     *
     * @type {Function}
     */
    var getDateFormatted = (function (date) {
        return "<div class='date'> Le <span class='date_date'>"+ date.getDate()  + "-" + (date.getMonth() + 1) + "-"
            + date.getFullYear() + "</span>à  <span class='heure'>"+ date.getHours() + ":" + date.getMinutes()+"</span>";
    });

    /**
     *
     * @type {Function}
     */
    var getHistoryFormatted = (function (date) {
        return "Le "+ date.getDate()  + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " +
            date.getHours() + ":" + date.getMinutes()+"";
    });

    /**
     *
     * @type {Function}
     */
    var addRecord = (function (date, action) {
        var history = JSON.parse(sessionStorage.getItem('_cache_last_five_changes')) || [];
        if (history.length === MAX_HISTORY)
            history.shift();

        history.push({'date': getHistoryFormatted(date), 'action': action});
        sessionStorage.setItem('_cache_last_five_changes', JSON.stringify(history));
    });

    /**
     *
     */
    app.ClientCollection.on('add', function (e) {
        if (e.attributes.titre !== '' && typeof e.attributes.title !== 'undefined') {
            localStorage.setItem(e.attributes.title, JSON.stringify(e.attributes));
        }
    }, this);

    /**
     *
     */
    app.ClientCollection.on('remove', function (e) {
        localStorage.removeItem(e.attributes.title);
    }, this);

    /**
     *
     */
    app.AddEvent.on('client-add', function (model) {
        if (sessionStorage.getItem('user')) {
            var date = new Date();

            sessionStorage.setItem('_cache_last_bookmark_client', JSON.stringify(model));
            sessionStorage.setItem('_cache_last_modification', getDateFormatted(date));

            addRecord(date, 'Nouveau bookmark ajouté côté client: ' + model.title);
        }
    });

    /**
     *
     */
    app.AddEvent.on('client-remove', function (title) {

        if (sessionStorage.getItem('user')) {
            var date = new Date();

            sessionStorage.setItem('_cache_last_modification', getDateFormatted(date));
            addRecord(date, 'Bookmark suprimé côté client: ' + title);
        }
    });

    /**
     *
     */
    app.AddEvent.on('server-add', function (model) {
        if (sessionStorage.getItem('user')) {
            var date = new Date();
            sessionStorage.setItem('_cache_last_modification', getDateFormatted(date));
            sessionStorage.setItem('_cache_last_bookmark_server', JSON.stringify(model));

            addRecord(date, 'Nouveau bookmark ajouté côté serveur: ' + model.title);
        }
    });

    /**
     *
     */
    app.AddEvent.on('clean-all', function () {
        if (sessionStorage.getItem('user')) {
            var date = new Date();
            sessionStorage.setItem('_cache_last_modification', getDateFormatted(date));
            addRecord(date, 'Tous les bookmarks ont été suprimés');
        }
    });

    /**
     *
     */
    app.AddEvent.on('server-remove', function (title) {
        if (sessionStorage.getItem('user')) {
            var date = new Date();
            sessionStorage.setItem('_cache_last_modification', getDateFormatted(date));
            addRecord(date, 'Bookmark suprimé côté serveur: ' + title);
        }
    });


})();

/**
 * 
 */
(function () {
    'use strict';

    var all_bookmarks = [];

    for (var key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            var element = JSON.parse(localStorage.getItem(key));

            var bookmark = new app.Model({
                title: element.title,
                url: element.url,
                tags: element.tags
            });

            all_bookmarks.push(bookmark);
        }
    }

    app.ClientCollection.set(all_bookmarks);
})();