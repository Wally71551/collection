//Handles loading the main collection page

let collectionElement = document.getElementById("collection");
let loaderElement = document.getElementById("loader");
let errorElement = document.getElementById("error");

$.ajax({
    url: "https://sheetlabs.com/W751/Collection",
    crossDomain: true,
})
    .done(function (data) {
        if (data.length == 0) {
            console.log("No results found");
            return;
        }
        $.each(data, function (key, value) {
            console.log(value.title);

            CreateItem(value);
        });

        loaderElement.style.display = "none";
        collectionElement.style.display = "block";
        errorElement.style.display = "none";
    })
    .fail(function () {
        console.log("Failed");
        SetErrorDisplay();
    });

//Shows an error message
function SetErrorDisplay() {
    loaderElement.style.display = "none"
    collectionElement.style.display = "none"
    errorElement.style.display = "block"
}

//Function creates an individual item display based on the spreadsheet row passed in
function CreateItem(itemInfo) {
    //Creates the base box
    let itemInfoDiv = document.createElement("li")
    itemInfoDiv.classList.add("name-item");

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

    if (itemInfo.tallimage == 1) {
        itemImage.classList.add("image-tall");
    }
    else {
        itemImage.classList.add("image");
    }

    itemImageWrapper.appendChild(itemImage);
    itemInfoDiv.appendChild(itemImageWrapper);

    //Checks to see if the item is DLC and adjusts how the name is displayed
    if (itemInfo.type == "DLC") {
        itemInfo.linkedtitles += " "
        itemInfo.title = itemInfo.title.replace(itemInfo.linkedtitles, "");
        console.log(itemInfo.title);

        itemInfo.subtitle = itemInfo.linkedtitles;
    }

    let itemTitle = document.createElement("h3");
    let itemTitleNode = document.createTextNode(itemInfo.title);
    itemTitle.appendChild(itemTitleNode);
    itemTitle.classList.add("title");
    itemInfoDiv.appendChild(itemTitle);

    //Decides the colour of the box
    if (itemInfo.playing == "1") {
        itemTitle.classList.add("playing-item");
    }
    else if (itemInfo.completed == "1") {
        itemTitle.classList.add("completed-item");
    }
    else if (itemInfo.unplayed == "1") {
        itemTitle.classList.add("unplayed-item");
    }
    else if (itemInfo.replay == "1") {
        itemTitle.classList.add("replay-item");
    }
    else if (itemInfo.retired == "1") {
        itemTitle.classlist.add("retired-item");
    }
    else {
        itemTitle.classList.add("backlog-item");
    }

    if (itemInfo.subtitle != null) {
        let itemSubtitle = document.createElement("p");
        let itemSubtitleNode = document.createTextNode(itemInfo.subtitle);
        itemSubtitle.appendChild(itemSubtitleNode);
        itemSubtitle.classList.add("subtitle");
        itemInfoDiv.appendChild(itemSubtitle);
    }

    let itemType = document.createElement("h4");
    let itemTypeNode = document.createTextNode(itemInfo.type)
    itemType.appendChild(itemTypeNode);
    itemType.classList.add("type");
    itemInfoDiv.appendChild(itemType);

    if (itemInfo.platform != null) {
        let itemPlatform = document.createElement("p");
        let itemPlatformNode = document.createTextNode(itemInfo.platform);
        itemPlatform.appendChild(itemPlatformNode);
        itemPlatform.classList.add("platform");
        itemInfoDiv.appendChild(itemPlatform);
    }

    if (itemInfo.storefront != null) {
        let itemStorefront = document.createElement("p");
        let itemStorefrontNode = document.createTextNode(itemInfo.storefront);
        itemStorefront.appendChild(itemStorefrontNode);
        itemStorefront.classList.add("storefront");
        itemInfoDiv.appendChild(itemStorefront);
    }

    collectionElement.appendChild(itemInfoDiv);
}