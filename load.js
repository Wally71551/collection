let collectionElement = document.getElementById("collection");
let loaderElement = document.getElementById("loader");
let errorElement = document.getElementById("error");

$.ajax({
    // http may be used instead of https if required
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

            let itemInfo = value;
            let itemInfoDiv = document.createElement("div")
            itemInfoDiv.classList.add("name-item");

            let itemTitle = document.createElement("h3");
            let itemTitleNode = document.createTextNode(itemInfo.title);
            itemTitle.appendChild(itemTitleNode);
            itemTitle.classList.add("title");

            let itemType = document.createElement("h4");
            let itemTypeNode = document.createTextNode(itemInfo.type)
            itemType.appendChild(itemTypeNode);
            itemType.classList.add("type");

            let itemPlatform = document.createElement("p");
            let itemPlatformNode = document.createTextNode(itemInfo.platform);
            itemPlatform.appendChild(itemPlatformNode);
            itemPlatform.classList.add("platform");

            let itemStorefront = document.createElement("p");
            let itemStorefrontNode = document.createTextNode(itemInfo.storefront);
            itemStorefront.appendChild(itemStorefrontNode);
            itemStorefront.classList.add("storefront");

            //Sets up the basic display element
            itemInfoDiv.appendChild(itemTitle);
            itemInfoDiv.appendChild(itemType);
            itemInfoDiv.appendChild(itemPlatform);
            itemInfoDiv.appendChild(itemStorefront);

            if (itemInfo.image != null) {
                let itemImage = document.createElement("img");
                itemImage.src = itemInfo.image;
                itemImage.classList.add("image");

                itemInfoDiv.appendChild(itemImage);
            }

            collectionElement.appendChild(itemInfoDiv);
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