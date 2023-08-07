let collectionElement = document.getElementById("collection");
let loaderElement = document.getElementById("loader");
let errorElement = document.getElementById("error");


Load();

function Load() {
    let searchURL = "https://sheetlabs.com/W751/BookCollection";
    LoadedState(true);

    //Gets the url and searches the array
    $.ajax({
        url: searchURL,
        crossDomain: true,
    })
        .done(function (data) {
            if (data.length == 0) {
                Error();
                return;
            }

            $.each(data, function (key, value) {
                CreateElement(value);
            });

            LoadedState(false);
        })
        .fail(function () {
            console.log("Failed");
            Error();
        });
}

const State = {
    Have: 0,
    DontHave: 1,
    Block: 2
}

class SingularBook {
    constructor(name, state) {
        this.name = name;
        this.state = state;
    }
}

function CreateElement(value) {
    let itemInfo = document.createElement("li");
    itemInfo.classList.add("book-item");
    let title = value.series;

    //Filters the full series data into individual books
    let fullSeries = value.books.split("||");
    let sanitisedFullSeries = [];

    for (let i = 0; i < fullSeries.length; i++) {
        if (/[-]/.test(fullSeries[i]) && /^[\d+-]*\d+$/.test(fullSeries[i])) {
            let twoNumbers = fullSeries[i].split("-");
            for (let i = twoNumbers[0]; i <= twoNumbers[1]; i++) {
                sanitisedFullSeries.push(String(i));
            }
        }
        else {
            sanitisedFullSeries.push(fullSeries[i]);
        }
    }

    console.log(sanitisedFullSeries);

    //Filter obtained books same way
    let obtained = value.obtained.split("||");
    let sanitisedObtained = [];

    for (let i = 0; i < obtained.length; i++) {
        if (/(-)/.test(obtained[i]) && /^(\d+-)*\d+$/.test(obtained[i])) {
            let twoNumbers = obtained[i].split("-");
            for (let i = twoNumbers[0]; i <= twoNumbers[1]; i++) {
                sanitisedObtained.push(String(i));
            }
        }
        else {
            sanitisedObtained.push(obtained[i]);
        }
    }

    console.log(sanitisedObtained);

    //Create the final book array
    let finalList = [];
    for (let i = 0; i < sanitisedFullSeries.length; i++) {
        if (sanitisedObtained.includes(sanitisedFullSeries[i])) {
            finalList.push(
                new SingularBook(sanitisedFullSeries[i], State.Have)
            );
        }
        else {
            finalList.push(
                new SingularBook(sanitisedFullSeries[i], State.DontHave)
            );
        }
    }

    //Create display element
    let seriesTitle = document.createElement("h1");
    seriesTitle.classList.add("book-title");
    let seriesTitleNode = document.createTextNode(title);
    seriesTitle.appendChild(seriesTitleNode);

    let bookListDiv = document.createElement("div");
    bookListDiv.classList.add("book-list-div");

    //Search titles to see what style needs to be set
    let namedTitles = false;
    for (let i = 0; i < finalList.length; i++) {
        if (finalList[i].name.length > 4) {
            namedTitles = true;
            bookListDiv.classList.add("book-list-div-long");
            break;
        }
    }

    //Set style
    for (let i = 0; i < finalList.length; i++)
    {
        let singleBookDiv = document.createElement("li");

        if (!namedTitles) {
            singleBookDiv.classList.add("single-book-div-wrapper");
        }
        else {
            singleBookDiv.classList.add("single-book-div-wrapper-long");
        }

        let singleBookIcon = document.createElement("img");
        singleBookIcon.classList.add("single-book-icon");
        

        if (finalList[i].state == State.Have) {
            singleBookIcon.src = "icons/book_filled.png";
        }
        else if (finalList[i].state == State.DontHave) {
            singleBookIcon.src = "icons/book_empty.png";
        }
        else {
            singleBookIcon.src = "icons/book_empty.png";
        }

        //Create individual list element (normal)
        if (!namedTitles) {
            let singleBook = document.createElement("figure");
            singleBook.classList.add("single-book-figure");

            let singleBookTitle = document.createElement("figcaption");
            singleBookTitle.classList.add("single-book-text");
            let singleBookTitleNode = document.createTextNode(finalList[i].name);
            singleBookTitle.appendChild(singleBookTitleNode);

            singleBook.appendChild(singleBookIcon);
            singleBook.appendChild(singleBookTitle);
            singleBookDiv.appendChild(singleBook);
            bookListDiv.appendChild(singleBookDiv);
        }
        //Create individual list element (long book titles)
        else {
            let singleBook = document.createElement("div");
            singleBook.classList.add("single-book-long-div");

            let singleBookTitle = document.createElement("p");
            singleBookTitle.classList.add("single-book-text");
            let singleBookTitleNode = document.createTextNode(finalList[i].name);
            singleBookTitle.appendChild(singleBookTitleNode);

            singleBook.appendChild(singleBookIcon);
            singleBook.appendChild(singleBookTitle);
            singleBookDiv.appendChild(singleBook);
            bookListDiv.appendChild(singleBookDiv);
        }
    }

    itemInfo.appendChild(seriesTitle);
    itemInfo.appendChild(bookListDiv);

    collectionElement.appendChild(itemInfo);
}

function Error() {
    //Show error
}

function LoadedState(isLoading) {
    if (isLoading) {
        loaderElement.style.display = "block";
        collectionElement.style.display = "none";
        errorElement.style.display = "none";
    }
    else {
        loaderElement.style.display = "none";
        collectionElement.style.display = "block";
        errorElement.style.display = "none";
    }
}