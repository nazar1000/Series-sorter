
function saveListToStorage() {

    //clears storage
    localStorage.removeItem("seriesList");
    // return;

    let data = [];

    let groups = document.getElementsByClassName("group");
    if (groups.length > 0) {
        document.getElementById("export-error").style.display = "none";

        for (let i = 0; i < groups.length; i++) {
            let seriesName = groups[i].getElementsByTagName("h3")[0].innerHTML;
            let rating = groups[i].getElementsByTagName("img")[0].getAttribute("data");
            let episodes = groups[i].getElementsByTagName("tr");


            for (let e = 1; e < episodes.length; e++) {
                let episodeName = episodes[e].getElementsByTagName("h3")[1].innerHTML;
                let season = episodes[e].getElementsByTagName("h3")[2].innerHTML;
                let date = episodes[e].getElementsByTagName("h3")[3].innerHTML;


                data.push([seriesName, episodeName, season, date, rating]);
            }
        }
    }

    if (data.length > 0) {
        var json_str = JSON.stringify(data);
        localStorage.setItem("seriesList", json_str)
    }

}

function getListFromStorage() {
    if (localStorage.getItem("seriesList") == null) return;
    var json_str = localStorage.getItem('seriesList');
    var data = JSON.parse(json_str);

    for (let i = 0; i < data.length; i++) {
        let title = data[i][0];
        let episodeName = data[i][1];
        let season = data[i][2];
        let date = data[i][3];
        let rating = data[i][4];

        checkForGroup(title, episodeName, season, date, rating);
    }

    sortEpisodes();
    // checkStats();
}


// function deleteAllCookies() {
//     var cookies = document.cookie.split(";");

//     for (var i = 0; i < cookies.length; i++) {
//         var cookie = cookies[i];
//         var eqPos = cookie.indexOf("=");
//         var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//         document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
//     }
// }

// function createCookie(name, value, days) {
//     var expires;
//     if (days) {
//         var date = new Date();
//         date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//         expires = "; expires=" + date.toGMTString();
//     }
//     else {
//         expires = "";
//     }
//     document.cookie = name + "=" + value + expires + "; path=/";
// }

// function getCookie(c_name) {
//     if (document.cookie.length > 0) {
//         c_start = document.cookie.indexOf(c_name + "=");
//         if (c_start != -1) {
//             c_start = c_start + c_name.length + 1;
//             c_end = document.cookie.indexOf(";", c_start);
//             if (c_end == -1) {
//                 c_end = document.cookie.length;
//             }
//             return unescape(document.cookie.substring(c_start, c_end));
//         }
//     }
//     return "";
// }