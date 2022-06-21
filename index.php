<body>
    <?php include 'header.php' ?>
    <div id="content-container">

        <div id="info-container" onclick="toggleInfoContainer(0, true)">
            <div id="info-container__inner" onclick="event.stopPropagation()">
                <!-- <button onclick="toggleInfoContainer(1,true)">Button</button> -->
                <div id="info-about" class="info-page">
                    <h1 class="center-text">Hi,</h1>
                    <ul id="about-list">
                        <li>
                            <h4>This website serves the purpose of being a diary for all the shows you have watched.</h4>
                        </li>
                        <li>
                            <h4>You can import and export csv lists and modify them. (Format limitations apply*)</h4>
                        </li>
                        <li>
                            <h4>Currently you can import Netflix history, add, remove, modify entries, and export them.</h4>
                        </li>
                        <li>
                            <h4>If you have a mixed list of shows you have watched, this website will organize them into "groups" based on show name. (Check <label class="link" onclick="toggleInfoContainer(1)">file format</label> for more info).</h4>
                        </li>
                        <li>
                            <h4>Cookie is used to store the list of entries for the next time you visit the site.</h4>
                        </li>
                        <li>
                            <h4>Netflix format does not support like/dislike tag, but this website will allow you to merge both of them together (Netflix like import coming soon).</h4>
                        </li>
                        <li>
                            <h4>Warning: It is not recommended to export netflix shows as comma, as the names of shows include commas.
                            </h4>
                        </li>
                        <li>
                            <h4>Movies rating button coming soon.
                            </h4>
                        </li>

                    </ul>
                </div>
                <div id="info-import" class="info-page">
                    <!-- <div id="info-import__inner"> -->
                    <div id="import-info" class="import-export-div">
                        <h1>Import</h1>
                        <!-- <h2>Supported formats</h2> -->
                        <div class="section">
                            <h3>Netflix format</h3>
                            <p class="center-text bold">(You can download your Netflix history from <a target="_blank" href="https://www.netflix.com/viewingactivity">
                                    https://www.netflix.com/viewingactivity</a>)</p>

                            <h4>It should work for most records, however mistakes can happen since Netflix is not consistent with their naming.</h4>
                            <p>Note: Any mistakes can be corrected manually. </p>
                            <p>Note: Entries with one comma and no colon will be added into "Movie" group.</p>
                        </div>
                        <div class="section">

                            <h3>Custom character format</h3>
                            <ul id="import-list2">
                                <li>
                                    Default splitting character is (,) unless changed. </li>

                                <li>
                                    Empty spaces and colon at the front/end of a field will be auto removed. </li>
                                <li>
                                    Currently supports 5 fields in the following format: </li>
                                <li>
                                    Show name, episode name, seasons, date (in format dd/mm/yyyy), rating</li>
                                <li>
                                    Using different date format will work but sorting won't work, rating can be omitted.</li>

                            </ul>



                        </div>
                    </div>
                    <div id="export-info" class="import-export-div">
                        <h1>Export</h1>
                        <ul id="export-list1">
                            <li>
                                Netflix format: Exports using Netflix format, does not support rating (like/dislike)</li>

                            <li>
                                Custom format: Exports using custom character.</li>

                            <li>
                                Tip: If you want to export Netflix records using custom format don't use comma as it might be included in a name)</li>
                            <li>
                                Export format: Show name, episode name, seasons, date, like/dislike</li>
                        </ul>
                    </div>
                    <!-- </div> -->
                </div>

            </div>
        </div>


        <div id="tools-container" onclick="toggleToolsContainer(0,true)">
            <div id="tools-container__inner" onclick="event.stopPropagation()">

                <div id="file-container" class="tool-page">
                    <h3>Import/Export:</h3>
                    <div id="file-settings">
                        <h4>File format:
                            <div id="help-button" onclick="toggleInfoContainer(1)">?</div>
                        </h4>

                        <input type="radio" id="option-netflix" name="option" value="netflix" checked>
                        <label for="option-netflix">Netflix</label>
                        <input type="radio" id="option-comma" name="option" value=",">
                        <label for="option-comma">comma (,)</label>
                        <input type="radio" id="option-other" name="option" value="other">
                        <label for="option-other">Other
                            <input type="text" id="custom-import" name="option" value="\" maxlength="1">
                        </label>
                    </div>

                    <div id="file-container__buttons">
                        <input type="file" id="add-file-button" name="the_file">
                        <label for="add-file-button" class="file-buttons button-style">Add file</label>

                        <label class="file-buttons button-style" onclick="getFileInfo()">Import!</label>
                        <p id="import-error" class="error">*No file selected</p>

                        <label class="file-buttons button-style" onclick="exportCSV()">Export!</label>
                        <p id="export-error" class="error">*Nothing to export</p>
                        <a id="export-download" href="#" download>Download</a>

                    </div>


                </div>

                <div id="add-form" class="tool-page">
                    <form>
                        <h3>Add new Entry</h3>
                        <input type="text" placeholder="Title" onkeyup="searchList(this.value)" required>
                        <input type="text" placeholder="Episode name" required>
                        <input type="text" placeholder="Season name" required>
                        <input type="text" required>
                        <label class="button-style extra-button-style1" onclick="addEntry()">Add</label>
                        <label class="button-style extra-button-style1" onclick="toggleToolsContainer(0,true)">Close</label>
                    </form>
                </div>

                <div id="merge-form" class="tool-page">
                    <h3>Select parent group</h3>
                </div>

                <div id="import-likes-form" class="tool-page">
                    <h3>Warning importing at your own risk!</h3>
                    <!-- <p>In order to import Netlfix likes follow the steps below: </p> -->
                    <ul>
                        <li>
                            Before you attempt this, import your history from Netflix.
                        </li>
                        <li>
                            Go to <a target="_blank" href="https://www.netflix.com/viewingactivity">Netflix history</a> and click on "Rating" (Top right corner).
                        </li>
                        <li>
                            Scroll to the bottom and keep pressing "Show more" until it no longer displays new result.
                        </li>
                        <li>
                            Right click anywhere on the page and click "inspect", then find console tab.
                        </li>
                        <li>
                            Paste the code below and press enter: (Disclaimer: The code below outputs a list of shows and likes, paste at your own risk);

                        </li>
                        <li>
                            Copy the returned text and paste it below, the text should be in a format [show name][::][number 1-3][:::]... and so on, ending with [:::];
                        </li>
                    </ul>
                    <div id="copy-code">
                        <p>columns = document.getElementsByClassName("retableRow");
                            let likes = "";for (let i = 0; i < columns.length; i++) { let title=columns[i].getElementsByClassName("title")[0].firstChild.innerHTML; let buttons=columns[i].getElementsByClassName("rating")[0].firstElementChild.getElementsByTagName("button"); for (let b=0; b < buttons.length; b++) { let label=buttons[b].getAttribute("arialabel"); if (label.length> 20)
                                {likes += title + "::" + (b + 1) + ":::";
                                break;
                                }}};
                                console.log(likes); </p>
                    </div>
                    <!-- <label class="button-style">Copy text</label> -->

                    <textarea id="like-text" placeholder="Paste text returned in step 6"></textarea>
                    <label id="submit-code-button" class="button-style" onclick="getLikes()">Submit</label>


                </div>



            </div>

            <!-- <div class="form-div">
                <h3>Import rating from Netflix</h3>
                <h4 class="center-text">Coming soon! </h4>
            </div> -->


        </div>



        <!-- <div id="browser"> -->

        <label class="button-style  menu-buttons" onclick="toggleInfoContainer(0)">About</label>
        <label class="button-style  menu-buttons" onclick="toggleToolsContainer(0)">Import/Export</label>
        <label class="button-style  menu-buttons" onclick="toggleToolsContainer(3)">Import Netflix Likes</label>

        <div id="watched-stats">
            <h3>Stats</h3>
            <table>
                <tr>
                    <td>
                        <h4>Total series:</h4>
                    </td>
                    <td>
                        <h4>0</h4>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h4>Total episodes:</h4>
                    </td>
                    <td>
                        <h4>0</h4>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h4>Total movies:</h4>
                    </td>
                    <td>
                        <h4>0</h4>
                    </td>
                </tr>
            </table>
        </div>


        <div id="search-list">
            <!-- <p>Check if title is on the list.</p> -->
            <input type="text" onkeyup="searchList(this.value)" placeholder="Search show name">
            <p>*Currently supports only title search</p>
        </div>

        <div id="toolbar">

            <label class="button-style toolbar-buttons" onclick='showAll()'>Show All</label>
            <label class="button-style toolbar-buttons" onclick='hideAll()'>Hide All</label>
            <label class="button-style toolbar-buttons" onclick='sortEpisodes()'>Sort</label>
            <label id="open-entry-form" class="button-style toolbar-buttons" onclick='toggleToolsContainer(1)'>Add new</label>
            <label id="merge-button" class="button-style toolbar-buttons" onclick="toggleToolsContainer(2)">Merge</label>
            <label class="button-style toolbar-buttons" onclick="moveEpisodes()">Move episodes</label>
            <label class="button-style toolbar-buttons" onclick="removeFromList()">Remove</label>
            <label class="button-style toolbar-buttons" style="float:right;" onclick="completeReset()" ;>Reset</label>


        </div>
        <div id="edit-toggle">
            <p>Click to open/close | Double click to modify.</p>
        </div>

        <table id="big-list">
            <tbody>
                <tr>
                    <th>
                        <h4></h4>
                    </th>
                    <th>
                        <h4 class="main-desc">Show title</h4>
                        <h4 class="alt-desc">Show Information</h4>
                    </th>
                    <th class="main-desc">
                        <h4>Episodes watched</h4>
                    </th>
                    <th class="main-desc">
                        <h4>Last Watched</h4>
                    </th>
                    <th class="main-desc">
                        <!-- <div class="main-desc" id="like-legend-div"> -->
                        <!-- <img src="icons/like-green.png" alt="">
                            <img src="icons/dislike-red.png" alt=""> -->
                        <!-- </div> -->
                        <h4>Rating</h4>
                    </th>
                    <th class="main-desc">
                        <img class="main-desc" id="check-legend" src="icons/check.png" alt="Check box">
                    </th>
                </tr>
            </tbody>
        </table>

        <div id="raw">
            <?php include "export.php"; ?>
        </div>
        <script src="javascript.js"></script>
        <script src="ajax.js"></script>
        <script src="cookies.js"></script>
        <!-- </div> -->
</body>





</html>