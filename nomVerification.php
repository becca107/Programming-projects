<?php
header("Content-Type: text/plain; charset=utf-8");
header("Cache-Control: no-cache, private");
header("Pragma: no-cache");

// Inclusion du fichier de connexion
require_once('connexionMysql.php');

// Vérification que la connexion a été bien établie
if (!isset($connexionMysql) || !$connexionMysql) {
    die("Erreur de connexion à la base de données : " . mysqli_connect_error());
}

// Vérification de l'entrée utilisateur
if (isset($_REQUEST['nom'])) {
    $nom = $_REQUEST['nom'];
} else {
    $nom = "inconnu";
}

// Sécurisation de l'entrée utilisateur
$nom = mysqli_real_escape_string($connexionMysql, $nom);

// Exécution de la requête SQL avec vérification de la casse
$requeteSQL = "SELECT ID FROM joueurs WHERE BINARY nom='$nom'";
$reponseSQL = mysqli_query($connexionMysql, $requeteSQL);

// Vérification de la réponse SQL et récupération du résultat
if ($reponseSQL) {
    if (mysqli_num_rows($reponseSQL) > 0) {
        $enregistrement = mysqli_fetch_array($reponseSQL);
        $ID = $enregistrement["ID"];
    } else {
        $ID = 0;
    }
    echo $ID;
} else {
    echo "Erreur dans la requête SQL : " . mysqli_error($connexionMysql);
}

// Fermeture de la connexion à la base de données
mysqli_close($connexionMysql);

