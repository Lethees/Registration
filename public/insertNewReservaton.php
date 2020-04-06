<?php
$customerID = $_POST['customerID'];
$RoomNumber = $_POST['RoomNumber'];
$checkInDate = $_POST['checkInDate'];
$checkOutDate = $_POST['checkOutDate'];

require("connection.php");
$db = get_db();

try
{
	$query = 'INSERT INTO reservation (check_in_date, check_out_date, customer_id, room_number) 
	VALUES (:checkInDate, :checkOutDate, :customerID, :RoomNumber)';
	$statement = $db->prepare($query);
	$statement->bindValue(':checkInDate', $checkInDate);
	$statement->bindValue(':checkOutDate', $checkOutDate);
  $statement->bindValue(':customerID', $customerID);
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