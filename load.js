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

function SetErrorDisplay() {
    loaderElement.style.display = "none"
    collectionElement.style.display = "none"
    errorElement.style.display = "block"
}

//Creates the item display
function CreateItem(itemInfo) {
    //Create list item (for base)
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

    let itemTitle = document.createElement("h3");
    let itemTitleNode = document.createTextNode(itemInfo.title);
    itemTitle.appendChild(itemTitleNode);
    itemTitle.classList.add("title");
    itemInfoDiv.appendChild(itemTitle);

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