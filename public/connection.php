<?php
function get_db() {
   $db = NULL;
   try
   {
     $dbUrl = getenv('postgres://mhbcyrmdbvoijw:0480dbecdc962bd96d8d2b8095bf40d06c69952effb1579597d5bffe6da2be45@ec2-34-193-42-173.compute-1.amazonaws.com:5432/d6babf4h0j1n8v');
   
     $dbOpts = parse_url($dbUrl);
   
     $dbHost = $dbOpts["host"];
     $dbPort = $dbOpts["port"];
     $dbUser = $dbOpts["user"];
     $dbPassword = $dbOpts["pass"];
     $dbName = ltrim($dbOpts["path"],'/');
   
     $db = new PDO("pgsql:host=$dbHost;port=$dbPort;dbname=$dbName", $dbUser, $dbPassword);
   
     $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   }
   catch (PDOException $ex)
   {
     echo 'Error!: ' . $ex->getMessage();
     die();
   }
   return $db;
}
?>