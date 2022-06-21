window.addEventListener("load", function () {
    getListFromStorage();
});

//JS table data to display
let seasonListContainer = document.getElementById("big-list");

let checkedSeason = [];
let checkedEpisodes = [];
let copies = [];

//PHP data
//Checks php returned data and checks each entry
function checkRawList() {
    let table = document.getElementById("raw");
    let unfilteredList = table.getElementsByTagName("tr");

    for (let i = 1; i < unfilteredList.length; i++) { //length -1 since php returns extra redundant record 
        let elements = unfilteredList[i].getElementsByTagName("td");

        let showName = elements[1].innerHTML;
        let episodeName = elements[2].innerHTML;
        let season = elements[3].innerHTML;
        let date = elements[4].innerHTML;
        let rating = elements[5].innerHTML;

        checkForGroup(showName, episodeName, season, date, rating);

        if (i == unfilteredList.length - 1) {
            sortEpisodes();
            table.getElementsByTagName("table")[0].remove();
        }
    }

    saveListToStorage();
    checkStats();
    console.log("copies: " + copies);
}

// Check if group exists
function checkForGroup(showName, episodeName, season, dateWatched, rating) {
    let groups = seasonListContainer.getElementsByClassName("group");

    //if there is no groups at all, it creates a new one.
    if (groups.length == 0) {
        createNewGroup(showName, episodeName, season, dateWatched, rating);
        if (showName == "Movie") {
            console.log("hmm");
        }

    } else {
        //If groups exist... Check if they match.
        for (let i = 0; i < groups.length; i++) {
            let groupName = groups[i].getElementsByTagName("th")[1].firstChild.innerHTML;
            if (groupName.toUpperCase() == showName.toUpperCase()) {
                let isEpisodeExisting = false;

                //If group exist, check if current episode is in the list
                let groupEpisodes = groups[i].getElementsByTagName("tr");
                for (let e = 1; e < groupEpisodes.length; e++) {
                    //Setting up key values
                    let existingEpiName = groupEpisodes[e].getElementsByTagName("td")[1].firstElementChild.innerHTML;
                    let existingEpiSeason = groupEpisodes[e].getElementsByTagName("td")[2].firstElementChild.innerHTML;

                    //Compares names, if this entry exist, break otherwise continue;
                    if (existingEpiName.toUpperCase() == episodeName.toUpperCase()) {
                        if (existingEpiSeason.toUpperCase() == season.toUpperCase()) {
                            isEpisodeExisting = true;
                            break;
                        } else continue;
                    }
                }

                //if episode exist break, otherwise add new episode.
                if (!isEpisodeExisting) {
                    let group = groups[i];
                    addToEpiTable(group, 0, episodeName, season, dateWatched)
                    break;
                } else {
                    copies.push(episodeName);
                    break;
                }

                //If a matching group has not been found, create a new one, otherwise keep going.
            } else if (i == groups.length - 1) {

                if (showName == "Movie") {
                    console.log("hmm");
                }
                createNewGroup(showName, episodeName, season, dateWatched, rating)
                break;

            } else continue;
        }
    }
}

// Used to create new group for a show.
function createNewGroup(seasonName, episodeName, season, dateWatched, rating) {
    //creating new group container
    let groupDiv = document.createElement("tbody");
    groupDiv.classList.add("group");

    let groupTr = document.createElement("tr");
    let showTh = document.createElement("th");

    //Creates arrow indicator for group.
    let expandDivContainer = document.createElement("div");
    expandDivContainer.classList.add("expand-div-container");
    let expandArrow = document.createElement("div");
    expandArrow.classList.add("arrow", "right");

    //Opens up group episode list, and changes group open arrow indicator. (parent)
    showTh.addEventListener("click", function (e) {
        let episodes = showTh.parentElement.parentElement.getElementsByTagName("tr");
        //Closes group episodes preview.
        if (episodes[1].style.display == "table-row") {
            for (let e = 1; e < episodes.length; e++) {
                episodes[e].style.display = "none"; // Css normally close
            }
            expandDivContainer.firstChild.classList.remove("down");
            expandDivContainer.firstChild.classList.add("right");

            //Opens group episodes preview.
        } else {
            for (let e = 1; e < episodes.length; e++) {
                episodes[e].style.display = "table-row"; // Css normally close
            }
            expandDivContainer.firstChild.classList.remove("right");
            expandDivContainer.firstChild.classList.add("down");
        }
    });

    expandDivContainer.appendChild(expandArrow);
    showTh.appendChild(expandDivContainer);
    groupTr.appendChild(showTh)

    //Setting up summary information for the group (parent)
    for (let i = 0; i < 5; i++) {
        let th = document.createElement("th");
        let h3 = document.createElement("h3");

        if (i < 3) {
            th.appendChild(h3); //only 3/4 list element contain h3 element.

            //Adds event for option to change description and tick the checkbox.
            th.addEventListener("dblclick", function (e) {
                changeDescription(this);
                e.stopPropagation();
            });

            //Adds event for showing and hidding episodes
            th.addEventListener("click", function (e) {
                // checkBox(this);

                //show/hide group
                this.parentElement.firstElementChild.click();
                e.stopPropagation();
            });

        }

        if (i == 0) h3.innerHTML = seasonName;
        else if (i == 1) h3.innerHTML = "0"; //eisode counter
        else if (i == 2) h3.innerHTML = "Last watched"; // last watched date
        else if (i == 3) {

            let likeDislikeImg = document.createElement("img");
            likeDislikeImg.setAttribute("data", rating)

            //Image for displaying like status.
            let url;
            if (rating == "liked") url = "icons/like-green.png";
            else if (rating == "disliked") url = "icons/dislike-red.png";
            else url = "icons/like.png";

            likeDislikeImg.setAttribute("src", url);
            th.appendChild(likeDislikeImg);

            //Changes status of "like button".
            th.addEventListener("click", function (e) {
                ratingSwitch(likeDislikeImg);
                e.stopPropagation();
            });

        } else if (i == 4) {

            //Adding checkbox (parent)
            let checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            //Adds checkbox to a listed of checked boxes.
            checkbox.addEventListener("click", function (e) {
                addToChecked(this.parentElement.parentElement.parentElement, checkbox.checked, checkedSeason);
                console.log("checked");
                e.stopPropagation();
            })

            th.appendChild(checkbox);
        }
        groupTr.appendChild(th)
    }
    groupDiv.appendChild(groupTr); //Season description

    seasonListContainer.appendChild(groupDiv);
    //Adding episode to container
    addToEpiTable(groupDiv, 0, episodeName, season, dateWatched); //Adding episode
    seasonListContainer.appendChild(groupDiv);

}

//Adds tr and td elements to a table element
function addToEpiTable(table, elementNo, episodeName, season, dateWatched, rating) {

    //creating dom elements
    let tr = document.createElement("tr");
    tr.appendChild(createTd(elementNo, false, true))
    tr.appendChild(createTd(episodeName))
    tr.appendChild(createTd(season))
    tr.appendChild(createTd(dateWatched))

    let td = document.createElement("td");
    td.setAttribute("colspan", 2)

    td.addEventListener("click", function (e) {
        checkBox(this);
        e.stopPropagation();
    });

    let checkingBox = document.createElement("input");
    checkingBox.setAttribute("type", "checkbox");

    //adds even to track the checkbox element. (Child)
    checkingBox.addEventListener("click", function (e) {
        addToChecked(this.parentElement.parentElement, checkingBox.checked, checkedEpisodes);
        e.stopPropagation();
        console.log(checkedEpisodes.length)
    })
    td.appendChild(checkingBox)

    tr.appendChild(td);
    // table.appendChild(tr);

    table.appendChild(tr)
}


//Helper main function

//helper function, creates td for table and adds events for edit and checkbox.
function createTd(text, changeDescEvent = true, checkBoxEvent = true) {
    let tdName = document.createElement("td");
    let h3Element = document.createElement("h3");
    //(Child)
    h3Element.innerHTML = text;

    if (changeDescEvent) {
        tdName.addEventListener("dblclick", function (e) {
            changeDescription(this);
            e.stopPropagation();
        })
    }

    if (checkBoxEvent) {
        tdName.addEventListener("click", function (e) {
            checkBox(this);
            e.stopPropagation();
        })
    }

    tdName.appendChild(h3Element);
    return tdName;
}

// Toggle for tool and info container
function toggleInfoContainer(page = 0, isClosed = false) {
    let infoContainer = document.getElementById("info-container");
    let infoPages = document.getElementsByClassName("info-page");

    //checking whether infoContainer should be closed or open;
    if (isClosed) {
        infoContainer.style.display = "none";
        return;
    } else infoContainer.style.display = "block";

    for (let i = 0; i < infoPages.length; i++) {
        if (page == i) infoPages[i].style.display = "block";
        else infoPages[i].style.display = "none";
    }


}

function toggleToolsContainer(tool, isClosed = false) {
    let toolContainer = document.getElementById("tools-container");
    let toolPages = document.getElementsByClassName("tool-page")

    if (isClosed) {
        toolContainer.style.display = "none";
        document.getElementById("open-entry-form").classList.remove("active"); // clears button highlight
        document.getElementById("merge-button").classList.remove("active"); // clears button highlight
        return;
    } toolContainer.style.display = "block";


    for (let i = 0; i < toolPages.length; i++) {
        if (tool == i) {
            if (tool == 0) toolPages[i].style.display = "block"; //import page
            else if (tool == 1) {
                //Add form
                toolPages[1].style.display = "block";
                let formButton = document.getElementById("open-entry-form");
                formButton.classList.add("active");
                let form = document.getElementById("add-form");
                n = new Date();
                y = n.getFullYear();
                m = n.getMonth() + 1;
                d = n.getDate();
                form.getElementsByTagName("input")[3].value = d + "/" + m + "/" + y; //Today's date


            } else if (tool == 2) {
                if (mergeSelected()) {
                    toolPages[2].style.display = "block";
                } else toolContainer.style.display = "none";
            } else if (tool == 3) toolPages[3].style.display = "block";

        } else toolPages[i].style.display = "none";

    }


}




//Toolbox functions --------------------------------------

//Sorts specific or all group episodes by comparing its date and adds order numbering.
function sortEpisodes(group = undefined) {
    let groups;
    if (group == undefined) groups = document.getElementsByClassName("group");
    else groups = [group];

    if (groups.length == 0) {
        checkStats();
        return;

    }

    for (let g = 0; g < groups.length; g++) {
        //get episodes
        let episodes = groups[g].getElementsByTagName("tr"); //gets tr of a table to check episode
        let table = groups[g];
        let dateArray = [];
        let episodeOrder = [];


        //resets numbering
        for (let i = 1; i < episodes.length; i++) {
            episodes[i].firstElementChild.firstElementChild.innerHTML = 0;
        }

        //check each episode and add its date in ms to array
        for (let e = 1; e < episodes.length; e++) {

            let stringDate = episodes[e].getElementsByTagName("td")[3].firstElementChild.innerHTML;

            //convers date ms
            let dateParts = stringDate.split("/");
            let date = Date.parse(dateParts[2] + "," + dateParts[1] + "," + dateParts[0]);

            dateArray.push(date);
        }

        //sorts array content
        dateArray.sort(function (a, b) {
            if (a - b < 0) return 1;
            else if (a - b > 0) return -1;
            else return 0;
        });

        //checkes each episode date against dateArray order and assigns order number to it.
        for (let e = 1; e < episodes.length; e++) {

            let stringDate = episodes[e].getElementsByTagName("td")[3].firstElementChild;
            let order = episodes[e].getElementsByTagName("td")[0].firstElementChild;
            //convers date to ms
            let dateParts = stringDate.innerHTML.split("/");
            let date = Date.parse(dateParts[2] + "," + dateParts[1] + "," + dateParts[0]);

            for (let d = 0; d < dateArray.length; d++) {

                if (date == dateArray[d]) {
                    order.innerHTML = episodes.length - d - 1;
                    episodeOrder[d] = episodes[e];
                    dateArray[d] = 0;
                    break;
                }
            }
        }

        for (let e = 0; e < episodeOrder.length; e++) {
            table.appendChild(episodeOrder[e]);

        }

        //Updates group description with the most recent date watched.
        let lastWatched = episodeOrder[0].getElementsByTagName("td")[3].firstElementChild.innerHTML; //h3 element (not)
        // updateSeriesInfo(groups[g], episodes.length, lastWatched);
        groups[g].getElementsByTagName("th")[2].firstElementChild.innerHTML = episodes.length - 1;
        groups[g].getElementsByTagName("th")[3].firstElementChild.innerHTML = lastWatched;
    }
    sortGroups();
    checkStats();

}

//Sorts groups by date and re-adds them in order.
function sortGroups() {
    let groups = document.getElementsByClassName("group");
    let dateArray = [];
    let groupsOrder = [groups.length];

    for (let g = 0; g < groups.length; g++) {
        let stringDate = groups[g].firstElementChild.getElementsByTagName("th")[3].firstElementChild.innerHTML;

        //converts date to ms
        let dateParts = stringDate.split("/");
        let date = Date.parse(dateParts[2] + "," + dateParts[1] + "," + dateParts[0]);

        dateArray.push(date);
    }

    dateArray.sort(function (a, b) {
        if (a - b < 0) return 1;
        else if (a - b > 0) return -1;
        else return 0;
    });

    //checks each episode date against dateArray order and assigns order number to it.
    for (let g = 0; g < groups.length; g++) {

        let stringDate = groups[g].firstElementChild.getElementsByTagName("th")[3].firstElementChild.innerHTML;

        //converts date to ms
        let dateParts = stringDate.split("/");
        let date = Date.parse(dateParts[2] + "," + dateParts[1] + "," + dateParts[0]);

        for (let d = 0; d < dateArray.length; d++) {

            if (date == dateArray[d]) {
                groupsOrder[d] = groups[g];
                dateArray[d] = 0;
                break;
            }

        }
    }

    //Re-adds existing groups in order based on recent date.
    for (let g = 0; g < groupsOrder.length; g++) {
        seasonListContainer.appendChild(groupsOrder[g]);

    }
}

//Expands all groups
function showAll() {
    let groups = document.getElementsByClassName("group");
    for (let i = 0; i < groups.length; i++) {
        let episodes = groups[i].getElementsByTagName("tr");
        for (let e = 1; e < episodes.length; e++) {
            episodes[e].style.display = "table-row";
        }
    }
}

// Collapses all groups 
function hideAll() {
    let groups = document.getElementsByClassName("group");
    for (let i = 0; i < groups.length; i++) {
        let episodes = groups[i].getElementsByTagName("tr");
        for (let e = 1; e < episodes.length; e++) {
            episodes[e].style.display = "none";
        }
    }
}

//Adds entry after user have filled up the "add new show" form.
function addEntry() {
    let form = document.getElementById("add-form");
    let inputs = form.getElementsByTagName("input");

    if (inputs[1].validity.valueMissing || inputs[2].validity.valueMissing || inputs[3].validity.valueMissing) {
        alert("You need to fill all the fields!");
        return;
    }

    let title = inputs[0].value;
    let episodeName = inputs[1].value;
    let season = inputs[2].value;
    let date = inputs[3].value;

    checkForGroup(title, episodeName, season, date);
    toggleToolsContainer(0, true); //closes window
    searchList(""); //resets search
    // form.getElementsByTagName("form").reset();
    inputs[0].value = "";
    inputs[1].value = "";
    inputs[2].value = "";
    document.getElementById("open-entry-form").classList.remove("active")
    alert("Entry added!");
    saveListToStorage();
}

//Checks all the groups and updates stats tab
function checkStats() {
    let groups = document.getElementsByClassName("group");

    let totalSeries = 0;
    let totalEpisodes = 0;
    let totalMovies = 0;

    for (let i = 0; i < groups.length; i++) {
        let info = groups[i].getElementsByTagName("th");

        //Check for movies
        if (info[1].firstElementChild.innerHTML == "Movies") {
            totalMovies = info[2].firstElementChild.innerHTML;
            continue;
        } else {
            totalSeries++;
            totalEpisodes += parseInt(info[2].firstElementChild.innerHTML);
        }
    }

    statsDiv = document.getElementById("watched-stats");
    stats = statsDiv.getElementsByTagName("tr");

    stats[0].lastElementChild.firstElementChild.innerHTML = totalSeries;
    stats[1].lastElementChild.firstElementChild.innerHTML = totalEpisodes;
    stats[2].lastElementChild.firstElementChild.innerHTML = totalMovies;

    console.log("Total Series: " + totalSeries + " Total Episodes: " + totalEpisodes + " Total movies: " + totalMovies);
}

//Merge option, toggles button indicator, and displays merge options.
function mergeSelected() {
    if (checkedSeason.length < 2) {
        alert("Select 2 or more to merge");
        return false; //error status
    }

    let button = document.getElementById("merge-button");
    let chooseParentDiv = document.getElementById("merge-form");
    //open setting
    button.classList.add("active");

    //clears previous form form
    while (chooseParentDiv.childElementCount > 1) {
        chooseParentDiv.lastElementChild.remove();
    }

    //Creates options based on selected groups
    for (let i = 0; i < checkedSeason.length; i++) {

        //Finds group name
        let groupH3 = checkedSeason[i].firstElementChild.getElementsByTagName("h3");
        let groupName = groupH3[0].innerHTML;

        //Created checkboxes
        let option = document.createElement("div"); //parent div for each checkbox input.

        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "radio");
        checkbox.setAttribute("name", "parent");

        let label = document.createElement("label")
        label.innerHTML = groupName;

        option.appendChild(checkbox);
        option.appendChild(label);
        chooseParentDiv.appendChild(option);
    }

    //Creates submit button and adds event to it.
    let submit = document.createElement("label");
    submit.classList.add("button-style", "extra-button-style-1", "merging-container__buttons");
    submit.innerHTML = "Add";
    submit.addEventListener("click", function () {
        let inputs = document.getElementById("merge-form").getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].checked) {
                mergeIntoParent(i) //actual merging function
                toggleToolsContainer(0, true); //closes the window
                break;
            }
        }
        document.getElementById("merge-button").classList.remove("active"); // Removes button highligh
    })

    //Creates close button and adds event to it.
    let cancelButton = document.createElement("label");
    cancelButton.classList.add("button-style", "extra-button-style-1", "merging-container__buttons");
    cancelButton.innerHTML = "Close";
    cancelButton.addEventListener("click", function () {
        toggleToolsContainer(0, true)
    })

    //Creates container for buttons 
    let div = document.createElement("div");
    div.classList.add("merge-button-div");

    div.appendChild(submit);
    div.appendChild(cancelButton);
    chooseParentDiv.appendChild(div);
    saveListToStorage(); // Saves new list to local storage.
    return true; //error status
}

//Merges the selected groups to the parent group.
function mergeIntoParent(parent) {
    let table = checkedSeason[parent];

    for (let i = 0; i < checkedSeason.length; i++) {
        if (checkedSeason[i] == checkedSeason[parent]) continue;

        let episodes = checkedSeason[i].getElementsByTagName("tr");

        for (let e = 1; e < episodes.length; e++) {

            //gets episode info
            let h3 = episodes[e].getElementsByTagName("h3");
            let epiName = h3[1].innerHTML;
            let epiSeason = h3[2].innerHTML;
            let epiWatched = h3[3].innerHTML;

            addToEpiTable(table, 0, epiName, epiSeason, epiWatched);
        }

        //removes group
        seasonListContainer.removeChild(checkedSeason[i]);
        sortEpisodes(checkedSeason[parent]); //Reorders episodes
    }

    resetCheckboxes();
    saveListToStorage();
}

//Removes checked groups/episodes from the list
function removeFromList() {
    for (let i = 0; i < checkedSeason.length; i++) {
        seasonListContainer.removeChild(checkedSeason[i]);
    }

    for (let i = 0; i < checkedEpisodes.length; i++) {
        checkedEpisodes[i].parentElement.removeChild(checkedEpisodes[i]);
    }

    resetCheckboxes();
    saveListToStorage();
}

//Moves episodes between parent.
function moveEpisodes() {
    if (checkedSeason.length == 1 && checkedEpisodes.length > 0) {

        let table = checkedSeason[0];

        for (let i = 0; i < checkedEpisodes.length; i++) {
            let clone = checkedEpisodes[i].cloneNode(true);
            clone.getElementsByTagName("input")[0].checked = false;

            //Re-adding events
            let tdElements = clone.getElementsByTagName("td");
            for (let e = 0; e < tdElements.length; e++) {
                //(Child)

                tdElements[e].addEventListener("click", function (e) {
                    checkBox(this);
                    e.stopPropagation();
                })

                if (e == 0 || e == tdElements.length - 1) continue; //Order number and tick box does not need to be changed
                tdElements[e].addEventListener("dblclick", function (e) {
                    changeDescription(this);
                    e.stopPropagation();
                })
            }

            //Adding event to checkbox
            let checkingBox = clone.getElementsByTagName("input")[0]
            checkingBox.addEventListener("click", function (e) {
                addToChecked(this.parentElement.parentElement, checkingBox.checked, checkedEpisodes);
                e.stopPropagation();
                console.log(checkedEpisodes.length)
            })

            table.appendChild(clone);

            //Checking if its the last item in a group
            if (checkedEpisodes[i].parentElement.getElementsByTagName("tr").length == 2) {
                //Removing group
                checkedEpisodes[i].parentElement.parentElement.removeChild(checkedEpisodes[i].parentElement);
            } else checkedEpisodes[i].parentElement.removeChild(checkedEpisodes[i]); //remove just episode

        }


        sortEpisodes(checkedSeason[0]);
        resetCheckboxes();

        saveListToStorage();
    } else {
        alert("To move episodes, you need 1 group selected and 1 or more episodes");
    }


}

//Resets everything
function completeReset() {
    let reset = confirm("Resetting will remove the list from both local storage and active session. make sure you have exported your list. Do you want to continue?");

    if (reset) {
        let group = document.getElementsByClassName("group");
        for (let i = group.length - 1; i >= 0; i--) {
            seasonListContainer.removeChild(group[i]);
        }

        localStorage.clear();
        checkStats();
    }
}

//Search function for the input.
function searchList(filterValue) {
    let filter = filterValue.toUpperCase();

    let series = document.getElementsByClassName("group");
    for (let i = 0; i < series.length; i++) {
        let seriesName = series[i].getElementsByTagName("h3")[0].innerHTML.toUpperCase();;

        if (seriesName.indexOf(filter) > -1) {
            // console.log("yes")
            series[i].style.display = "table-row-group";
        } else {
            series[i].style.display = "none";
        }
    }
}






//Background helper functions

//Switches status of "like button";
function ratingSwitch(ratingButton, value) {
    // let label = ratingButton.firstElementChild;
    if (value) {
        //If changing a value to specific one
        if (value == "liked") {
            ratingButton.src = "icons/like-green.png";
            ratingButton.setAttribute("data", "liked");
        } else if (value == "disliked") {
            ratingButton.src = "icons/dislike-red.png";
            ratingButton.setAttribute("data", "disliked")
        } else if (value == "") {
            ratingButton.src = "icons/like.png";
            ratingButton.setAttribute("data", "")
        }
        return;
    }

    //Change value based on click, move up...
    if (ratingButton.attributes.src.value == "icons/like.png" || ratingButton.attributes.src.value == '') {
        ratingButton.src = "icons/like-green.png";
        ratingButton.setAttribute("data", "liked");
    } else if (ratingButton.attributes.src.value == "icons/like-green.png") {
        ratingButton.src = "icons/dislike-red.png";
        ratingButton.setAttribute("data", "disliked")
    } else if (ratingButton.attributes.src.value == "icons/dislike-red.png") {
        ratingButton.src = "icons/like.png";
        ratingButton.setAttribute("data", "")
    }
    saveListToStorage();
}

//Keeps track of checked records.
function addToChecked(element, isBoxChecked, checkedArray) {
    if (checkedArray.length == 0) checkedArray.push(element);
    else {
        for (let i = 0; i < checkedArray.length; i++) {
            if (element == checkedArray[i]) {
                if (!isBoxChecked) {
                    checkedArray.splice(i, 1);
                    break;
                }
            }
        }
        if (isBoxChecked) checkedArray.push(element);
        console.log(checkedArray)
    }
    // console.log(checkedArray.length);
}

// Resets all checkboxes
function resetCheckboxes() {
    let groups = document.getElementsByClassName("group");

    for (let i = 0; i < groups.length; i++) {
        groups[i].firstElementChild.getElementsByTagName("input")[0].checked = false;
    }
    checkedSeason.splice(0, checkedSeason.length);
    checkedEpisodes.splice(0, checkedEpisodes.length);
}

//Changes description of triggered fields.
function changeDescription(element) {
    let desc = element.firstElementChild.innerHTML;

    let newDesc = prompt("Enter new description", desc);
    if (newDesc != null) {
        element.firstElementChild.innerHTML = newDesc;
        saveListToStorage();
    }
}


//Looks for a checkbox and ticks/un-ticks it.
function checkBox(element) {
    let newElement = element;
    //Checks whether parent element contains input and triggers it.
    for (let i = 0; i < 10; i++) {
        let parent = newElement.parentElement;
        let hasInput = (parent.getElementsByTagName("input").length > 0);
        if (hasInput) {
            parent.getElementsByTagName("input")[0].click(); //Triggers addToChecked function
            break;

        } else {
            newElement = parent;
            continue;
        }
    }
}

//Toggle button for file format (?) info. 
function toggleFormatInfo() {
    info = document.getElementById("format-info");
    if (info.style.display == "none" || info.style.display == "") info.style.display = "block";
    else info.style.display = "none";
}

//Closes and resets button highlights for "new group" and "merge" form.
function closeToolbarSetting() {
    let addForm = document.getElementById("add-form");
    let addButton = document.getElementById("open-entry-form")

    let mergeSetting = document.getElementById("merge-form");
    let mergeButton = document.getElementById("merge-button")

    addForm.style.display = "none";
    addButton.classList.remove("active");
    mergeSetting.style.display = "none";
    mergeButton.classList.remove("active");
}

function getLikes(text = "") {
    let textBox = document.getElementById("like-text");
    if (text == 0) text = textBox.value;
    textBox.value = "";
    toggleToolsContainer(0, true);

    let groups = document.getElementsByClassName("group");
    let textParts = text.split(":::");

    //Goes through parts, splits them, and checks against series name whether one exists, then updates the result
    for (let p = 0; p < textParts.length; p++) {
        let nameRating = textParts[p].split("::")

        for (let i = 0; i < groups.length; i++) {
            let name = groups[i].getElementsByTagName("h3")[0].innerHTML;

            if (nameRating[0] == name) {
                let rating = nameRating[1] > 1 ? "liked" : "disliked";

                ratingSwitch(groups[i].getElementsByTagName("img")[0], rating);
                textParts.splice(p, 1);
                p--;
            }
        }
    }

    saveListToStorage();







    //     let columns = document.getElementsByClassName("retableRow");
    //     let likes = "";
    //     for (let i = 0; i < columns.length; i++) {
    //         let title = columns[i].getElementsByClassName("title")[0].firstChild.innerHTML;
    //         let buttons = columns[i].getElementsByClassName("rating")[0].firstElementChild.getElementsByTagName("button");
    //         for (let b = 0; b < buttons.length; b++) {
    //             let label = buttons[b].getAttribute("arialabel");
    //             if (label.length > 20) {
    //                likes += title + "::" + (b + 1) + ":::";
    //                 break;
    //             }
    //         };
    //     };
    // console.log(likes);
}

