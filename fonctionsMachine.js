// JavaScript Document

// Exécution de la fonction testerNavigateur lorsque la fenêtre est chargée
window.onload = testerNavigateur;

// Déclaration des variables globales
var objetXHR;
var objetXHR2;
var objetXHR3;
var joueurID = 0; // Variable globale pour stocker l'ID du joueur

// Fonction pour tester la compatibilité du navigateur pour la création d'un objet XHR
function testerNavigateur() {
    objetXHR = creationXHR();
    if (objetXHR == null) {
        // Si l'objet XHR ne peut pas être créé, désactive le bouton et affiche un message d'erreur
        document.getElementById("button").disabled = true;
        var erreurNavigateur = "Erreur Navigateur : Création d'objet XHR impossible";
        remplacerContenu("info", erreurNavigateur);
        document.getElementById("info").style.visibility = "visible";
    } else {
        // Si l'objet XHR est créé, assigne la fonction verifierNom à l'événement onkeyup du champ de saisie
        document.getElementById("nom").onkeyup = verifierNom;
    }
}

// Fonction appelée lors du clic sur le bouton JOUER
function jouer() {
    console.log("La fonction jouer à été appelée");
    objetXHR = creationXHR();
    var temps = new Date().getTime();
    var nom = document.getElementById("nom").value;
    var parametres = "nom=" + encodeURIComponent(nom) + "&ID=" + joueurID + "&anticache=" + temps;

    console.log("Envoi de la requête à gainAleatoire.php avec les paramètres : " + parametres);
    objetXHR.open("GET", "gainAleatoire.php?" + parametres, true);
    objetXHR.onreadystatechange = actualiserPage;
    document.getElementById("button").disabled = true;
    document.getElementById("charge").style.visibility = "visible";
    objetXHR.send(null);
}

// Fonction de rappel pour actualiser la page avec les résultats
function actualiserPage() {
    if (objetXHR.readyState == 4) {
        console.log("Réponse reçue, status : " + objetXHR.status);
        if (objetXHR.status == 200) {
            console.log("Texte de la réponse : " + objetXHR.responseText);
            var nouveauResultat = objetXHR.responseText.split(":");
            if (nouveauResultat[2] == "1") {
                demandeGains();
                console.log("Insertion réussie");
                var elementInfo = document.getElementById("info");
                elementInfo.innerHTML = 'Bravo, M <span id="gagnant"></span>&nbsp;vous avez gagné <span id="resultat"></span>&nbsp;Euros';
                elementInfo.style.color = "black";
                remplacerContenu("resultat", decodeURI(nouveauResultat[1]));
                remplacerContenu("gagnant", decodeURI(nouveauResultat[0]));
            } else {
                console.log("Échec de l'insertion");
                var elementInfo = document.getElementById("info");
                elementInfo.innerHTML = "Problème technique : gains non enregistrés";
                elementInfo.style.color = "red";
            }
            document.getElementById("info").style.visibility = "visible";
            document.getElementById("button").disabled = false;
            document.getElementById("charge").style.visibility = "hidden";
        }
    }
}

// Fonction pour vérifier le nom saisi dans la base de données
function verifierNom() {
    var nom = document.getElementById("nom").value.trim();

    // Vérification du nombre de caractères
    var taille = nom.length;
    if (taille < 4) {
        // Si le nom contient moins de 4 caractères, afficher un message d'erreur et désactiver le bouton
        document.getElementById("message").style.visibility = "visible";
        remplacerContenu("message", "Nombre de caractères insuffisant");
        document.getElementById("message").style.color = "red";
        document.getElementById("button").disabled = true;
        return;
    }

    // Si le nom a plus de 3 caractères, continuer avec la requête AJAX
    objetXHR2 = creationXHR();
    if (objetXHR2 == null) {
        // Si l'objet XHR ne peut pas être créé, afficher un message d'erreur et désactiver le bouton
        remplacerContenu("message", "Erreur Navigateur : Création d'objet XHR impossible");
        document.getElementById("message").style.color = "red";
        document.getElementById("button").disabled = true;
        return;
    }

    var url = "nomVerification.php?nom=" + encodeURIComponent(nom);
    objetXHR2.open("GET", url, true);
    objetXHR2.onreadystatechange = function() {
        if (objetXHR2.readyState === 4) {
            if (objetXHR2.status === 200) {
                // Récupérer le résultat de la vérification et appeler afficherReponse
                joueurID = objetXHR2.responseText.trim();
                afficherReponse(joueurID);
            } else {
                // Afficher un message d'erreur en cas de problème avec la requête
                remplacerContenu("message", "Erreur de serveur : " + objetXHR2.status + " – " + objetXHR2.statusText);
                document.getElementById("message").style.color = "red";
                document.getElementById("button").disabled = true;
            }
        }
    };
    objetXHR2.send(null);
}

// Fonction pour afficher la réponse de la vérification du nom
function afficherReponse(nouveauResultat) {
    if (objetXHR2.readyState == 4){
        if (objetXHR2.status == 200){
            if (nouveauResultat != "0") {
                // Si le nom est trouvé dans la base de données
                remplacerContenu("message", "Joueur identifié");
                document.getElementById("button").disabled = false;
                document.getElementById("message").style.color = "green";
            } else {
                // Si le nom n'est pas trouvé dans la base de données
                remplacerContenu("message", "Joueur inconnu");
                document.getElementById("button").disabled = true;
                document.getElementById("message").style.color = "red";
            }
        }
    }
}

// Fonction pour récupérer les gains du joueur
function demandeGains() {
    objetXHR3 = creationXHR();
    var temps = new Date().getTime();
    var parametres3 = "ID=" + joueurID + "&anticache=" + temps;
    objetXHR3.open("GET", "gainListe.php?" + parametres3, true);
    objetXHR3.onreadystatechange = afficheGains;
    objetXHR3.send(null);
}

// Fonction pour afficher les gains dans un tableau
function afficheGains() {
    if (objetXHR3.readyState == 4) {
        if (objetXHR3.status == 200) {
            var listeJSON = objetXHR3.responseText;
            var objetJSON3 = JSON.parse(listeJSON);
            var gains = objetJSON3.gains;
            var tableListe = document.getElementById("tableListe");
            supprimerContenu(tableListe);
            /*
            for(var i = 0; i < objetJSON3.gains.length; i++) {
                var montant = objetJSON3.gains[i].montant;
                var date = objetJSON3.gains[i].date;
                nouvelleLigne(tableListe, date, montant);
            }
            */
            console.log("Gains", gains)
            let row = "";
            for (const gain of gains) {
                var montant = gain.montant;
                var date = gain.date;
                const newRow = `
                <tr>
                    <td>${montant}</td>
                    <td>${date}</td>
                </tr>`
                row = row + newRow;
                //nouvelleLigne(tableListe, date, montant);
            }
            tableListe.innerHTML = row;
        }
    }
}

// Fonction pour créer une nouvelle ligne dans le tableau
function nouvelleLigne(tab, text1, text2) {
    var nouveauTR = document.createElement('tr');
    var nouveauTD1 = document.createElement('td');
    var nouveauTXT1 = document.createTextNode(text1);
    nouveauTD1.appendChild(nouveauTXT1);
    var nouveauTD2 = document.createElement('td');
    var nouveauTXT2 = document.createTextNode(text2);
    nouveauTD2.appendChild(nouveauTXT2);
    nouveauTR.appendChild(nouveauTD1);
    nouveauTR.appendChild(nouveauTD2);
    tab.appendChild(nouveauTR);
}
