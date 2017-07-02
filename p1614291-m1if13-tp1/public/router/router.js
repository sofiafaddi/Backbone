/**
 * Created by amaia.nazabal on 2/9/17.
 *
 * Script pour le routage du côte client.
 */
var app = app || {};

(function ($) {
    'use strict';

    /**
     *
     * @type {Function}
     */
    var consoleDebug = (function (msg) {
        if (app.DEBUG)
            console.debug(msg)
    });

    /**
     * Le router pour la gestion des urls côté client
     */
    var AppRouter = Backbone.Router.extend({
        initialize: function () {
            if (app.DEBUG) {
                console.debug("DEBUG: Initializing application... ");
                app.ServerCollection.fetch();
            }
        },

        routes: {
            '': 'home',
            '#': 'home',
            'server': 'server',
            'client': 'client',
            'tag': 'tag',
            'tag/:param': 'tag'
        },

        home: function () {
            consoleDebug("DEBUG: Route to home view.");

            this.loadView(new app.HomeView());

            $('#accueil-view').parent().addClass('active');
            $('#client-view').parent().removeClass('active');
            $('#server-view').parent().removeClass('active');
            $('#tag-view').parent().removeClass('active');

            $('.user-info').css("display", "block");
            $(".content-client").css("display", "none");
            $(".content-server").css("display", "none");
            $(".content-tags").css("display", "none");

        },

        server: function () {
            consoleDebug("DEBUG: Route to server view.");

            this.loadView(new app.ServerView());

            $('#accueil-view').parent().removeClass('active');
            $('#client-view').parent().removeClass('active');
            $('#server-view').parent().addClass('active');
            $('#tag-view').parent().removeClass('active');

            $(".content-home").css("display", "none");
            $(".content-client").css("display", "none");
            $(".content-tags").css("display", "none");
        },

        client: function () {
            consoleDebug("DEBUG: Route to client view.");
            this.loadView(new app.ClientView());

            $('#accueil-view').parent().removeClass('active');
            $('#server-view').parent().removeClass('active');
            $('#client-view').parent().addClass('active');
            $('#tag-view').parent().removeClass('active');

            $(".content-home").css("display", "none");
            $(".content-server").css("display", "none");
            $(".content-tags").css("display", "none");
        },

        tag: function (param) {
            consoleDebug("DEBUG: Route to tag view. " +  param);

            if (typeof param !== 'undefined' && param !== null)
                this.loadView(new app.ViewByTag({selectTag: param}));
            else
                this.loadView(new app.ViewByTag({}));

            $('#accueil-view').parent().removeClass('active');
            $('#server-view').parent().removeClass('active');
            $('#client-view').parent().removeClass('active');
            $('#tag-view').parent().addClass('active');

            $('.user-info').css("display", "none");
            $(".content-home").css("display", "none");
            $(".content-server").css("display", "none");
            $(".content-client").css("display", "none");
        },

        loadView: function (view) {
            this.view && this.view.hide();
            this.view = view;
        }
    });

    app.DEBUG = false;
    app.appRouter = new AppRouter();


    /**
     * On active l'option pour la gestion de l'historial du navigateur
     */
    Backbone.history.start();

    consoleDebug("DEBUG: History app initialized.");

})(jQuery);