var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var Tag = require('../shared/tag.js');
var Bookmark = require('../shared/annuaire.js');
var less = require('less');
var app = module.exports = express();


/**
 * Définition de ressources statiques dans le dossier public
 */
app.use(express.static(__dirname + path.sep + '../public'));
app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use('/bootstrap-js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
app.use('/bootstrap-css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));

var urlencodedParser = bodyParser.urlencoded({extended: false});

/**
 * Fonction outil pour affecter la date et heure sans miliseconds.s
 * @type {Function}
 */
var setLastModified = (function () {
    var last_modification = new Date();
    last_modification.setMilliseconds(0);

    return last_modification;
});

var last_modification = setLastModified();

/* Controller */


app.get('/', function (req, res) {

    res.sendFile(path.resolve('public/index.html'));
});

app.get('/tag.js', function (req, res) {
    res.sendFile(path.resolve('shared/tag.js'));

});

/* CRUD methodes */

/**
 * Retourne la entité de un link selon l'identificateur envoyé.
 * 404 si l'identificateur ne correspond pas à aucun link
 */
app.get('/bookmarks/:id', function (req, res) {
    var site = Bookmark.get(req.params.id);

    if (!Object.keys(site).length) {
        res.status(404).send();
    } else {
        res.status(200).send(JSON.stringify(site));
    }
});

/**
 * Retourne tous les links de l'Bookmark
 */
app.get('/bookmarks/', function (req, res) {

    var all_bookmarks = Bookmark.collection;
    var collection = [];

    if (typeof req.get('If-Modified-Since') === 'undefined' || (new Date(req.get('If-Modified-Since'))) < last_modification) {

        for (var key in all_bookmarks) {
            if (all_bookmarks.hasOwnProperty(key))
                collection.push({
                    title: key, url: all_bookmarks[key].value,
                    tags: all_bookmarks[key].tags.collection.join(',')
                });
        }

        res.setHeader('Last-Modified', last_modification.toUTCString());
        res.send(JSON.stringify(collection));
    } else {
        res.status(304).send();
    }

});

/**
 * Cette méthode crée un nouveau link
 */
app.post('/bookmarks/', urlencodedParser, function (req, res) {
    try {
        var model = JSON.parse(req.body.model);
        var url = model.url;
        var nom = model.title;
        var tags = model.tags;

        var tag = new Tag();
        tags.split(',').forEach(function (e) {
            tag.add(e);
        });

        Bookmark.bind(nom, url, tag);
        last_modification = setLastModified();

        res.status(201).send(JSON.stringify(Bookmark.get(nom)));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * Cette méthode supprime un link
 */
app.delete('/bookmarks/:id', function (req, res) {
    Bookmark.remove(req.params.id);
    last_modification = setLastModified();
    res.status(204).send();
});


