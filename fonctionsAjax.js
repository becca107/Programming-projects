// JavaScript Document

// Fonction pour créer un objet XHR compatible avec différents navigateurs
function creationXHR() {
    var resultat = null;
    try {
        // Test pour les navigateurs : Mozilla, Opéra, etc.
        resultat = new XMLHttpRequest();
    }
    catch (Error) {
        try {
            // Test pour les navigateurs Internet Explorer > 5.0
            resultat = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (Error) {
            try {
                // Test pour le navigateur Internet Explorer 5.0
                resultat = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (Error) {
                resultat = null;
            }
        }
    }
    return resultat;
}

// Fonctions de gestion du DOM (solution alternative à innerHTML)

// Fonction pour remplacer le contenu d'un élément
function remplacerContenu(id, texte) {
    var element = document.getElementById(id);
    if (element != null) {
        supprimerContenu(element);
        var nouveauContenu = document.createTextNode(texte);
        element.appendChild(nouveauContenu);
    }
}

// Fonction pour supprimer le contenu d'un élément
function supprimerContenu(element) {
    if (element != null) {
        while(element.firstChild)
            element.removeChild(element.firstChild);
    }
}
