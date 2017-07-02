

/**
 * Cette méthode récupére la valeur de la chaîne
 *
 * @param val
 * @returns {string}
 */
var escapeHtml = function(val) {
    return val.replace(/[<>]/g, '');
};
/**
 * Initialise la collection de bookmarks
 *
 * @constructor
 */
var Annuaire = function() {
    this.collection = {};
};

/**
 *
 * Cette méthode retourne l'url du site
 *
 * @param key le nom du site
 * @returns {*|string} l'url du site
 */
Annuaire.prototype.get = function(key) {
    return this.collection[key];
};

/**
 *
 * Cette méthode ajoute un nouveau item dans la collection
 *
 * @param key le nom du site
 * @param value l'url du site
 * @param tags la liste de tags associés au site
 * @returns {boolean} retourne si l'objet a été ajouté dans la collection
 */
Annuaire.prototype.bind = function(key, value, tags) {
    try {
		/* Si le paramètre tags n'a pas été envoyé on le declare comme un array. */
        tags = tags || [];


        key = escapeHtml(key);
        value = escapeHtml(value);

        this.collection[key] = {value: "", tags: ""};
        this.collection[key].value = value;
        this.collection[key].tags = tags;

        return true;

    } catch(e) {
        console.error("Exception", e);
        return false;
    }
};

/**
 * Supprime l'item de la collection
 *
 * @param key le nom du site
 */
Annuaire.prototype.remove = function(key) {
    delete this.collection[key];
};


try {
    module.exports = new Annuaire();
}catch (e){
    console.error("Error", e.message);
}