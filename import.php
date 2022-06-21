
<?php


$response = "";
$debug = " |DEBUG| ";

if (isset($_FILES['the_file']['name'])) {
    $customSeparator = $_POST['separator']; //character used to divide the fields

    $currentDirectory = getcwd();
    $uploadDirectory = '/uploads/';
    $errors = [];

    $fileName = strtolower($_FILES['the_file']['name']);
    $fileSize = $_FILES['the_file']['size'];
    $fileTmpName  = $_FILES['the_file']['tmp_name'];
    $fileType = $_FILES['the_file']['type'];

    $tmp = explode('.', $fileName);
    $fileExtension = end($tmp);

    $uploadPath = $currentDirectory . $uploadDirectory . basename($fileName);
    // echo $uploadPath;
    // $fileReady;

    $fileExtensionsAllowed = ['txt', "csv"];
    if (!in_array($fileExtension, $fileExtensionsAllowed)) {
        $errors[] = "This file extension is not allowed. Please upload a txt or csv";
    }

    if ($fileSize > 4000000) {
        $errors[] = "File exceeds maximum size (4MB)";
    }

    if (empty($errors)) {
        $didUpload = move_uploaded_file($fileTmpName, $uploadPath);

        if ($didUpload) {
            // echo "The file " . basename($fileName) . " has been uploaded";
        } else {
            echo "An error occurred. Please try again.";
        }
    } else {
        foreach ($errors as $error) {
            echo $error . "These are the errors" . "\n";
        }
    }


    $myfile = fopen($uploadPath, "r") or die("Unable to open file!");

    $lineNo = 0; // for specific line stop and row number
    // $linesAdded = 0;
    // $nonColon = 0;


    while (!feof($myfile)) {
        // while ($lineNo < 100) { //Debug

        //Skips first line as it is usually a legend
        if ($lineNo == 0) {
            $line = fgets($myfile); //gets first line, usually a legend.
            $lineNo++;
            // $debug .= "Before continue";
            continue;
            // $debug .= "After continue";
        }

        $line = fgets($myfile); //Gets second* line && Next line with each alliteration ??????

        // $debug .= $line;

        $name;
        $title;
        $season;
        $date;

        $line = trim($line);
        $line = ltrim($line, '"');
        $line = rtrim($line, '"');
        // $line = htmlspecialchars($line);


        //netflix
        if ($customSeparator == "netflix") {
            $countComa = substr_count($line, ","); //number of breaks in a line
            $colonPos = strpos($line, ","); //gets position of (,)  ??

            //Finds the last comma in case there is more then one. 
            //As netflix format is:
            // "Show name (that may includes extra ,): show extra name: Season: Episode name","Date" 
            //where any position could include comma as a part of show name.
            if ($countComa > 1) {
                $i = 1;
                while ($i != $countComa) {
                    $colonPos = strpos($line, ",", $colonPos + 1);
                    $i++;
                }
            }

            $fullName = substr($line, 0, $colonPos); //gets name part of format, ("Show name: show extra name: Season: Episode name")
            $date = substr($line, $colonPos + 1, strlen($line)); //removes text before :, sets date,  (: ... "date")

            $fields = []; //to hold all the parts of the format.

            //removing semicolon
            $fullName = trim($fullName, ' "');
            $date = trim($date, ' "');

            //Sub-dividing fullName of the show into separate parts 
            $countColon = substr_count($fullName, ":"); //counts how many splitting characters are in the line
            $partsNo = $countColon + 1; //+1 to account for the last field which does not have :


            // Movies (don't have semicolon separations)
            if ($countColon == 0 && !empty($fullName)) {
                $name = "Movies";
                $title = $fullName;
                $season = "Movie";
                //$date has already been set

            } else if ($countColon > 0) {
                //If there is more colons meaning it is a show...
                //Gets season name
                $colonPos = strpos($fullName, ":"); //gets : position
                $field = substr($line, 0, $colonPos); //gets text before :
                $fields[] =  $field; //pushes the field to array, [0] = show name
                $fullName = substr($fullName, $colonPos + 1, strlen($fullName)); //removes text before :

                for ($i = 1; $i <= $partsNo - 1; $i++) {

                    // if there is only 2 parts (some netflix shows does not have season description) e.g "Halo 4:Forward Until Dawn"
                    if ($i == 1 && $partsNo == 2) {
                        $fields[] = $fullName; //gets last field (episode name);
                        $fields[] =  "S1"; //pushes season name;
                        break;
                    }

                    //if its last remaining part, eg extra part without : that we accounted in the beginning;
                    if ($i == $partsNo - 1) {
                        $fields[] = $fullName; //gets last field
                        // $debug .= var_dump($fields);
                        break;
                    }

                    //adds any part between 2 and last one;
                    $colonPos = strpos($fullName, ":"); //gets : position
                    $field = substr($fullName, 0, $colonPos); //gets text before :
                    $fields[] = $field; //pushes the field to array;
                    $fullName = substr($fullName, $colonPos + 1, strlen($fullName)); //removes text before :    

                }
            }
            //Sets up the name order
            if ($countColon == 1) {
                //shows without season description and movies
                $name = $fields[0];
                $title = $fields[1];
                $season = $fields[2];
            } else if ($countColon == 2) {
                //Shows in format [show name, season, episode name]
                $name = $fields[0];
                $title = $fields[2];
                $season = $fields[1];
            } else if ($countColon == 3) {
                //shows with extra show name
                $name = $fields[0] . ": " . $fields[1];
                $title = $fields[3];
                $season = $fields[2];
            } else if ($countColon == 4) {
                //Shows with extra show name and extra episode title
                $name = $fields[0] . ": " . $fields[1];
                $title = $fields[3] . ": " . $fields[4];
                $season = $fields[2];
            }
        } else if (!empty($line)) { //Use custom separator

            $countColon = substr_count($line, $customSeparator); //counts how many spliting characters are in the line
            $fields = [];

            // if ($countColon > 3) echo "line: " . $lineNo . " LINE: " . $line;
            $partsNo = $countColon + 1; //+1 to account for field before : Also there is extra date that is not separated by :

            //Gets first field
            $separationPos = strpos($line, $customSeparator); //gets :* position
            $field = substr($line, 0, $separationPos); //gets text before :
            $fields[] =  $field; //pushes the field to array;
            $line = substr($line, $separationPos + 1, strlen($line)); //removes text before :

            // echo $field . " <-DEBUG- ";

            for ($i = 1; $i <= $partsNo - 1; $i++) {
                // $debug .=  $i . "Enterence";

                // if there is only 2 parts
                if ($i == 1 && $partsNo == 2) {
                    //if it is a season show but does not have season name
                    $field = $line; //gets 2nd/last field;
                    $fields[] =  $field; //pushes the field to array;
                    $fields[] =  "S1"; //pushes season name;
                    $fields[] = "11/10/2021";
                    break;
                }

                //Last field
                if ($i == $partsNo - 1) {
                    $field = $line; //gets last field
                    // $debug .= "I AM HEREERERERERE " . $i . $field . " Empty?";
                    $fields[] =  $field; //pushes the field to array;
                    break;
                }

                $separationPos = strpos($line, $customSeparator); //gets : position
                $field = substr($line, 0, $separationPos); //gets text before separator
                $fields[] = $field; //pushes the field to array;
                $line = substr($line, $separationPos + 1, strlen($line)); //removes text before :    

            }

            // print "Testing this";
            if ($fields[0] != "")
                $name = $fields[0];
            $title = $fields[1];
            $season = $fields[2];
            $date = $fields[3];
            $likeStatus = trim($field);
            // print_r($fields);
        }

        if (isset($name)) {
            $name = cleanText($name);

            $title = cleanText($title);
            $season = cleanText($season);
            $date = cleanText($date);

            if (isset($fields[4])) $likeStatus = $fields[4];
            else $likeStatus = "";

            $lol = $date;
            // $debug .= "Before Date: " . $date . "hm date?: " . $lol;

            $response .=
                "<tr>
                <td>" . $lineNo . "</td>
                <td>" . $name . "</td>
                <td>" . $title . "</td>
                <td>" . $season . "</td>
                <td>" . $date . "</td>
                <td>" . $likeStatus . "</td>
            </tr>";

            // $debug .= " After Date: " . $date . "hm date?: " . $lol;
        }
        $lineNo++;
    }


    // echo "Added: " . $linesAdded . " || Non-colon: " . $nonColon;
    // $response .= " Added: " . $linesAdded . " || Non-colon: " . $nonColon;
    fclose($myfile);
    // fclose($fileToWrite);
    unlink($uploadPath);



    $table = "
    <table id='file-table'>
    <tr>
        <th>No</th>
        <th>Name</th>
        <th>Episode</th>
        <th>Season</th>
        <th>Date</th>
        <th>Rating</th>
    </tr>";

    echo $table . $response . "</table>" . $debug;
    exit;
}

function cleanText($text)
{
    $text = htmlspecialchars_decode($text);
    $text = trim($text, ' ');
    return $text;
}

?>