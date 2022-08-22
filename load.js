//Handles loading the main collection page

let collectionElement = document.getElementById("collection");
let headerElement = document.getElementById("header");
let loaderElement = document.getElementById("loader");
let errorElement = document.getElementById("error");

//Values used to set up the header
let playthroughCount = 0;
let collectionCount = 0;

let gameCount = 0;
let filmCount = 0;
let seriesCount = 0;
let bookCount = 0;

let totalTrophies = [0, 0, 0, 0];
let totalGamerscore = 0;
let totalAchievements = 0;
let totalTime = [0, 0, 0];

$.ajax({
    url: "https://sheetlabs.com/W751/Collection",
    crossDomain: true,
})
    .done(function (data) {
        if (data.length == 0) {
            console.log("No results found");
            SetErrorDisplay();
            return;
        }
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

function HeaderSetup() {
    let playthroughText = document.createElement("h1");
    let playthroughTextNode = document.createTextNode("Playthroughs: " + playthroughCount);
    playthroughText.appendChild(playthroughTextNode);
    headerElement.appendChild(playthroughText);

    let collectionText = document.createElement("h2");
    let collectionTextNode = document.createTextNode("Collection: " + collectionCount);
    collectionText.appendChild(collectionTextNode);
    headerElement.appendChild(collectionText);

    //Total trophies
    let trophyWrapper = document.createElement("div");
    trophyWrapper.classList.add("trophy-wrapper");
    trophyWrapper.classList.add("header-flex-wrapper");
    //platinum icon
    let platinumFig = document.createElement("figure");
    platinumFig.classList.add("trophy-figure");
    let platinumIcon = document.createElement("img");
    platinumIcon.src = "icons/plat_filled.png";
    platinumIcon.classList.add("trophy-icon");
    platinumFig.appendChild(platinumIcon);
    let platinumText = document.createElement("figcaption");
    let platTextNode = document.createTextNode(totalTrophies[0]);
    platinumText.classList.add("trophy-text");
    platinumText.classList.add("platinum");
    platinumText.appendChild(platTextNode);
    platinumFig.appendChild(platinumText);
    trophyWrapper.appendChild(platinumFig);
    //Gold generation
    let goldFig = document.createElement("figure");
    goldFig.classList.add("trophy-figure");
    let goldIcon = document.createElement("img");
    goldIcon.src = "icons/gold_filled.png";
    goldIcon.classList.add("trophy-icon");
    goldFig.appendChild(goldIcon);
    let goldText = document.createElement("figcaption");
    let goldTextNode = document.createTextNode(totalTrophies[1]);
    goldText.classList.add("trophy-text");
    goldText.classList.add("gold");
    goldText.appendChild(goldTextNode);
    goldFig.appendChild(goldText);
    trophyWrapper.appendChild(goldFig);
    //Silver generation
    let silverFig = document.createElement("figure");
    silverFig.classList.add("trophy-figure");
    let silverIcon = document.createElement("img");
    silverIcon.src = "icons/silver_filled.png";
    silverIcon.classList.add("trophy-icon");
    silverFig.appendChild(silverIcon);
    let silverText = document.createElement("figcaption");
    let silverTextNode = document.createTextNode(totalTrophies[2]);
    silverText.classList.add("trophy-text");
    silverText.classList.add("silver");
    silverText.appendChild(silverTextNode);
    silverFig.appendChild(silverText);
    trophyWrapper.appendChild(silverFig);
    //Bronze generation
    let bronzeFig = document.createElement("figure");
    bronzeFig.classList.add("trophy-figure");
    let bronzeIcon = document.createElement("img");
    bronzeIcon.src = "icons/bronze_filled.png";
    bronzeIcon.classList.add("trophy-icon");
    bronzeFig.appendChild(bronzeIcon);
    let bronzeText = document.createElement("figcaption");
    let bronzeTextNode = document.createTextNode(totalTrophies[3]);
    bronzeText.classList.add("trophy-text");
    bronzeText.classList.add("bronze");
    bronzeText.appendChild(bronzeTextNode);
    bronzeFig.appendChild(bronzeText);
    trophyWrapper.appendChild(bronzeFig);
    //Total generation
    let trophyCount = document.createElement("p");
    trophyCount.classList.add("trophy-figure");
    trophyCount.classList.add("trophy-text");
    let trophyTextNode = document.createTextNode((totalTrophies[0]+totalTrophies[1]+totalTrophies[2]+totalTrophies[3]));
    trophyCount.appendChild(trophyTextNode);
    trophyWrapper.appendChild(trophyCount);
    headerElement.appendChild(trophyWrapper);

    //Total gamerscore generation
}

//Function creates an individual item display based on the spreadsheet row passed in
function CreateItem(itemInfo) {
    //Creates the base box
    let itemInfoDiv = document.createElement("li")
    itemInfoDiv.classList.add("name-item");

    //Updates header counts
    playthroughCount++;
    if (itemInfo.uniqueitem)
        collectionCount++;

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
        console.log(itemInfo.title);

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
        totalGamerscore += itemInfo.gamerscore;

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

        if(itemInfo.uniqueitem)
            UpdateTrophyCount(trophies);

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
    switch (gameType) {
        case "Game":
        case "DLC":
        case "Game Update":
        case "Collection":
        default:
            gameCount++;
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
    }
}

function UpdateTrophyCount(trophyArray) {
    totalTrophies[0] = Number(totalTrophies[0]) + Number(trophyArray[0]);
    totalTrophies[1] = Number(totalTrophies[1]) + Number(trophyArray[1]);
    totalTrophies[2] = Number(totalTrophies[2]) + Number(trophyArray[2]);
    totalTrophies[3] = Number(totalTrophies[3]) + Number(trophyArray[3]);
}

function UpdateTotalTime(time) {
    //Break the values up
    //Add
    //Check for overflow
}

//Shows an error message
function SetErrorDisplay() {
    loaderElement.style.display = "none"
    headerElement.style.display = "none"
    collectionElement.style.display = "none"
    errorElement.style.display = "block"
}