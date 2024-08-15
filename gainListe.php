<?php
// Connexion à la base de données
include("connexionMysql.php");
$serveur = 'localhost';
$utilisateur = 'root';
$motdepasse = '';
$base = 'machineasous';
$connexionMysql = new mysqli($serveur, $utilisateur, $motdepasse, $base);

if ($connexionMysql->connect_error) {
    die("Connection failed: " . $connexionMysql->connect_error);
}

// Récupération de l'ID du joueur depuis les paramètres de la requête
if (isset($_REQUEST['ID'])) {
    $ID = $_REQUEST['ID'];
} else {
    $ID = 0;
}

// Construction de la requête SQL pour récupérer les gains du joueur
$requeteSQL = "SELECT montant, date FROM gains WHERE joueursID = ? ORDER BY ID DESC";

// Préparation de la requête
$stmt = $connexionMysql->prepare($requeteSQL);
$stmt->bind_param("i", $ID);

// Exécution de la requête SQL
$stmt->execute();
$result = $stmt->get_result();

// Initialisation de la structure JSON
echo "{\"gains\":[";

$debut = true;
while ($ligne = $result->fetch_assoc()) {
    if ($debut) {
        echo "{";
        $debut = false;
    } else {
        echo ",{";
    }
    echo "\"montant\":\"" . utf8_encode($ligne['montant']) . "\",";
    echo "\"date\":\"" . utf8_encode($ligne['date']) . "\"";
    echo "}";
}

echo "]}";

// Fermeture de la connexion à la base de données
$stmt->close();
$connexionMysql->close();
?>
