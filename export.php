
<?php

//data table from file
$response = 0;
if (isset($_POST['export-table'])) {
    $fileToWrite = fopen("shows.csv", "w") or die("Unable to open");

    //adding legend line
    $legend = "Show Title, Episode Name, Season, Date Watched \n";
    fwrite($fileToWrite, $legend);

    //adding entries from POST
    for ($i = 0; $i < count($_POST) - 1; $i++) {
        echo count($_POST);
        $entry = $_POST['' . $i . '-episode'];
        $entry = htmlspecialchars_decode($entry);
        fwrite($fileToWrite, $entry);
    }

    if ($response == 0) {
        $response = "File created";
    }

    fclose($fileToWrite);
    // unlink($uploadPath);

    echo $response . count($_POST);

    // echo "</table>";
    // header("Location: hthttp://127.0.0.1/server/Text%20to%20groups/export.php");
    exit;
}





?>