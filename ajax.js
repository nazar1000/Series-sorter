//gets information from a file (import);
function getFileInfo() {
    let file = document.getElementById("add-file-button"); //fileToUpload previously ??
    let option = getSelection();

    if (file.files.length > 0) {
        document.getElementById("import-error").style.display = "none";

        let formData = new FormData();
        formData.append("the_file", file.files[0]);
        formData.append("separator", option);

        var xhttp = new XMLHttpRequest();

        //Post
        xhttp.open("POST", "import.php", true);

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var response = this.responseText;

                if (response != 0) {
                    console.log(response);
                    // alert("Upload succesfull");
                    file.value = ""; //resets file
                    document.getElementById("raw").innerHTML = response;
                    checkRawList();
                    toggleToolsContainer(0, true);
                    return false;

                } else {
                    alert("Failed")

                }
            }
        }


        //send request
        xhttp.send(formData);


    } else {
        document.getElementById("import-error").style.display = "block";

    }
}

//creates a file from the library
function exportCSV() {
    let formData = new FormData();
    let groups = document.getElementsByClassName("group");
    let separatingChar = getSelection();

    //Hiding error
    if (groups.length > 0) {
        document.getElementById("export-error").style.display = "none";
        let log = "";

        let count = 0;
        for (let i = 0; i < groups.length; i++) {
            let seriesName = groups[i].getElementsByTagName("h3")[0].innerHTML;
            let episodes = groups[i].getElementsByTagName("tr");

            for (let e = 1; e < episodes.length; e++) {
                let episodeName = episodes[e].getElementsByTagName("h3")[1].innerHTML;
                let season = episodes[e].getElementsByTagName("h3")[2].innerHTML;
                let date = episodes[e].getElementsByTagName("h3")[3].innerHTML;
                let likeStatus = groups[i].getElementsByTagName("th")[4].firstChild.getAttribute("data");
                if (likeStatus == "undefined" || likeStatus == "") likeStatus = null;
                if (separatingChar == "netflix") {
                    log += '"' + seriesName + ":" + season + ":" + episodeName + '"' + "," + '"' + date + '"' + "\n";
                } else {
                    log += seriesName + separatingChar + episodeName + separatingChar + season + separatingChar + date + (likeStatus === null ? "" : (separatingChar + likeStatus)) + "\n";
                }


                if (count % 5 == 0 || e == episodes.length - 1) {
                    formData.append(count + "-episode", log);
                    log = "";
                    count++
                }
            }
        }

        formData.append("export-table", formData);
        let xhttp = new XMLHttpRequest();

        //Post
        xhttp.open("POST", "index.php", true);

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = this.responseText;

                if (response != 0) {
                    // console.log(response);
                    let downloadButton = document.getElementById("export-download");
                    downloadButton.setAttribute("href", "shows.csv");
                    // downloadButton.innerHTML = "shows.csv";
                    // downloadButton.style.display = "block";
                    downloadButton.click();

                } else {
                    alert("Failed");
                }
            }
        }

        //send request
        xhttp.send(formData);

    } else {
        document.getElementById("export-error").style.display = "block";
    }
}

function getSelection() {
    let options = document.getElementById("file-settings").getElementsByTagName("input");
    let option;

    if (options[0].checked) option = "netflix";
    else if (options[1].checked) option = options[1].value;
    else if (options[2].checked) option = options[3].value;

    return option;
}