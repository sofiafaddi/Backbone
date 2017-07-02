/**
 * Created by amaia.nazabal on 2/9/17.
 */

/**
 * Constructeur des categories
 * @constructor
 */
function Tag () {
    this.collection = [];
}

/**
 * Cette méthode retourne tous les elèments qui sont dans la collection
 * @returns {{}|*}
 */
Tag.prototype.getAll = function () {
    return this.collection;
};

/**
 * Cette méthode ajoute un nouveau tag en vérifiant d'avance, si le tag n'existe pas déjà.
 * Si le tag exists déjà le méthode ne fait rien.
 *
 * @param data le tag qu'on veut ajouter
 */
Tag.prototype.add = function (data) {
    if (!this.exists(data)) {
        this.collection.push(data);
    }
};

/**
 * Cette méthode vérifie l'existance d'un tag dans la collection.
 *
 * @param data le tag qu'on veut vérifier
 * @returns {boolean} si le tag existe déjà ou pas.
 */
Tag.prototype.exists = function (data) {
    return typeof this.collection[data] !== 'undefined';
};

/**
 * Supprime un tag donné dans la collection.
 * @param data le tag qu'on veut supprimer.
 */
Tag.prototype.delete = function (data) {
    delete this.collection[data];
};

/**
 * Cette méthode permet de voir tous les tags de la collection entre virgules.
 *
 * @returns {string} tous les tags
 */
Tag.prototype.print = function () {
    return this.collection.join(',');
};

/**
 * On exporte le module pour pouvoir l'utiliser dans le controller.
 */
try {
    module.exports = Tag;
}catch (e){
    console.error("Exception: ", e);
}