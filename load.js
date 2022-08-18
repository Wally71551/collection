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
        });
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