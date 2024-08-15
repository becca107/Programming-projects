<?php
// Indique que le type de la réponse renvoyée au client sera du Texte
header("Content-Type: text/plain");
// Connexion à la base de données
require_once('connexionMysql.php');

// Simulation du temps d'attente du serveur (2 secondes)
sleep(2);

// Récupération du paramètre nom
$nom = isset($_REQUEST['nom']) ? $_REQUEST['nom'] : "inconnu";

// Récupération du paramètre ID
$ID = isset($_REQUEST['ID']) ? $_REQUEST['ID'] : 0;

// Calcul du nouveau gain entre 0 et 100 Euros
$gain = rand(0, 100);

// Requête d'insertion du gain
$commandeSQL = "INSERT INTO gains (montant, joueursID) VALUES ('$gain', '$ID')";

// La requête est soumise au serveur
$reponseSQL = mysqli_query($connexionMysql, $commandeSQL);

// Vérifie si l'insertion a réussi
if (!$reponseSQL) {
    die("Erreur lors de l'insertion : " . mysqli_error($connexionMysql));
}

// Mise en forme du résultat avec le nom et le gain
$resultat = $nom . ':' . $gain . ':' . ($reponseSQL ? "1" : "0");

// Envoi de la réponse à la page HTML
echo $resultat;

// Fermeture de la connexion à la base de données
mysqli_close($connexionMysql);
