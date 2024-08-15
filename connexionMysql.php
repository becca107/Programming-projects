<?php
// Paramètres de connexion à la base de données
$serveur = 'localhost';
$utilisateur = 'root';
$motdepasse = '';
$base = 'machineasous';

// Connexion à la base de données
$connexionMysql = mysqli_connect($serveur, $utilisateur, $motdepasse, $base);

// Vérifie si la connexion a réussi
if (!$connexionMysql) {
    die("Échec de la connexion : " . mysqli_connect_error());
}

