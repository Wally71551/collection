let collectionElement = document.getElementById("collection");
let headerElement = document.getElementById("header-main");
let loaderElement = document.getElementById("loader");
let errorElement = document.getElementById("error");

var popupElement;
var popupBackground;
let popupOpen = false;

//Values used to set up the header
let totalItems = 0;
let playthroughCount = 0;
let collectionCount = 0;
                //Playing, Backlog, Unplayed, Retired, Beaten, Completed, Null
let typeCounts = [0, 0, 0, 0, 0, 0, 0];

let gameCount = 0;
let dlcCount = 0;
let filmCount = 0;
let seriesCount = 0;
let bookCount = 0;
let albumCount = 0;
let consoleCount = 0;
let peripheralCount = 0;
let collectibleCount = 0;

let totalTrophies = [0, 0, 0, 0];
let maxTrophies = 0;
let totalGamerscore = 0;
let maxGamerscore = 0;
let totalAchievements = 0;
let maxAchievements = 0;
let totalEpicXP = 0;
let maxEpicXP = 0;
let totalGPlayXP = 0;
let maxGPlayXP = 0;
let totalPerfectGames = 0;
let totalTime = [0, 0, 0];
let allAchievements = 0;

//Search variable setup
let baseAPIURL = "https://sheetlabs.com/W751/Collection"
let searchURL = baseAPIURL;

let filterCategory = "";
let filterType = "";
let searchType = "";
let searchValue = "";
let orderType = "";

let showCollectibles = false;

//Defaults to showing 20 rows
let shouldLimit = true;
let limittedRowAmount = 20;
let limitAmount = 0;
let currentLimitIndex = 0;

Load();

//Initial load
function Load() {
    //Resets all the variables before loading
    LoadedState(true);
    ClearInfo();

    //Set limit amount
    let boxCount = Math.floor(window.innerWidth / 300); //Box item width
    limitAmount = boxCount * limittedRowAmount;
    //Drops limit amount until it is in line with the display amount
    while (limitAmount % boxCount != 0) {
        limitAmount--;
    }

    //Checks the search URL parameters to create the final URL
    BuildURL();

    //Checks to see if collectibles need to be shown
    showCollectibles = document.getElementById("showCollectibles").checked;
    shouldLimit = document.getElementById("limitValues").checked;

    console.log(searchURL);

    //Gets the url and searches the array
    $.ajax({
        url: searchURL,
        crossDomain: true,
    })
        .done(function (data) {
            if (data.length == 0) {
                NoItemDisplay();
                return;
            }

            ResetVariables();

            let isListView = document.getElementById("listView").checked;

            if (isListView) {
                $.each(data, function (key, value) {
                    if (!showCollectibles && value.internaltype == "Collectible")
                        return true;

                    CreateListItem(value);
                });
            }
            else {
                $.each(data, function (key, value) {
                    if (!showCollectibles && value.internaltype == "Collectible")
                        return true;

                    if (document.getElementById("sort").value == "_orderby=review&_order=desc" && value.review == null) {
                        return true;
                    }

                    CreateItem(value);

                    currentLimitIndex++;
                });
            }

            if (playthroughCount == 0) {
                NoItemDisplay();
            }

            HeaderSetup();

            //Checks whether the bottom Show All button needs to be appended
            if (shouldLimit & currentLimitIndex > limitAmount) {
                let buttonElement = document.createElement("BUTTON");
                buttonElement.classList.add("show-all-button")
                buttonElement.name = "ShowAllButton";
                buttonElement.appendChild(document.createTextNode("Show All Items"));
                buttonElement.onclick = function ()
                {
                    document.getElementById("limitValues").checked = false;
                    Load();
                }
                collectionElement.appendChild(buttonElement);
            }

            LoadedState(false);
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
            searchURL += (filterCategory + "=true");
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

        searchURL += "uniqueitem=true";
        firstElement = false;
    }

    if (document.getElementById("searchbar").value != "") {
        if (!firstElement) {
            searchURL += "&";
        }

        if (document.getElementById("searchtype").value == "series" && (document.getElementById("searchbar").value).toUpperCase() == "MCU") {
            searchURL += document.getElementById("searchtype").value + "=" + "Marvel Cinematic Universe*";
        }
        else {
            searchURL += document.getElementById("searchtype").value + "=" + document.getElementById("searchbar").value + "*";
        }

        firstElement = false;
    }

    //Sets the order type
    if (!firstElement) {
        searchURL += "&";
    }
    searchURL += document.getElementById("sort").value;
}

function HeaderSetup() {
    let collectionString = "";

    if (filterCategory != "replay") {
        collectionString += "Collection: " + collectionCount;
    }

    if (playthroughCount != collectionCount && playthroughCount != 0) {
        if (collectionString != "") {
            collectionString += " | ";
        }
        collectionString += "Playthroughs: " + playthroughCount;
    }

    if (collectionString != "") {
        collectionString += " | ";
    }

    collectionString += "Total Item Count: " + totalItems;

    let collectionText = document.createElement("h1");
    let collectionTextNode = document.createTextNode(collectionString);
    collectionText.appendChild(collectionTextNode);
    headerElement.appendChild(collectionText);

    //Draw count bar
    if (totalItems >= 0) {
        let collectionBarBase = document.createElement("div");
        collectionBarBase.classList.add("collection-bar-back");

        //Create bar element for each type
        let playingProgressBar = document.createElement("div");
        playingProgressBar.classList.add("collection-bar-element");
        playingProgressBar.style.setProperty('--amount', typeCounts[0] / totalItems * 100 + "%");
        playingProgressBar.classList.add("playing-bar");
        let playingProgressPopUp = document.createElement("span");
        playingProgressPopUp.classList.add("popuptext");
        playingText = document.createTextNode("Playing: " + typeCounts[0] + " / " + (typeCounts[0] / totalItems * 100).toFixed(2) + "%");
        playingProgressPopUp.appendChild(playingText);
        playingProgressBar.appendChild(playingProgressPopUp);
        collectionBarBase.appendChild(playingProgressBar);

        let unplayedProgressBar = document.createElement("div");
        unplayedProgressBar.classList.add("collection-bar-element");
        unplayedProgressBar.style.setProperty('--amount', typeCounts[2] / totalItems * 100 + "%");
        unplayedProgressBar.classList.add("unplayed-bar");
        let unplayedProgressPopUp = document.createElement("span");
        unplayedProgressPopUp.classList.add("popuptext");
        unplayedText = document.createTextNode("Unplayed: " + typeCounts[2] + " / " + (typeCounts[2] / totalItems * 100).toFixed(2) + "%");
        unplayedProgressPopUp.appendChild(unplayedText);
        unplayedProgressBar.appendChild(unplayedProgressPopUp);
        collectionBarBase.appendChild(unplayedProgressBar);

        let backlogProgressBar = document.createElement("div");
        backlogProgressBar.classList.add("collection-bar-element");
        backlogProgressBar.style.setProperty('--amount', typeCounts[1] / totalItems * 100 + "%");
        backlogProgressBar.classList.add("backlog-bar");
        let backlogProgressPopUp = document.createElement("span");
        backlogProgressPopUp.classList.add("popuptext");
        backlogText = document.createTextNode("Backlog: " + typeCounts[1] + " / " + (typeCounts[1] / totalItems * 100).toFixed(2) + "%");
        backlogProgressPopUp.appendChild(backlogText);
        backlogProgressBar.appendChild(backlogProgressPopUp);
        collectionBarBase.appendChild(backlogProgressBar);

        let retiredProgressBar = document.createElement("div");
        retiredProgressBar.classList.add("collection-bar-element");
        retiredProgressBar.style.setProperty('--amount', typeCounts[3] / totalItems * 100 + "%");
        retiredProgressBar.classList.add("retired-bar");
        let retiredProgressPopUp = document.createElement("span");
        retiredProgressPopUp.classList.add("popuptext");
        retiredText = document.createTextNode("Retired: " + typeCounts[3] + " / " + (typeCounts[3] / totalItems * 100).toFixed(2) + "%");
        retiredProgressPopUp.appendChild(retiredText);
        retiredProgressBar.appendChild(retiredProgressPopUp);
        collectionBarBase.appendChild(retiredProgressBar);

        let beatenProgressBar = document.createElement("div");
        beatenProgressBar.classList.add("collection-bar-element");
        beatenProgressBar.style.setProperty('--amount', typeCounts[4] / totalItems * 100 + "%");
        beatenProgressBar.classList.add("beaten-bar");
        let beatenProgressPopUp = document.createElement("span");
        beatenProgressPopUp.classList.add("popuptext");
        beatenText = document.createTextNode("Beaten: " + typeCounts[4] + " / " + (typeCounts[4] / totalItems * 100).toFixed(2) + "%");
        beatenProgressPopUp.appendChild(beatenText);
        beatenProgressBar.appendChild(beatenProgressPopUp);
        collectionBarBase.appendChild(beatenProgressBar);

        let completedProgressBar = document.createElement("div");
        completedProgressBar.classList.add("collection-bar-element");
        completedProgressBar.style.setProperty('--amount', typeCounts[5] / totalItems * 100 + "%");
        completedProgressBar.classList.add("completed-bar");
        let completedProgressPopUp = document.createElement("span");
        completedProgressPopUp.classList.add("popuptext");
        completedText = document.createTextNode("Completed: " + typeCounts[5] + " / " + (typeCounts[5] / totalItems * 100).toFixed(2) + "%");
        completedProgressPopUp.appendChild(completedText);
        completedProgressBar.appendChild(completedProgressPopUp);
        collectionBarBase.appendChild(completedProgressBar);

        let nullProgressBar = document.createElement("div");
        nullProgressBar.classList.add("collection-bar-element");
        nullProgressBar.style.setProperty('--amount', typeCounts[6] / totalItems * 100 + "%");
        nullProgressBar.classList.add("null-bar");
        let nullProgressPopUp = document.createElement("span");
        nullProgressPopUp.classList.add("popuptext");
        nullText = document.createTextNode("Null: " + typeCounts[6] + " / " + (typeCounts[6] / totalItems * 100).toFixed(2) + "%");
        nullProgressPopUp.appendChild(nullText);
        nullProgressBar.appendChild(nullProgressPopUp);
        collectionBarBase.appendChild(nullProgressBar);

        headerElement.appendChild(collectionBarBase);
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

    if (consoleCount > 0) {
        let consoleDisplay = document.createElement("h2");
        consoleCountNode = document.createTextNode(consoleCount);
        consoleDisplay.classList.add("counter");
        let consoleIcon = document.createElement("img");
        consoleIcon.src = "icons/console.svg";
        consoleIcon.classList.add("icon-intext");
        consoleIcon.style.marginRight = "0.25em";
        consoleDisplay.appendChild(consoleIcon);
        consoleDisplay.appendChild(consoleCountNode);
        headerElement.appendChild(consoleDisplay);
    }

    if (peripheralCount > 0) {
        let peripheralDisplay = document.createElement("h2");
        peripheralCountNode = document.createTextNode(peripheralCount);
        peripheralDisplay.classList.add("counter");
        let peripheralIcon = document.createElement("img");
        peripheralIcon.src = "icons/peripheral.svg";
        peripheralIcon.classList.add("icon-intext");
        peripheralIcon.style.marginRight = "0.25em";
        peripheralDisplay.appendChild(peripheralIcon);
        peripheralDisplay.appendChild(peripheralCountNode);
        headerElement.appendChild(peripheralDisplay);
    }

    if (collectibleCount > 0) {
        let collectibleDisplay = document.createElement("h2");
        collectibleCountNode = document.createTextNode(collectibleCount);
        collectibleDisplay.classList.add("counter");
        let collectibleIcon = document.createElement("img");
        collectibleIcon.src = "icons/cube.svg";
        collectibleIcon.classList.add("icon-intext");
        collectibleIcon.style.marginRight = "0.25em";
        collectibleDisplay.appendChild(collectibleIcon);
        collectibleDisplay.appendChild(collectibleCountNode);
        headerElement.appendChild(collectibleDisplay);
    }

    headerElement.appendChild(document.createElement("br"));

    //Achievement display
    //Total trophies
    if (totalTrophies[0] + totalTrophies[1] + totalTrophies[2] + totalTrophies[3] > 0 || maxTrophies > 0) {
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

        //Max trophy generation
        let maxFig = document.createElement("figure");
        maxFig.classList.add("trophy-figure");
        let maxIcon = document.createElement("img");
        maxIcon.src = "icons/trophy.svg";
        maxIcon.classList.add("trophy-icon");
        maxFig.appendChild(maxIcon);
        let maxText = document.createElement("figcaption");
        let maxTextNode = document.createTextNode("/ " + maxTrophies);
        maxText.classList.add("trophy-text");
        maxText.appendChild(maxTextNode);
        maxFig.appendChild(maxText);
        trophyWrapper.appendChild(maxFig);

        //PS level generation
        let trophyXP = (300 * totalTrophies[0]) + (90 * totalTrophies[1]) + (30 * totalTrophies[2]) + (15 * totalTrophies[3]);
        let trophyLevel = CalculateTrophyLevel(trophyXP);
        trophyLevel = Math.min(trophyLevel, 1000); //Clamp to max level

        let PSNLevelFig = document.createElement("figure");
        PSNLevelFig.classList.add("trophy-figure");
        let PSNLevelIcon = document.createElement("img");
        PSNLevelIcon.src = GetPSNLevelIcon(trophyLevel);
        PSNLevelIcon.classList.add("trophy-icon");
        PSNLevelFig.appendChild(PSNLevelIcon);
        let PSNLevelText = document.createElement("figcaption");
        let PSNLevelTextNode = document.createTextNode(Math.trunc(trophyLevel) + " | " + ((trophyLevel % 1) * 100).toFixed(1) + "%");
        PSNLevelText.classList.add("trophy-text");
        PSNLevelText.appendChild(PSNLevelTextNode);
        PSNLevelFig.appendChild(PSNLevelText);
        trophyWrapper.appendChild(PSNLevelFig);
        headerElement.appendChild(trophyWrapper);
    }

    //Total gamerscore generation
    if (totalGamerscore > 0 || maxGamerscore > 0) {
        let itemGamerscore = document.createElement("h2");
        itemGamerscoreNode = document.createTextNode(totalGamerscore);
        itemGamerscore.classList.add("gamerscore");
        itemGamerscore.classList.add("header-flex-wrapper");

        let gamerscoreIcon = document.createElement("img");
        gamerscoreIcon.src = "icons/gamerscore.svg";
        gamerscoreIcon.classList.add("icon-intext");
        gamerscoreIcon.style.marginRight = "0.25em";

        let itemGamerscoreTotal = document.createElement("span");
        itemGamerscoreTotal.classList.add("header-small-text-span");
        itemGamerscoreTotal.textContent = " / " + maxGamerscore;

        itemGamerscore.appendChild(gamerscoreIcon);
        itemGamerscore.appendChild(itemGamerscoreNode);
        itemGamerscore.appendChild(itemGamerscoreTotal);
        headerElement.appendChild(itemGamerscore);
    }

    //Epic XP generation
    if (totalEpicXP > 0 || maxEpicXP > 0) {
        let itemEpic = document.createElement("h2");
        itemEpicNode = document.createTextNode(totalEpicXP);
        itemEpic.classList.add("gamerscore");
        itemEpic.classList.add("header-flex-wrapper");

        let epicIcon = document.createElement("img");
        epicIcon.src = "icons/epic.svg";
        epicIcon.classList.add("icon-intext");
        epicIcon.style.marginRight = "0.25em";

        let epicTotal = document.createElement("span");
        epicTotal.classList.add("header-small-text-span");
        epicTotal.textContent = " / " + maxEpicXP + " XP";

        itemEpic.appendChild(epicIcon);
        itemEpic.appendChild(itemEpicNode);
        itemEpic.appendChild(epicTotal);
        headerElement.appendChild(itemEpic);
    }

    //GPlay XP generation
    if (totalGPlayXP > 0 || maxGPlayXP > 0) {
        let itemGPlay = document.createElement("h2");
        itemGPlayNode = document.createTextNode(totalGPlayXP);
        itemGPlay.classList.add("gamerscore");
        itemGPlay.classList.add("header-flex-wrapper");

        let gplayIcon = document.createElement("img");
        gplayIcon.src = "icons/gplay.svg";
        gplayIcon.classList.add("icon-intext");
        gplayIcon.style.marginRight = "0.25em";

        let gplayTotal = document.createElement("span");
        gplayTotal.classList.add("header-small-text-span");
        gplayTotal.textContent = " / " + maxGPlayXP + " XP"

        itemGPlay.appendChild(gplayIcon);
        itemGPlay.appendChild(itemGPlayNode);
        itemGPlay.appendChild(gplayTotal);
        headerElement.appendChild(itemGPlay);
    }

    //Total achievements generation
    if (totalAchievements > 0 || maxAchievements > 0) {
        let itemAchievements = document.createElement("h2");
        let itemAchievementsNode = document.createTextNode(totalAchievements);
        itemAchievements.classList.add("gamerscore");
        itemAchievements.classList.add("header-flex-wrapper");

        let achievementsIcon = document.createElement("img");
        achievementsIcon.src = "icons/achievement.svg";
        achievementsIcon.classList.add("icon-intext");
        achievementsIcon.style.marginRight = "0.25em";

        let maxAchItem = document.createElement("span");
        maxAchItem.classList.add("header-small-text-span");
        maxAchItem.textContent = " / " + maxAchievements;

        itemAchievements.appendChild(achievementsIcon);
        itemAchievements.appendChild(itemAchievementsNode);
        itemAchievements.appendChild(maxAchItem);
        headerElement.appendChild(itemAchievements);
    }

    if (allAchievements > 0) {
        let allAchievementsDisplay = document.createElement("h2");
        let allAchievementsCount = document.createTextNode(allAchievements);
        allAchievementsDisplay.classList.add("gamerscore");
        allAchievementsDisplay.classList.add("header-flex-wrapper");
        allAchievementsDisplay.classList.add("completed-item");
        let allAchievementsIcon = document.createElement("img");
        allAchievementsIcon.src = "icons/achievement.svg";
        allAchievementsIcon.classList.add("icon-intext");
        allAchievementsIcon.classList.add("all-achievements");
        allAchievementsIcon.style.marginRight = "0.25em";
        allAchievementsDisplay.appendChild(allAchievementsIcon);
        allAchievementsDisplay.appendChild(allAchievementsCount);
        headerElement.appendChild(allAchievementsDisplay);
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
    itemInfoDiv.classList.add("box-item");
    itemInfoDiv.setAttribute("name", itemInfo.rowid);

    let collectionItemDisplay = null;

    //Updates header counts
    totalItems++;
    if(!itemInfo.null)
        playthroughCount++;
    if (itemInfo.uniqueitem) {
        UpdateCollectionCounts(itemInfo.type);
        collectionItemDisplay = document.createElement("div");
        collectionItemDisplay.classList.add("box-collection-item");
        itemInfoDiv.appendChild(collectionItemDisplay);
    }

    UpdateTypeCount(itemInfo);

    //Image setup
    let imageWrapper = CreateImage(itemInfo.image, itemInfo.tallimage);
    itemInfoDiv.appendChild(imageWrapper);

    //Checks to see if the item is DLC and adjusts how the name is displayed
    if (itemInfo.removefromtitle) {
        itemInfo.linkedtitles += " ";
        itemInfo.title = itemInfo.title.replace(itemInfo.linkedtitles, "");
        //console.log(itemInfo.title);
        itemInfo.subtitle = itemInfo.linkedtitles;
    }

    let itemTitleDiv = document.createElement("div");
    itemTitleDiv.classList.add("title-div");

    //Creates title
    let itemTypes = [itemInfo.playing, itemInfo.backlog, itemInfo.completed, itemInfo.beaten, itemInfo.unplayed, itemInfo.retired, itemInfo.replay, itemInfo.null]
    let itemTitle = CreateTitle(itemInfo.title, itemInfo.rowid, itemTypes);
    itemTitleDiv.appendChild(itemTitle);

    if (collectionItemDisplay != null) {
        if (itemTypes[0]) {
            collectionItemDisplay.classList.add("playing-bar");
        }
        else if (itemTypes[2]) {
            collectionItemDisplay.classList.add("completed-bar");
        }
        else if (itemTypes[3]) {
            collectionItemDisplay.classList.add("beaten-bar");
        }
        else if (itemTypes[4]) {
            collectionItemDisplay.classList.add("unplayed-bar");
        }
        else if (itemTypes[5]) {
            collectionItemDisplay.classList.add("retired-bar");
        }
        else if (itemTypes[6]) {
            collectionItemDisplay.classList.add("replay-bar");
        }
        else if (itemTypes[7]) {
            collectionItemDisplay.classList.add("null-bar");
        }
        else {
            collectionItemDisplay.classList.add("backlog-bar");
        }
    }

    //Checks to see if the style of the title needs to change
    if (itemInfo.subtitle != null) {
        let titleBreak = document.createElement("div");
        titleBreak.classList.add("title-div-break");
        itemTitleDiv.appendChild(titleBreak);

        //Checks to see whether subtitle needs to be split into 2
        if (itemInfo.subtitle.indexOf(" || ") > -1) {
            let subtitles = itemInfo.subtitle.split(" || ");
            if (subtitles != null && subtitles.length > 1) {
                let subtitleItem1 = CreateSubtitle(subtitles[0]);
                itemTitleDiv.appendChild(subtitleItem1);
                let subtitleItem2 = CreateSubtitle(subtitles[1]);
                itemTitleDiv.appendChild(subtitleItem2);

                //Checks the sizes
                if (subtitles[0].length > 40) {
                    subtitleItem1.style.fontSize = "0.75em";
                    subtitleItem2.style.fontSize = "0.75em";
                }
                else if (subtitles[1].length > 30) {
                    subtitleItem2.style.fontSize = "0.75em";
                }
            }
        }
        else {
            let subtitleItem = CreateSubtitle(itemInfo.subtitle);
            itemTitleDiv.appendChild(subtitleItem);

            if (itemInfo.title.length > 40 && itemInfo.subtitle.length > 40) {
                subtitleItem.style.fontSize = "0.75em";
            }
        }
    }

    itemInfoDiv.appendChild(itemTitleDiv);

    //Creates type and platform / storefront text
    itemInfoDiv.appendChild(CreateTypeText(itemInfo.type, itemInfo.region, itemInfo.replay));
    itemInfoDiv.appendChild(CreatePlatformText(itemInfo.platform, itemInfo.storefront, itemInfo.internaltype));

    //Creates the time display element
    if (itemInfo.time != null) {
        itemInfoDiv.appendChild(CreateTimeDisplay(itemInfo.time));
    }

    //Checks for gamerscore
    //Checks for trophies
    if (itemInfo.trophies != null) {
        //Break stops trophies being in line with other text
        itemInfoDiv.appendChild(document.createElement("br"));

        let trophies = itemInfo.trophies.split(".");

        if (!itemInfo.removeachievements) {
            UpdateTrophyCount(trophies);
            totalAchievements += itemInfo.progresscurrent;
            maxAchievements += itemInfo.progressfull;
            if (itemInfo.progress != null && itemInfo.progress >= 100) {
                allAchievements++;
            }
        }

        if (itemInfo.xp == null) {
            itemInfoDiv.appendChild(CreateTrophyDisplay(trophies));
        }
        else {
            //Sets up the main trophy wrapper
            let mainWrapper = CreateTrophyDisplay(trophies);

            //Add xp icon
            let xpIcon = document.createElement("img")
            xpIcon.src = GetXPIcon(itemInfo.xptype);
            xpIcon.classList.add("trophy-xp-icon");
            mainWrapper.appendChild(xpIcon);

            //Adds actual xp values
            let suffix = '';
            if (itemInfo.xptype == 'GPLAY' || itemInfo.xptype == 'EPIC') {
                suffix = ' XP';
            }

            //generates the values in vertical form
            if (itemInfo.xpmax != null) {
                let itemXPDiv = document.createElement("div");
                itemXPDiv.classList.add("trophy-xp-div");
                let itemTop = document.createElement("p");
                itemTop.innerText = itemInfo.xp;
                itemTop.classList.add("trophy-xp-text");
                itemXPDiv.appendChild(itemTop);
                let itemLine = document.createElement("p");
                itemLine.innerText = '—'
                itemLine.classList.add("trophy-xp-line");
                itemXPDiv.appendChild(itemLine);
                let itemBottom = document.createElement("p");
                itemBottom.innerText = itemInfo.xpmax + suffix;
                itemBottom.classList.add("trophy-xp-text");
                itemXPDiv.appendChild(itemBottom);
                mainWrapper.appendChild(itemXPDiv);
            }
            else {
                let itemXP = document.createElement("p");
                itemXP.classList.add("trophy-xp-line");
                itemXP.innerText = itemInfo.xp + suffix;
                mainWrapper.appendChild(itemXP);
            }

            itemInfoDiv.appendChild(mainWrapper);

            //Adds to the correct counters
            if (!itemInfo.removexp) {
                switch (itemInfo.xptype) {
                    case ('XBOX'):
                        totalGamerscore += Number(itemInfo.xp);
                        maxGamerscore += Number(itemInfo.xpmax);
                        break;
                    case ('EPIC'):
                        totalEpicXP += Number(itemInfo.xp);
                        maxEpicXP += Number(itemInfo.xpmax);
                        break;
                    case ('GPLAY'):
                        totalGPlayXP += Number(itemInfo.xp);
                        maxGPlayXP += Number(itemInfo.xpmax);
                        break;
                    case ('UBI'):
                        if (itemInfo.xp == itemInfo.xpmax) {
                            allAchievements++;
                        }
                        totalAchievements += Number(itemInfo.xp);
                        maxAchievements += Number(itemInfo.xpmax);
                        break;
                }
            }
        }
    }
    //else if used as xp section for PS games has already been handled
    else if (itemInfo.xp != null) {
        itemInfoDiv.appendChild(CreateXPIcon(itemInfo.xp, itemInfo.xpmax, itemInfo.xptype));

        //Adds to the correct counters
        if (!itemInfo.removexp) {
            switch (itemInfo.xptype) {
                case ('XBOX'):
                    totalGamerscore += Number(itemInfo.xp);
                    maxGamerscore += Number(itemInfo.xpmax);
                    break;
                case ('EPIC'):
                    totalEpicXP += Number(itemInfo.xp);
                    maxEpicXP += Number(itemInfo.xpmax);
                    break;
                case ('GPLAY'):
                    totalGPlayXP += Number(itemInfo.xp);
                    maxGPlayXP += Number(itemInfo.xpmax);
                    break;
                case ('UBI'):
                    if (itemInfo.xp == itemInfo.xpmax) {
                        allAchievements++;
                    }
                    totalAchievements += Number(itemInfo.xp);
                    maxAchievements += Number(itemInfo.xpmax);
                    break;
            }
        }
    }

    //Creates the progress bar
    if (itemInfo.progresscurrent != null && itemInfo.progressfull != null) {
        itemInfoDiv.appendChild(CreateProgressBar(itemInfo.progress));

        //Adds the text underneath the progress bar
        if (itemInfo.progressprefix != null) {
            //Increments the achievement count
            if ((itemInfo.progressprefix == "Achievements" || itemInfo.progressprefix == "Achievement") && !itemInfo.removeachievements) {
                totalAchievements += Number(itemInfo.progresscurrent);
                maxAchievements += Number(itemInfo.progressfull);

                if (itemInfo.progress >= 100) {
                    allAchievements++;
                }
            }

            let itemProgressText = document.createElement("p");
            itemProgressText.classList.add("progress-text");
            itemProgressTextNode = document.createTextNode(itemInfo.progressprefix + ": " + itemInfo.progresscurrent + " / " + itemInfo.progressfull);

            itemProgressText.appendChild(itemProgressTextNode);
            itemInfoDiv.appendChild(itemProgressText);
        }
    }
    else if (itemInfo.progressprefix == "Percentage Completion") {
        itemInfoDiv.appendChild(CreateProgressBar(itemInfo.progress));

        let itemProgressText = document.createElement("p");
        itemProgressText.classList.add("progress-text");
        itemProgressTextNode = document.createTextNode(itemInfo.progress + "% Completion");

        itemProgressText.appendChild(itemProgressTextNode);
        itemInfoDiv.appendChild(itemProgressText);
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
        progressNote.classList.add("scrollable-text");
        let progressNoteNode = document.createTextNode(itemInfo.progressnote);
        progressNote.appendChild(progressNoteNode);
        progressNoteDiv.appendChild(progressNote);

        itemInfoDiv.appendChild(progressNoteDiv);
    }

    if (shouldLimit) {
        if (currentLimitIndex < limitAmount) {
            collectionElement.appendChild(itemInfoDiv);
        }
    }
    else {
        collectionElement.appendChild(itemInfoDiv);
    }
}

function CreateListItem(itemInfo) {
    //Creates the base box
    let itemInfoDiv = document.createElement("li");
    itemInfoDiv.classList.add("list-item");
    itemInfoDiv.setAttribute("name", itemInfo.rowid);

    //Creates the two wrapper divs
    let leftDiv = document.createElement("div");
    leftDiv.classList.add("list-info-wrapper");
    let rightDiv = document.createElement("div");
    rightDiv.classList.add("list-info-wrapper");

    //Updates header counts
    totalItems++;
    if(!itemInfo.null)
        playthroughCount++;
    if (itemInfo.uniqueitem)
        UpdateCollectionCounts(itemInfo.type);

    //Checks to see if the item is DLC and adjusts how the name is displayed
    if (itemInfo.removefromtitle) {
        itemInfo.linkedtitles += " "
        itemInfo.title = itemInfo.title.replace(itemInfo.linkedtitles, "");
        itemInfo.subtitle = itemInfo.linkedtitles;
    }

    let itemTypes = [itemInfo.playing, itemInfo.backlog, itemInfo.completed, itemInfo.beaten, itemInfo.unplayed, itemInfo.retired, itemInfo.replay, itemInfo.null]
    let itemTitle = CreateTitle(itemInfo.title, itemInfo.rowid, itemTypes);
    itemTitle.classList.add("list-title");
    leftDiv.appendChild(itemTitle);

    if (itemInfo.subtitle != null) {
        leftDiv.appendChild(CreateSubtitle(itemInfo.subtitle));
    }

    if (itemInfo.Replay) {
        let replayIcon = document.createElement("img");
        replayIcon.src = "icons/replay.svg";
        replayIcon.classList.add("icon-intext");
        replayIcon.classList.add("list-replay");
        rightDiv.appendChild(replayIcon);
    }

    //Creates the time display element
    if (itemInfo.time != null) {
        let itemTime = CreateTimeDisplay(itemInfo.time)
        itemTime.classList.remove("time");
        itemTime.classList.add("list-time");
        rightDiv.appendChild(itemTime);
    }

    //Type text
    let itemType = document.createElement("h3");
    let itemTypeNode = document.createTextNode(itemInfo.type)
    itemType.classList.add("list-type");

    //Gates whether the image is made to reduce loading times
    if (shouldLimit == false || (shouldLimit && currentLimitIndex < limitAmount)) {
        let typeIcon = document.createElement("img");
        typeIcon.src = GetTypeIcon(itemInfo.type);
        typeIcon.classList.add("icon-intext");
        typeIcon.style.marginLeft = "0.25em";
        typeIcon.style.paddingRight = "10px";
    }

    itemType.appendChild(itemTypeNode);
    itemType.appendChild(typeIcon);

    rightDiv.appendChild(itemType);

    itemInfoDiv.appendChild(leftDiv);
    itemInfoDiv.appendChild(rightDiv);

    if (shouldLimit) {
        if (currentLimitIndex < limitAmount) {
            collectionElement.appendChild(itemInfoDiv);
        }
    }
    else {
        collectionElement.appendChild(itemInfoDiv);
    }
}

function CreateImage(imageLink, isTallImage) {
    //Input image
    //Creates the wrapper for the image
    let itemImageWrapper = document.createElement("div");
    itemImageWrapper.classList.add("image-wrapper");

    //Creates the image itself
    let itemImage = document.createElement("img");
    if (imageLink == null) {
        itemImage.src = "img/placeholder.jpg";
    }
    else {
        itemImage.src = imageLink;
    }

    if (isTallImage) {
        itemImage.classList.add("image-tall");
    }
    else {
        itemImage.classList.add("image");
    }

    itemImage.loading = "lazy";

    itemImageWrapper.appendChild(itemImage);
    return itemImageWrapper;
}

function CreateTitle(title, rowid, types) {
    let itemTitle = document.createElement("h1");
    let itemTitleNode = document.createTextNode(title);
    itemTitle.appendChild(itemTitleNode);
    itemTitle.onclick = function () { StartCreatePopUp(rowid) };
    itemTitle.classList.add("title");

    //Decides what colour the title needs to be
    if (types[0]) {
        itemTitle.classList.add("playing-item");
    }
    else if (types[2]) {
        itemTitle.classList.add("completed-item");
    }
    else if (types[3]) {
        itemTitle.classList.add("beaten-item");
    }
    else if (types[4]) {
        itemTitle.classList.add("unplayed-item");
    }
    else if (types[5]) {
        itemTitle.classList.add("retired-item");
    }
    else if (types[6]) {
        itemTitle.classList.add("replay-item");
    }
    else if (types[7]) {
        itemTitle.classList.add("null-item");
    }
    else {
        itemTitle.classList.add("backlog-item");
    }

    return itemTitle;
}

function CreateSubtitle(subtitle) {
    let itemSubtitle = document.createElement("p");
    let itemSubtitleNode = document.createTextNode(subtitle);
    itemSubtitle.appendChild(itemSubtitleNode);
    itemSubtitle.classList.add("subtitle");
    return itemSubtitle;
}

function CreateTypeText(type, region, isReplay) {
    //Type text
    let itemType = document.createElement("h3");
    let itemTypeNode = document.createTextNode(type)
    itemType.classList.add("type");

    let typeIcon = document.createElement("img");
    typeIcon.src = GetTypeIcon(type);
    typeIcon.classList.add("icon-intext");
    typeIcon.style.marginRight = "0.25em";

    itemType.appendChild(typeIcon);
    itemType.appendChild(itemTypeNode);

    //Adds a region icon if it isnt null (default region)
    if (region != null) {
        let regionIcon = document.createElement("img");
        regionIcon.src = GetRegionIcon(region);
        regionIcon.classList.add("icon-intext");
        regionIcon.style.marginLeft = "0.25em";
        regionIcon.style.height = "0.8em";
        regionIcon.style.width = "1.2em";
        itemType.appendChild(regionIcon);
    }

    if (isReplay) {
        let replayIcon = document.createElement("img");
        replayIcon.src = "icons/replay.svg";
        replayIcon.classList.add("icon-intext");
        replayIcon.style.marginLeft = "0.25em";
        itemType.appendChild(replayIcon);
    }

    return itemType;
}

function CreatePlatformText(platform, storefront, internalType) {
    //Sets up platform / storefront string
    let itemPlatform = document.createElement("p");
    let str = "";

    let shouldSplit = false;

    if (platform != null) {
        str += platform;
    }

    if (storefront != null && !(internalType == "Collectible" && storefront == "Physical")) {
        if (platform != null) {
            str += " | ";
            shouldSplit = true;
        }

        str += storefront;
    }

    let itemPlatformNode = document.createTextNode(str);
    itemPlatform.appendChild(itemPlatformNode);

    //Centers the text dynamically if needed
    if (itemPlatform.innerText.includes('|') && shouldSplit) {
        const [leftText, rightText] = itemPlatform.innerText.split('|');
        itemPlatform.innerHTML = `<span class="left-text">${leftText.trim()}</span><span class="center-char"><strong>|</strong></span><span class="right-text">${rightText.trim()}</span>`;
    }

    itemPlatform.classList.add("platform");
    return itemPlatform;
}

function CreateTimeDisplay(time) {
    UpdateTotalTime(time);

    let itemTime = document.createElement("h2");

    if (time.endsWith(":00")) {
        time = time.slice(0, -3);
    }

    let itemTimeNode = document.createTextNode(time);
    itemTime.classList.add("time");

    let timeIcon = document.createElement("img");
    timeIcon.src = "icons/time.svg";
    timeIcon.classList.add("icon-intext");
    timeIcon.style.marginRight = "0.25em";

    itemTime.appendChild(timeIcon);
    itemTime.appendChild(itemTimeNode);

    return itemTime;
}

function CreateXPIcon(xp, xpMax, type) {
    //Creates gamerscore display
    let itemXP = document.createElement("h3");
    itemXP.classList.add("xp");

    let mainType = type;
    let secondaryType = ''
    if (type.includes('|')) {
        const [main, secondary] = type.split('|');
        mainType = main;
        secondaryType = secondary;
    }

    //Adds suffixes here
    let suffix = ''
    if (mainType == 'GPLAY' || mainType == 'EPIC') {
        suffix = " XP";
    }

    let itemXPNode = ''
    if (xpMax != null) {
        itemXPNode = document.createTextNode(xp + " / " + xpMax + suffix);
    }
    else {
        itemXPNode = document.createTextNode(xp + suffix);
    }

    let xpIcon = document.createElement("img")
    xpIcon.src = GetXPIcon(mainType);

    xpIcon.classList.add("icon-intext");
    xpIcon.style.marginRight = "0.25em";

    //Checks to make sure the secondary type exists and then adds the extra info
    if (secondaryType != '') {
        let xpLeft = document.createElement("div");
        xpLeft.classList.add("left-xp-div");
        xpLeft.appendChild(xpIcon);
        xpLeft.appendChild(itemXPNode);

        //Adds divider text
        let divider = document.createElement("p");
        divider.innerHTML = '<strong>|</strong>';
        divider.classList.add("center-char-xp");
        divider.classList.add("xp-divider");


        const [_type, _xp, _xpMax] = secondaryType.split('/');

        if (_type == 'GPLAY' || _type == 'EPIC') {
            suffix = " XP";
        }

        if (_xpMax != null) {
            itemXPNode = document.createTextNode(_xp + " / " + _xpMax + suffix);
        }
        else {
            itemXPNode = document.createTextNode(_xp + suffix);
        }
        xpIcon = document.createElement("img");
        xpIcon.src = GetXPIcon(_type);
        xpIcon.classList.add("icon-intext");
        xpIcon.style.marginRight = "0.25em";

        let xpRight = document.createElement("div");
        xpRight.classList.add("right-xp-div");
        xpRight.appendChild(xpIcon);
        xpRight.appendChild(itemXPNode);

        itemXP.appendChild(xpLeft);
        itemXP.appendChild(divider);
        itemXP.appendChild(xpRight);
    }
    else {
        itemXP.appendChild(xpIcon);
        itemXP.appendChild(itemXPNode);
    }

    return itemXP;
}

function GetXPIcon(type) {
    switch (type) {
        case 'XBOX':
        default:
            return "icons/gamerscore.svg";
        case 'EPIC':
            return "icons/epic.svg";
        case 'UBI':
            return "icons/ubi.svg";
        case 'UBI_C':
            return "icons/bullseye.svg";
        case 'GPLAY':
            return "icons/gplay.svg";
        case 'EA':
            return "icons/ea.svg";
    }
}

function CreateTrophyDisplay(trophies) {
    let trophyWrapper = document.createElement("div");
    trophyWrapper.classList.add("trophy-wrapper");

    for (let i = 0; i < trophies.length - 1; i++) {
        if (trophies[i] != "/") {
            let trophyFigure = document.createElement("figure");
            trophyFigure.classList.add("trophy-figure");

            trophyIcon = document.createElement("img");
            trophyIcon.classList.add("trophy-icon");

            if (trophies[i] != "0") {
                switch (i) {
                    case 0:
                        trophyIcon.src = "icons/plat_filled.png";
                        break;
                    case 1:
                        trophyIcon.src = "icons/gold_filled.png";
                        break;
                    case 2:
                        trophyIcon.src = "icons/silver_filled.png";
                        break;
                    case 3:
                    default:
                        trophyIcon.src = "icons/bronze_filled.png";
                        break;
                }
            }
            else {
                switch (i) {
                    case 0:
                        trophyIcon.src = "icons/plat_outline.png";
                        break;
                    case 1:
                        trophyIcon.src = "icons/gold_outline.png";
                        break;
                    case 2:
                        trophyIcon.src = "icons/silver_outline.png";
                        break;
                    case 3:
                    default:
                        trophyIcon.src = "icons/bronze_outline.png";
                        break;
                }
            }

            trophyFigure.appendChild(trophyIcon);

            //Checks for platinum trophy
            if (i == 0) {
                trophyWrapper.appendChild(trophyFigure);
                continue;
            }

            let trophyText = document.createElement("figcaption");
            if (trophies[i] == "0")
                trophies[i] = "";
            let trophyTextNode = document.createTextNode(trophies[i]);
            trophyText.classList.add("trophy-text");

            switch (i) {
                case 1:
                    trophyText.classList.add("gold");
                    break;
                case 2:
                    trophyText.classList.add("silver");
                    break;
                case 3:
                default:
                    trophyText.classList.add("bronze");
                    break;
            }

            trophyText.appendChild(trophyTextNode);
            trophyFigure.appendChild(trophyText);
            trophyWrapper.appendChild(trophyFigure);
        }
    }

    //Total generation
    let trophyCount = document.createElement("p");
    trophyCount.classList.add("trophy-figure");
    trophyCount.classList.add("trophy-text");
    let trophyCountNode = document.createTextNode("/ " + trophies[4]);
    trophyCount.appendChild(trophyCountNode);
    trophyWrapper.appendChild(trophyCount);

    return trophyWrapper;
}

function CreateProgressBar(progress) {
    let itemProgressBase = document.createElement("div");
    itemProgressBase.classList.add("progress-back");

    let itemProgressBar = document.createElement("div");
    itemProgressBar.classList.add("progress-bar");

    //Changes the colour
    if (progress == 100)
        itemProgressBar.style.backgroundColor = "gold";
    else if (progress > 100) {
        //Handles displaying progress over 100%
        itemProgressBar.style.backgroundColor = "purple";
        itemProgressBase.style.backgroundColor = "gold";
        progress -= 100;
    }

    //Sets the percentage
    itemProgressBar.style.setProperty('--progress', progress + "%");

    itemProgressBase.appendChild(itemProgressBar);
    return itemProgressBase;
}

function UpdateCollectionCounts(gameType) {
    collectionCount++;

    switch (gameType) {
        case "Game":
        case "Arcade Game":
        case "Collection":
        case "Application":
        case "Modpack":
        case "Mod":
        case "Bundle":
        case "Pinball Machine":
        default:
            gameCount++;
            break;
        case "DLC":
        case "DLC Bundle":
        case "Season Pass":
        case "Game Update":
        case "Texture Pack":
        case "Demo":
        case "Skin Pack":
            dlcCount++;
            break;
        case "Film":
        case "Short Film":
        case "Film Box Set":
        case "Film Collection":
        case "Animated Short":
        case "Special Episode":
        case "OVA":
        case "Serial Reconstruction":
            filmCount++;
            break;
        case "Series":
        case "Animated Series":
        case "Animated Shorts":
        case "Web Series":
        case "Anime":
        case "Short Series":
        case "Series Box Set":
        case "Series Collection":
        case "Serial":
            seriesCount++;
            break;
        case "Comic":
        case "Comic One-Shot":
        case "Comic Omnibus":
        case "Comic Collection":
        case "Comic Series":
        case "Graphic Novel":
        case "Graphic Novel Collection":
        case "Graphic Novel Omnibus":
        case "Manga":
        case "Manga Comic":
        case "Manga Collection":
        case "Novel":
        case "Light Novel":
        case "Book":
        case "Web Comic":
        case "Audiobook":
        case "Audio Drama":
        case "Artbook":
            bookCount++;
            break;
        case "Album":
        case "Soundtrack":
        case "Concert":
        case "Track":
        case "Single":
        case "2-Disc CD Collection":
            albumCount++;
            break;
        case "Console":
            consoleCount++;
            break;
        case "Peripheral":
        case "Controller":
            peripheralCount++;
            break;
        case "amiibo":
        case "amiibo Card":
        case "amiibo Double Pack":
        case "amiibo 4-Pack":
        case "Skylanders Figure":
        case "Pokémon Rumble U NFC Figure":
        case "Funko POP!":
        case "Funko POP! Bobble-Head":
        case "Figure":
        case "Minecraft Dungeons Arcade Card":
        case "Goodie Pack":
        case "Collectible":
        case "Pre-Order Bonus":
        case "Poster":
        case "Tamagotchi":
        case "Trading Card":
        case "Collectible Card":
        case "Trading Card Game":
        case "Trading Card Game Set":
        case "Pokémon TCG Card":
        case "Pokémon TCG Expansion":
        case "Pokémon TCG Collection":
        case "Pokémon TCG Deck":
        case "Pokémon TCG Portfolio":
        case "Jumbo Pokémon TCG Card":
        case "Pin":
        case "Pin Set":
        case "Medal":
        case "Diorama":
        case "LEGO Set":
        case "LEGO Polybag Set":
        case "MEGA Set":
        case "HOT WHEELS Car":
        case "Toy Car":
        case "Steelbook":
        case "Coaster Set":
        case "Art Card Set":
        case "Keychain":
        case "Keyring":
            collectibleCount++;
            break;  
    }
}

function GetTypeIcon(itemType) {
    switch (itemType) {
        case "Game":
        case "Arcade Game":
        case "Modpack":
        case "Controller":
            return "icons/game.svg";
        case "DLC":
        case "DLC Bundle":
        case "Update":
        case "Demo":
        case "Application":
        case "Skin Pack":
        case "Goodie Pack":
        case "Update":
        case "Add-On":
        case "Expansion":
        case "Season Pass":
        case "Texture Pack":
        case "Mod":
            return "icons/dlc.svg";
        case "Film":
        case "Short Film":
        case "Animated Short":
        case "Special Episode":
        case "OVA":
        case "Serial Reconstruction":
            return "icons/film.svg";
        case "Collection":
        case "Film Box Set":
        case "Film Collection":
        case "Series Box Set":
        case "Series Collection":
        case "Bundle":
            return "icons/collection.svg";
        case "Series":
        case "Animated Series":
        case "Animated Shorts":
        case "Web Series":
        case "Anime":
        case "Short Series":
        case "Serial":
            return "icons/series.svg";
        case "Comic":
        case "Comic One-Shot":
        case "Comic Omnibus":
        case "Comic Series":
        case "Comic Collection":
        case "Graphic Novel":
        case "Graphic Novel Collection":
        case "Graphic Novel Omnibus":
        case "Manga":
        case "Manga Comic":
        case "Manga Collection":
        case "Novel":
        case "Light Novel":
        case "Book":
        case "Web Comic":
        case "Artbook":
            return "icons/book.svg";
        case "Album":
        case "Single":
        case "Soundtrack":
        case "Concert":
        case "Audiobook":
        case "Audio Drama":
        case "Track":
        case "2-Disc CD Collection":
            return "icons/album.svg";
        case "Console":
            return "icons/console.svg";
        case "Peripheral":
            return "icons/peripheral.svg";
        case "amiibo":
        case "amiibo Double Pack":
        case "amiibo 4-Pack":
        case "Skylanders Figure":
        case "Pokémon Rumble U NFC Figure":
        case "Funko POP!":
        case "Funko POP! Bobble-Head":
        case "Figure":
        case "Tamagotchi":
        case "Diorama":
        case "LEGO Set":
        case "LEGO Polybag Set":
        case "MEGA Set":
        default:
            return "icons/cube.svg";
        case "Minecraft Dungeons Arcade Card":
        case "amiibo Card":
        case "Poster":
        case "Trading Card":
        case "Collectible Card":
        case "Trading Card Game":
        case "Trading Card Game Set":
        case "Pokémon TCG Card":
        case "Pokémon TCG Expansion":
        case "Pokémon TCG Collection":
        case "Pokémon TCG Deck":
        case "Pokémon TCG Portfolio":
        case "Jumbo Pokémon TCG Card":
        case "Steelbook":
        case "Art Card Set":
        case "Keychain":
        case "Keyring":
            return "icons/card.svg";
        case "Pin":
        case "Pin Set":
        case "Pinball Machine":
        case "Coaster Set":
        case "Medal":
            return "icons/circle.svg";
        case "HOT WHEELS Car":
        case "Toy Car":
            return "icons/car-side.svg";
        case "T-Shirt":
            return "icons/tshirt.svg";
        case "Theme Park Attraction":
        case "Rollercoaster":
            return "icons/rollercoaster.svg";
    }
}

function GetRegionIcon(region) {
    switch (region) {
        case "NTSC":
            return "icons/NTSC.jpg";
        case "US":
            return "icons/US.jpg";
        case "ITL":
            return "icons/ITL.jpg";
        case "CZ":
            return "icons/CZ.jpg";
        case "JP":
            return "icons/JP.jpg";
        case "KR":
            return "icons/KR.jpg";
        case "FR":
            return "icons/FR.jpg";
        default:
            return null;
    }
}

function UpdateTrophyCount(trophyArray) {
    for (let i = 0; i < trophyArray.length; i++) {
        if (trophyArray[i] != "/") {
            totalTrophies[i] = Number(totalTrophies[i]) + Number(trophyArray[i]);
        }
    }

    maxTrophies += Number(trophyArray[trophyArray.length - 1]);
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

function NoItemDisplay() {
    document.getElementById("errorMessage").innerHTML = "No items match the parameters.";
    SetErrorDisplay();
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
        headerElement.style.display = "inline-block";
        collectionElement.style.display = "block";
        errorElement.style.display = "none";
    }
}

function ClearInfo() {
    headerElement.replaceChildren();
    collectionElement.replaceChildren();
}

function ResetVariables() {
    totalItems = 0;
    playthroughCount = 0;
    collectionCount = 0;
    typeCounts = [0, 0, 0, 0, 0, 0, 0, 0];
    gameCount = 0;
    dlcCount = 0;
    filmCount = 0;
    seriesCount = 0;
    bookCount = 0;
    albumCount = 0;
    consoleCount = 0;
    peripheralCount = 0;
    collectibleCount = 0;
    totalTrophies = [0, 0, 0, 0];
    maxTrophies = 0;
    totalGamerscore = 0;
    maxGamerscore = 0;
    totalEpicXP = 0;
    maxEpicXP = 0;
    totalGPlayXP = 0;
    maxGPlayXP = 0;
    totalAchievements = 0;
    maxAchievements = 0;
    totalTime = [0, 0, 0];
    allAchievements = 0;

    currentLimitIndex = 0;
}

function UpdateTypeCount(itemInfo) {
    if (itemInfo.playing)
        typeCounts[0] = typeCounts[0] + 1;
    else if (itemInfo.completed)
        typeCounts[5] = typeCounts[5] + 1;
    else if (itemInfo.beaten)
        typeCounts[4] = typeCounts[4] + 1;
    else if (itemInfo.null)
        typeCounts[6] = typeCounts[6] + 1;
    else if (itemInfo.retired)
        typeCounts[3] = typeCounts[3] + 1;
    else if (itemInfo.unplayed)
        typeCounts[2] = typeCounts[2] + 1;
    else
        typeCounts[1] = typeCounts[1] + 1;
}

function CalculateTrophyLevel(trophyXP) {
    let workingXP = trophyXP;
    let trophyLevel = 1;
    let i = 0;

    while (workingXP > 0) {
        if (i == 0) {
            if (workingXP - GetTrophyThreshold(i) * 99 > 0) {
                workingXP -= GetTrophyThreshold(i) * 99;
                trophyLevel += 99;
            }
            else {
                trophyLevel += workingXP / GetTrophyThreshold(i);
                return trophyLevel;
            }
        }
        else {
            if (workingXP - GetTrophyThreshold(i) * 100 > 0) {
                workingXP -= GetTrophyThreshold(i) * 100;
                trophyLevel += 100;
            }
            else {
                trophyLevel += workingXP / GetTrophyThreshold(i);
                return trophyLevel;
            }
        }

        i++;
    }
}

function GetTrophyThreshold(loopInteger) {
    switch (loopInteger) {
        case 0:
            return 60;
        case 1:
            return 90;
        default:
            if ((loopInteger - 1) * 450 == 0) {
                return 1;
            }
            else {
                return (loopInteger - 1) * 450;
            }
    }
}

function GetPSNLevelIcon(PSNLevel) {
    if (PSNLevel >= 1000) {
        return "icons/PSN10.png";
    }
    else if (PSNLevel >= 800) {
        return "icons/PSN9.png";
    }
    else if (PSNLevel >= 700) {
        return "icons/PSN8.png";
    }
    else if (PSNLevel >= 600) {
        return "icons/PSN7.png";
    }
    else if (PSNLevel >= 500) {
        return "icons/PSN6.png";
    }
    else if (PSNLevel >= 400) {
        return "icons/PSN5.png";
    }
    else if (PSNLevel >= 300) {
        return "icons/PSN4.png";
    }
    else if (PSNLevel >= 200) {
        return "icons/PSN3.png";
    }
    else if (PSNLevel >= 100) {
        return "icons/PSN2.png";
    }
    else {
        return "icons/PSN1.png";
    }
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

function ToggleShowCollectibles() {
    showCollectibles = !showCollectibles;
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
function FindRowData(rowID) {
    searchURL = baseAPIURL + "?rowid=" + rowID;
    console.log(searchURL);
    //Gets the url and searches the array
    $.ajax({
        url: searchURL,
        crossDomain: true,
    })
        .done(function (data) {
            if (data.length == 0) {
                console.log("data not found")
                return;
            }

            CreatePopUp(data[0]);
        })
        .fail(function () {
            console.log("failed");
        });
}

//Populates the information into the pop-up element and then displays it
function StartCreatePopUp(rowID) {
    if (!popupOpen) {
        popupOpen = true;
        FindRowData(rowID);
    }
}

function CreatePopUp(itemInfo) {
    console.log(itemInfo.title);

    //Creates the base popup element
    popupElement = document.createElement("div");
    popupElement.classList.add("center-screen");

    popupBackground = document.createElement("div");
    popupBackground.classList.add("popup-background");

    //Creates the delete button
    let deleteButton = document.createElement("div");
    deleteButton.classList.add("detailed-close");
    deleteButton.onclick = function () { ClosePopUp() };
    popupElement.appendChild(deleteButton);

    //Sets up the image display
    let imageWrapper = document.createElement("div");
    imageWrapper.classList.add("detailed-image-wrapper");
    popupElement.appendChild(imageWrapper);
    imageWrapper.appendChild(CreatePopUpImage(itemInfo.image, itemInfo.tallimage));

    //Sets up the opposite side of the object

    //Creates the title element

    //Creates subtitle elements (if needed)

    //Creates category

    //Creates type / platform elements

    //Creates type elements

    //Creates time elements

    collectionElement.appendChild(popupBackground);
    collectionElement.appendChild(popupElement);
}

function ClosePopUp() {
    popupElement.remove();
    popupBackground.remove();
    popupOpen = false;
}

function CreatePopUpImage(imageLink, isTallImage) {
    //Creates the image itself
    let itemImage = document.createElement("img");
    if (imageLink == null) {
        itemImage.src = "img/placeholder.jpg";
    }
    else {
        itemImage.src = imageLink;
    }

    if (isTallImage) {
        itemImage.classList.add("detailed-image-tall");
    }
    else {
        itemImage.classList.add("detailed-image");
    }

    return itemImage;
}