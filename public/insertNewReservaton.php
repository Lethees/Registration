<?php
$FirstName = $_POST['FirstName'];
$LastName = $_POST['LastName'];
$Phone = $_POST['Phone']
$RoomNumber = $_POST['RoomNumber'];
$checkInDate = $_POST['checkInDate'];
$checkOutDate = $_POST['checkOutDate'];
$validID = $_POST['validID'];

require("connection.php");
$db = get_db();

try
{
	$query1 = 'INSERT INTO customer (first_name, last_name, phone, valid_id) VALUES (:FirstName, :LastName, :Phone, :validID)';
	$query = 'INSERT INTO reservation (check_in_date, check_out_date, customer_id, room_number) 
	VALUES (:checkInDate, :checkOutDate, (SELECT currval('customer_id_seq')), :RoomNumber)';

$statement = $db->prepare($query1);
$statement->bindValue(':FirstName', $FirstName);
$statement->bindValue(':LastName', $LastName);
$statement->bindValue(':Phone', $Phone);
$statement->bindValue(':validID', $validID);
$statement->execute();

	$statement = $db->prepare($query);
	$statement->bindValue(':checkInDate', $checkInDate);
	$statement->bindValue(':checkOutDate', $checkOutDate);
  $statement->bindValue(':RoomNumber', $RoomNumber);
	$statement->execute();

	
	
	// SELECT c.relname FROM pg_class c WHERE c.relkind = 'S';   -- display all sequences
	// get id of last inserted row - save in $userId
	// $userId = $db->lastInsertId("reservation_id_seq");
}
catch (Exception $ex)
{
	echo "Error with DB. Details: $ex";
	die();
}
header("Location: /");

die(); 

?>