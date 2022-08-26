let collectionElement = document.getElementById("collection");
let headerElement = document.getElementById("header-main");
let loaderElement = document.getElementById("loader");
let errorElement = document.getElementById("error");

//Values used to set up the header
let playthroughCount = 0;
let collectionCount = 0;

let gameCount = 0;
let dlcCount = 0;
let filmCount = 0;
let seriesCount = 0;
let bookCount = 0;
let albumCount = 0;

let totalTrophies = [0, 0, 0, 0];
let totalGamerscore = 0;
let totalAchievements = 0;
let totalTime = [0, 0, 0];

//Search variable setup
let baseAPIURL = "https://sheetlabs.com/W751/Collection"
let searchURL = baseAPIURL;

let filterCategory = "";
let filterType = "";
let searchType = "";
let searchValue = "";
let orderType = "";

Load();

//Initial load
function Load() {
    //Resets all the variables before loading
    LoadedState(true);
    ClearInfo();

    //Checks the search URL parameters to create the final URL
    BuildURL();

    //Gets the url and searches the array
    $.ajax({
        url: searchURL,
        crossDomain: true,
    })
        .done(function (data) {
            if (data.length == 0) {
                console.log("No results found");
                SetErrorDisplay();
                return;
            }

            ResetVariables();

            $.each(data, function (key, value) {
                console.log(value.title);
                CreateItem(value);
            });

            HeaderSetup();

            loaderElement.style.display = "none";
            headerElement.style.display = "block";
            collectionElement.style.display = "block";
            errorElement.style.display = "none";
        })
        .fail(function () {
            console.log("Failed");
            SetErrorDisplay();
        });
}

//Creates the search parameter for the URL
function BuildURL() {
    searchURL = baseAPIURL;
    let firstElement = true;
    searchURL += "?";

    if (filterCategory != "" || filterType != "") {
        if (filterCategory != "") {
            searchURL += (filterCategory + "=1");
            firstElement = false;
        }

        if (filterType != "") {
            if (!firstElement) {
                searchURL += "&";
            }
            searchURL += ("internaltype=" + filterType);
            firstElement = false;
        }
    }

    if (document.getElementById("onlyCollection").checked) {
        if (!firstElement) {
            searchURL += "&";
        }

        searchURL += "uniqueitem=1";
        firstElement = false;
    }

    if (document.getElementById("searchbar").value != "") {
        if (!firstElement) {
            searchURL += "&";
        }

        searchURL += document.getElementById("searchtype").value + "=" + document.getElementById("searchbar").value + "*";
        firstElement = false;
    }

    //Sets the order type
    if (!firstElement) {
        searchURL += "&";
    }
    searchURL += document.getElementById("sort").value;
}

function HeaderSetup() {
    let collectionText = document.createElement("h1");
    let collectionTextNode = document.createTextNode("Collection: " + collectionCount);
    //collectionText.style.marginTop = "0px";
    collectionText.appendChild(collectionTextNode);
    headerElement.appendChild(collectionText);

    if (playthroughCount != collectionCount) {
        let playthroughText = document.createElement("h2");
        let playthroughTextNode = document.createTextNode("Playthroughs: " + playthroughCount);
        playthroughText.appendChild(playthroughTextNode);
        headerElement.appendChild(playthroughText);
    }

    //Count display
    if (gameCount > 0) {
        let gameDisplay = document.createElement("h2");
        gameCountNode = document.createTextNode(gameCount);
        gameDisplay.classList.add("counter");
        let gameIcon = document.createElement("img");
        gameIcon.src = "icons/game.svg";
        gameIcon.classList.add("icon-intext");
        gameIcon.style.marginRight = "0.25em";
        gameDisplay.appendChild(gameIcon);
        gameDisplay.appendChild(gameCountNode);
        headerElement.appendChild(gameDisplay);
    }

    if (dlcCount > 0) {
        let dlcDisplay = document.createElement("h2");
        dlcCountNode = document.createTextNode(dlcCount);
        dlcDisplay.classList.add("counter");
        let dlcIcon = document.createElement("img");
        dlcIcon.src = "icons/dlc.svg";
        dlcIcon.classList.add("icon-intext");
        dlcIcon.style.marginRight = "0.25em";
        dlcDisplay.appendChild(dlcIcon);
        dlcDisplay.appendChild(dlcCountNode);
        headerElement.appendChild(dlcDisplay);
    }

    if (filmCount > 0) {
        let filmDisplay = document.createElement("h2");
        filmCountNode = document.createTextNode(filmCount);
        filmDisplay.classList.add("counter");
        let filmIcon = document.createElement("img");
        filmIcon.src = "icons/film.svg";
        filmIcon.classList.add("icon-intext");
        filmIcon.style.marginRight = "0.25em";
        filmDisplay.appendChild(filmIcon);
        filmDisplay.appendChild(filmCountNode);
        headerElement.appendChild(filmDisplay);
    }

    if (seriesCount > 0) {
        let seriesDisplay = document.createElement("h2");
        seriesCountNode = document.createTextNode(seriesCount);
        seriesDisplay.classList.add("counter");
        let seriesIcon = document.createElement("img");
        seriesIcon.src = "icons/series.svg";
        seriesIcon.classList.add("icon-intext");
        seriesIcon.style.marginRight = "0.25em";
        seriesDisplay.appendChild(seriesIcon);
        seriesDisplay.appendChild(seriesCountNode);
        headerElement.appendChild(seriesDisplay);
    }

    if (bookCount > 0) {
        let bookDisplay = document.createElement("h2");
        bookCountNode = document.createTextNode(bookCount);
        bookDisplay.classList.add("counter");
        let bookIcon = document.createElement("img");
        bookIcon.src = "icons/book.svg";
        bookIcon.classList.add("icon-intext");
        bookIcon.style.marginRight = "0.25em";
        bookDisplay.appendChild(bookIcon);
        bookDisplay.appendChild(bookCountNode);
        headerElement.appendChild(bookDisplay);
    }

    if (albumCount > 0) {
        let albumDisplay = document.createElement("h2");
        albumCountNode = document.createTextNode(albumCount);
        albumDisplay.classList.add("counter");
        let albumIcon = document.createElement("img");
        albumIcon.src = "icons/album.svg";
        albumIcon.classList.add("icon-intext");
        albumIcon.style.marginRight = "0.25em";
        albumDisplay.appendChild(albumIcon);
        albumDisplay.appendChild(albumCountNode);
        headerElement.appendChild(albumDisplay);
    }

    //Achievement display
    //Total trophies
    if (totalTrophies[0] + totalTrophies[1] + totalTrophies[2] + totalTrophies[3] > 0) {
        let trophyWrapper = document.createElement("div");
        trophyWrapper.classList.add("trophy-wrapper");
        trophyWrapper.classList.add("header-flex-wrapper");
        //platinum icon
        let platinumFig = document.createElement("figure");
        platinumFig.classList.add("trophy-figure");
        let platinumIcon = document.createElement("img");
        platinumIcon.classList.add("trophy-icon");
        platinumFig.appendChild(platinumIcon);
        if (totalTrophies[0] > 0) {
            platinumIcon.src = "icons/plat_filled.png";
            let platinumText = document.createElement("figcaption");
            let platTextNode = document.createTextNode(totalTrophies[0]);
            platinumText.classList.add("trophy-text");
            platinumText.classList.add("platinum");
            platinumText.appendChild(platTextNode);
            platinumFig.appendChild(platinumText);
        }
        else {
            platinumIcon.src = "icons/plat_outline.png";
        }
        trophyWrapper.appendChild(platinumFig);
        //Gold generation
        let goldFig = document.createElement("figure");
        goldFig.classList.add("trophy-figure");
        let goldIcon = document.createElement("img");
        goldIcon.classList.add("trophy-icon");
        goldFig.appendChild(goldIcon);
        if (totalTrophies[1] > 0) {
            goldIcon.src = "icons/gold_filled.png";
            let goldText = document.createElement("figcaption");
            let goldTextNode = document.createTextNode(totalTrophies[1]);
            goldText.classList.add("trophy-text");
            goldText.classList.add("gold");
            goldText.appendChild(goldTextNode);
            goldFig.appendChild(goldText);
        }
        else {
            goldIcon.src = "icons/gold_outline.png";
        }
        trophyWrapper.appendChild(goldFig);
        //Silver generation
        let silverFig = document.createElement("figure");
        silverFig.classList.add("trophy-figure");
        let silverIcon = document.createElement("img");
        silverIcon.classList.add("trophy-icon");
        silverFig.appendChild(silverIcon);
        if (totalTrophies[2] > 0) {
            silverIcon.src = "icons/silver_filled.png";
            let silverText = document.createElement("figcaption");
            let silverTextNode = document.createTextNode(totalTrophies[2]);
            silverText.classList.add("trophy-text");
            silverText.classList.add("silver");
            silverText.appendChild(silverTextNode);
            silverFig.appendChild(silverText);
        }
        else {
            silverIcon.src = "icons/silver_outline.png";
        }
        trophyWrapper.appendChild(silverFig);
        //Bronze generation
        let bronzeFig = document.createElement("figure");
        bronzeFig.classList.add("trophy-figure");
        let bronzeIcon = document.createElement("img");
        bronzeIcon.classList.add("trophy-icon");
        bronzeFig.appendChild(bronzeIcon);
        if (totalTrophies[3] > 0) {
            bronzeIcon.src = "icons/bronze_filled.png";
            let bronzeText = document.createElement("figcaption");
            let bronzeTextNode = document.createTextNode(totalTrophies[3]);
            bronzeText.classList.add("trophy-text");
            bronzeText.classList.add("bronze");
            bronzeText.appendChild(bronzeTextNode);
            bronzeFig.appendChild(bronzeText);
        }
        else {
            bronzeIcon.src = "icons/bronze_outline.png";
        }
        trophyWrapper.appendChild(bronzeFig);
        //Total generation (only gets here if more than 1 trophy)
        let totalFig = document.createElement("figure");
        totalFig.classList.add("trophy-figure");
        let totalIcon = document.createElement("img");
        totalIcon.src = "icons/alltrophies.png";
        totalIcon.classList.add("trophy-icon");
        totalFig.appendChild(totalIcon);
        let totalText = document.createElement("figcaption");
        let totalTextNode = document.createTextNode((totalTrophies[0] + totalTrophies[1] + totalTrophies[2] + totalTrophies[3]));
        totalText.classList.add("trophy-text");
        totalText.appendChild(totalTextNode);
        totalFig.appendChild(totalText);
        trophyWrapper.appendChild(totalFig);
        headerElement.appendChild(trophyWrapper);
    }
    
    //Total gamerscore generation
    if (totalGamerscore > 0) {
        let itemGamerscore = document.createElement("h2");
        itemGamerscoreNode = document.createTextNode(totalGamerscore);
        itemGamerscore.classList.add("gamerscore");
        itemGamerscore.classList.add("header-flex-wrapper");
        let gamerscoreIcon = document.createElement("img")
        gamerscoreIcon.src = "icons/gamerscore.svg";
        gamerscoreIcon.classList.add("icon-intext");
        gamerscoreIcon.style.marginRight = "0.25em";
        itemGamerscore.appendChild(gamerscoreIcon);
        itemGamerscore.appendChild(itemGamerscoreNode);
        headerElement.appendChild(itemGamerscore);
    }

    //Total achievements generation
    if (totalAchievements > 0) {
        let itemAchievements = document.createElement("h2");
        itemAchievementsNode = document.createTextNode(totalAchievements);
        itemAchievements.classList.add("gamerscore");
        itemAchievements.classList.add("header-flex-wrapper");
        let achievementsIcon = document.createElement("img");
        achievementsIcon.src = "icons/achievement.svg";
        achievementsIcon.classList.add("icon-intext");
        achievementsIcon.style.marginRight = "0.25em";
        itemAchievements.appendChild(achievementsIcon);
        itemAchievements.appendChild(itemAchievementsNode);
        headerElement.appendChild(itemAchievements);
    }

    //Total time generation
    if (totalTime[0] + totalTime[1] + totalTime[2] > 0) {
        let totalTimeDisplay = document.createElement("h2");
        totalTimeNode = document.createTextNode(totalTime[0] + ":" + totalTime[1].toLocaleString('en-US', { minimumIntegerDigits: 2 }) + ":" + totalTime[2].toLocaleString('en-US', { minimumIntegerDigits: 2 }));
        totalTimeDisplay.classList.add("time");
        totalTimeDisplay.classList.add("header-flex-wrapper");
        let timeIcon = document.createElement("img");
        timeIcon.src = "icons/time.svg";
        timeIcon.classList.add("icon-intext");
        timeIcon.style.marginRight = "0.25em";
        totalTimeDisplay.appendChild(timeIcon);
        totalTimeDisplay.appendChild(totalTimeNode);
        headerElement.appendChild(totalTimeDisplay);
    }
}

//Function creates an individual item display based on the spreadsheet row passed in
function CreateItem(itemInfo) {
    //Creates the base box
    let itemInfoDiv = document.createElement("li");
    itemInfoDiv.classList.add("name-item");

    itemInfoDiv.setAttribute("name", itemInfo.rowid);

    //Updates header counts
    playthroughCount++;
    if (itemInfo.uniqueitem)
        UpdateCollectionCounts(itemInfo.type);

    //Input image
    //Creates the wrapper for the image
    let itemImageWrapper = document.createElement("div");
    itemImageWrapper.classList.add("image-wrapper");

    //Creates the image itself
    let itemImage = document.createElement("img");
    if (itemInfo.image == null) {
        itemImage.src = "placeholder.jpg";
    }
    else {
        itemImage.src = itemInfo.image;
    }

    if (itemInfo.tallimage) {
        itemImage.classList.add("image-tall");
    }
    else {
        itemImage.classList.add("image");
    }

    itemImageWrapper.appendChild(itemImage);
    itemInfoDiv.appendChild(itemImageWrapper);

    //Checks to see if the item is DLC and adjusts how the name is displayed
    if (itemInfo.removefromtitle) {
        itemInfo.linkedtitles += " "
        itemInfo.title = itemInfo.title.replace(itemInfo.linkedtitles, "");
        //console.log(itemInfo.title);
        itemInfo.subtitle = itemInfo.linkedtitles;
    }

    let itemTitle = document.createElement("h1");
    let itemTitleNode = document.createTextNode(itemInfo.title);
    itemTitle.appendChild(itemTitleNode);
    itemTitle.classList.add("title");
    itemInfoDiv.appendChild(itemTitle);

    //Decides the colour of the title
    if (itemInfo.playing) {
        itemTitle.classList.add("playing-item");
    }
    else if (itemInfo.completed) {
        itemTitle.classList.add("completed-item");
    }
    else if (itemInfo.beaten) {
        itemTitle.classList.add("beaten-item");
    }
    else if (itemInfo.unplayed) {
        itemTitle.classList.add("unplayed-item");
    }
    else if (itemInfo.replay) {
        itemTitle.classList.add("replay-item");
    }
    else if (itemInfo.retired) {
        itemTitle.classList.add("retired-item");
    }
    else if (itemInfo.null) {
        itemTitle.classList.add("null-item");
    }
    else {
        itemTitle.classList.add("backlog-item");
    }

    if (itemInfo.subtitle != null) {
        itemTitle.style.marginBottom = "0px";
        itemTitle.style.paddingBottom = "0px";
        itemTitle.style.overflow = "visible";

        let itemSubtitle = document.createElement("p");
        let itemSubtitleNode = document.createTextNode(itemInfo.subtitle);
        itemSubtitle.appendChild(itemSubtitleNode);
        itemSubtitle.classList.add("subtitle");
        itemInfoDiv.appendChild(itemSubtitle);
    }

    //Type text
    let itemType = document.createElement("h3");
    let itemTypeNode = document.createTextNode(itemInfo.type)
    itemType.classList.add("type");

    let typeIcon = document.createElement("img");
    typeIcon.src = GetTypeIcon(itemInfo.type);
    typeIcon.classList.add("icon-intext");
    typeIcon.style.marginRight = "0.25em";

    itemType.appendChild(typeIcon);
    itemType.appendChild(itemTypeNode);

    if (itemInfo.replay) {
        let replayIcon = document.createElement("img");
        replayIcon.src = "icons/replay.svg";
        replayIcon.classList.add("icon-intext");
        replayIcon.style.marginLeft = "0.25em";
        itemType.appendChild(replayIcon);
    }

    itemInfoDiv.appendChild(itemType);

    //Sets up platform / storefront string
    let itemPlatform = document.createElement("p");
    let str = "";

    if (itemInfo.platform != null) {
        str += itemInfo.platform;

        if (itemInfo.storefront != null)
            str += " | ";
    }

    if (itemInfo.storefront != null) {
        str += itemInfo.storefront;
    }

    let itemPlatformNode = document.createTextNode(str);
    itemPlatform.appendChild(itemPlatformNode);
    itemPlatform.classList.add("platform");
    itemInfoDiv.appendChild(itemPlatform);

    //Creates the time display element
    if (itemInfo.time != null) {
        UpdateTotalTime(itemInfo.time);

        let itemTime = document.createElement("h2");

        if (itemInfo.time.endsWith(":00")) {
            itemInfo.time = itemInfo.time.slice(0, -3);
        }

        let itemTimeNode = document.createTextNode(itemInfo.time);
        itemTime.classList.add("time");

        let timeIcon = document.createElement("img");
        timeIcon.src = "icons/time.svg";
        timeIcon.classList.add("icon-intext");
        timeIcon.style.marginRight = "0.25em";

        itemTime.appendChild(timeIcon);
        itemTime.appendChild(itemTimeNode);

        itemInfoDiv.appendChild(itemTime);
    }

    //Checks for gamerscore
    if (itemInfo.gamerscore != null) {
        if (itemInfo.uniqueitem) {
            totalGamerscore += Number(itemInfo.gamerscore);
        }

        let itemGamerscore = document.createElement("h3");
        itemGamerscoreNode = document.createTextNode(itemInfo.gamerscore + " / " + itemInfo.gamerscoremax);
        itemGamerscore.classList.add("gamerscore");

        let gamerscoreIcon = document.createElement("img")
        gamerscoreIcon.src = "icons/gamerscore.svg";
        gamerscoreIcon.classList.add("icon-intext");
        gamerscoreIcon.style.marginRight = "0.25em";

        itemGamerscore.appendChild(gamerscoreIcon);
        itemGamerscore.appendChild(itemGamerscoreNode);

        itemInfoDiv.appendChild(itemGamerscore);
    }

    //Checks for trophies
    if (itemInfo.trophies != null) {
        //Break stops trophies being in line with other text
        itemInfoDiv.appendChild(document.createElement("br"));

        //Splits the trophies into an individual array
        let trophies = itemInfo.trophies.split(".");

        if (itemInfo.uniqueitem) {
            UpdateTrophyCount(trophies);
            totalAchievements += itemInfo.progresscurrent;
        }

        let trophyWrapper = document.createElement("div");
        trophyWrapper.classList.add("trophy-wrapper");

        //platinum icon generation
        if (itemInfo.hasplatinum) {
            console.log("has platinum");

            let platinumFig = document.createElement("figure");
            platinumFig.classList.add("trophy-figure");

            let platinumIcon = document.createElement("img");

            if (trophies[0] != "0")
                platinumIcon.src = "icons/plat_filled.png";
            else
                platinumIcon.src = "icons/plat_outline.png";

            platinumIcon.classList.add("trophy-icon");

            platinumFig.appendChild(platinumIcon);
            trophyWrapper.appendChild(platinumFig);
        }

        //Gold generation
        let goldFig = document.createElement("figure");
        goldFig.classList.add("trophy-figure");

        let goldIcon = document.createElement("img");
        if (trophies[1] != "0")
            goldIcon.src = "icons/gold_filled.png";
        else
            goldIcon.src = "icons/gold_outline.png";
        goldIcon.classList.add("trophy-icon");

        goldFig.appendChild(goldIcon);

        let goldText = document.createElement("figcaption");
        if (trophies[1] == "0")
            trophies[1] = "";
        let goldTextNode = document.createTextNode(trophies[1]);
        goldText.classList.add("trophy-text");
        goldText.classList.add("gold");
        goldText.appendChild(goldTextNode);
        goldFig.appendChild(goldText);
        trophyWrapper.appendChild(goldFig);

        //Silver generation
        let silverFig = document.createElement("figure");
        silverFig.classList.add("trophy-figure");

        let silverIcon = document.createElement("img");
        if (trophies[2] != "0")
            silverIcon.src = "icons/silver_filled.png";
        else
            silverIcon.src = "icons/silver_outline.png";
        silverIcon.classList.add("trophy-icon");

        silverFig.appendChild(silverIcon);

        let silverText = document.createElement("figcaption");
        if (trophies[2] == "0")
            trophies[2] = "";
        let silverTextNode = document.createTextNode(trophies[2]);
        silverText.classList.add("trophy-text");
        silverText.classList.add("silver");
        silverText.appendChild(silverTextNode);
        silverFig.appendChild(silverText);
        trophyWrapper.appendChild(silverFig);

        //Bronze generation
        let bronzeFig = document.createElement("figure");
        bronzeFig.classList.add("trophy-figure");

        let bronzeIcon = document.createElement("img");
        if (trophies[3] != "0")
            bronzeIcon.src = "icons/bronze_filled.png";
        else
            bronzeIcon.src = "icons/bronze_outline.png";
        bronzeIcon.classList.add("trophy-icon");

        bronzeFig.appendChild(bronzeIcon);

        let bronzeText = document.createElement("figcaption");
        if (trophies[3] == "0")
            trophies[3] == "";
        let bronzeTextNode = document.createTextNode(trophies[3]);
        bronzeText.classList.add("trophy-text");
        bronzeText.classList.add("bronze");
        bronzeText.appendChild(bronzeTextNode);
        bronzeFig.appendChild(bronzeText);
        trophyWrapper.appendChild(bronzeFig);

        //Total generation
        let trophyCount = document.createElement("p");
        trophyCount.classList.add("trophy-figure");
        trophyCount.classList.add("trophy-text");
        let trophyTextNode = document.createTextNode("/ " + trophies[4]);
        trophyCount.appendChild(trophyTextNode);
        trophyWrapper.appendChild(trophyCount);

        itemInfoDiv.appendChild(trophyWrapper);
    }

    //Creates the progress bar
    if (itemInfo.progress != null) {
        let itemProgressBase = document.createElement("div");
        itemProgressBase.classList.add("progress-back");

        let itemProgressBar = document.createElement("div");
        itemProgressBar.classList.add("progress-bar");
        //Sets the percentage
        itemProgressBar.style.setProperty('--progress', itemInfo.progress + "%");

        //Changes the colour
        if (itemInfo.progress >= 100)
            itemProgressBar.style.backgroundColor = "gold";

        itemProgressBase.appendChild(itemProgressBar);
        itemInfoDiv.appendChild(itemProgressBase);

        //Adds the text underneath the progress bar
        if (itemInfo.progressprefix != null) {
            //Increments the achievement count
            if (itemInfo.progressprefix == "Achievements" && itemInfo.uniqueitem) {
                totalAchievements += Number(itemInfo.progresscurrent);
            }

            let itemProgressText = document.createElement("p");
            itemProgressText.classList.add("progress-text");
            itemProgressTextNode = document.createTextNode(itemInfo.progressprefix + ": " + itemInfo.progresscurrent + " / " + itemInfo.progressfull);

            itemProgressText.appendChild(itemProgressTextNode);
            itemInfoDiv.appendChild(itemProgressText);
        }
    }

    //Creates the progress note
    if (itemInfo.progressnote != null) {
        let progressNoteDiv = document.createElement("div");
        progressNoteDiv.classList.add("progress-note");

        let progressNoteHeader = document.createElement("h4");
        progressNoteHeader.classList.add("progress-note-text");
        progressNoteHeader.style.fontWeight = "bold";

        let str = "";
        if (itemInfo.retired) {
            str = "Retired Notes:";
            progressNoteHeader.classList.add("retired-item");
        }
        else if (itemInfo.beaten) {
            str = "Playthrough Notes:";
            progressNoteHeader.classList.add("beaten-item");
        }
        else if (itemInfo.completed) {
            str = "Playthrough Notes:";
            progressNoteHeader.classList.add("completed-item");
        }
        else {
            str = "Progress:";

            if (itemInfo.playing)
                progressNoteHeader.classList.add("playing-item");
        }

        let progressNoteHeaderNode = document.createTextNode(str)
        progressNoteHeader.appendChild(progressNoteHeaderNode);
        progressNoteDiv.appendChild(progressNoteHeader);
        progressNoteDiv.appendChild(document.createElement("br"));

        let progressNote = document.createElement("p");
        progressNote.classList.add("progress-note-text");
        let progressNoteNode = document.createTextNode(itemInfo.progressnote);
        progressNote.appendChild(progressNoteNode);
        progressNoteDiv.appendChild(progressNote);

        itemInfoDiv.appendChild(progressNoteDiv);
    }

    collectionElement.appendChild(itemInfoDiv);
}

function UpdateCollectionCounts(gameType) {
    collectionCount++;

    switch (gameType) {
        case "Game":
        case "Collection":
        default:
            gameCount++;
            break;
        case "DLC":
        case "Game Update":
        case "Demo":
            dlcCount++;
            break;
        case "Film":
        case "Film Boxset":
            filmCount++;
            break;
        case "Series":
        case "Show":
            seriesCount++;
            break;
        case "Comic":
        case "Manga":
        case "Novel":
        case "Book":
            bookCount++;
            break;
        case "Album":
        case "Soundtrack":
            albumCount++;
            break;
    }
}

function GetTypeIcon(gameType) {
    switch (gameType) {
        case "Game":
        default:
            return "icons/game.svg";
        case "DLC":
        case "Update":
        case "Demo":
            return "icons/dlc.svg";
        case "Film":
            return "icons/film.svg";
        case "Collection":
        case "Film Boxset":
            return "icons/collection.svg";
        case "Series":
            return "icons/series.svg";
        case "Comic":
        case "Comic Collection":
        case "Manga":
        case "Novel":
        case "Book":
            return "icons/book.svg";
        case "Album":
        case "Soundtrack":
            return "icons/album.svg";
    }
}

function UpdateTrophyCount(trophyArray) {
    totalTrophies[0] = Number(totalTrophies[0]) + Number(trophyArray[0]);
    totalTrophies[1] = Number(totalTrophies[1]) + Number(trophyArray[1]);
    totalTrophies[2] = Number(totalTrophies[2]) + Number(trophyArray[2]);
    totalTrophies[3] = Number(totalTrophies[3]) + Number(trophyArray[3]);
}

function UpdateTotalTime(time) {
    //Updates the total time value
    let timeValues = time.split(":");
    totalTime[0] += Number(timeValues[0]);
    totalTime[1] += Number(timeValues[1]);
    if (timeValues[2] != null) {
        totalTime[2] += Number(timeValues[2]);
    }
    //Checks for the values going above 60
    if (totalTime[2] >= 60) {
        totalTime[1]++;
        totalTime[2] -= 60;
    }
    if (totalTime[1] >= 60) {
        totalTime[0]++;
        totalTime[1] -= 60;
    }
}

//Shows an error message
function SetErrorDisplay() {
    loaderElement.style.display = "none"
    headerElement.style.display = "none"
    collectionElement.style.display = "none"
    errorElement.style.display = "block"
}

function LoadedState(isLoading) {
    if (isLoading) {
        loaderElement.style.display = "block";
        headerElement.style.display = "none";
        collectionElement.style.display = "none";
        errorElement.style.display = "none";
    }
    else {
        loaderElement.style.display = "none";
        headerElement.style.display = "block";
        collectionElement.style.display = "block";
        errorElement.style.display = "none";
    }
}

function ClearInfo() {
    headerElement.replaceChildren();
    collectionElement.replaceChildren();
}

function ResetVariables() {
    playthroughCount = 0;
    collectionCount = 0;
    gameCount = 0;
    dlcCount = 0;
    filmCount = 0;
    seriesCount = 0;
    bookCount = 0;
    albumCount = 0;
    totalTrophies = [0, 0, 0, 0];
    totalGamerscore = 0;
    totalAchievements = 0;
    totalTime = [0, 0, 0];
}

//Search functions handle reloading the page when called by button press
function SearchTitle(title) {

}

function SearchType(button) {
    if (filterType == button.id) {
        filterType = "";
        button.classList.remove("filter-button-used");
    }
    else {
        if (filterType != "") {
            document.getElementById(filterType).classList.remove("filter-button-used");
        }
        filterType = button.id;
        button.classList.add("filter-button-used");
    }

    Load();
}

function SearchCategory(button) {
    if (filterCategory == button.id) {
        filterCategory = "";
        button.classList.remove("filter-button-used");
    }
    else {
        if (filterCategory != "") {
            document.getElementById(filterCategory).classList.remove("filter-button-used");
        }
        filterCategory = button.id;
        button.classList.add("filter-button-used");
    }

    Load();
}

//Sorts the data by different variables
function SortData(sortType) {
    switch (sortType) {
        case "Last Updated":
        default:
            break;
        case "Alphabetical":
            break;
        case "Alphabetical Z-A":
            break;
        case "Date Added":
            break;
        case "Completion Date":
            break;
        case "Progress":
            break;
        case "Review Score":
            break;
    }
}

//Finds the row data to use as a popup
function FindRowData() {

}

//Populates the information into the pop-up element and then displays it
function CreatePopUp() {

}