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

function GetTypeCategory(itemType) {
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
            return ("Game");
        case "DLC":
        case "DLC Bundle":
        case "Season Pass":
        case "Game Update":
        case "Texture Pack":
        case "Demo":
        case "Skin Pack":
            return ("DLC");
        case "Film":
        case "Short Film":
        case "Film Box Set":
        case "Film Collection":
        case "Animated Short":
        case "Special Episode":
        case "OVA":
        case "Serial Reconstruction":
            return ("Film");
        case "Series":
        case "Animated Series":
        case "Animated Shorts":
        case "Web Series":
        case "Anime":
        case "Short Series":
        case "Series Box Set":
        case "Series Collection":
        case "Serial":
            return ("Series");
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
            return ("Book");
        case "Album":
        case "Soundtrack":
        case "Concert":
        case "Track":
        case "Single":
        case "2-Disc CD Collection":
            return ("Album");
        case "Console":
            return ("Console");
        case "Peripheral":
        case "Controller":
            return ("Peripheral");
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
            return ("Collectible");
        case "Theme Park Attraction":
        case "Rollercoaster":
            return ("Miscellaneous");
    }
}

function GetCategoryNames(category, itemType) {
    switch (category) {
        case "Playing":
            switch (itemType) {
                case "Game":
                default:
                case "DLC":
                case "Miscellaneous":
                case "Console":
                    return "Playing";
                case "Film":
                case "Series":
                    return "Watching";
                case "Book":
                    return "Reading";
                case "Album":
                    return "Listening";
                case "Peripheral":
                    return "Using";
                case "Collectible":
                    return "Collecting";
            }
        case "Backlog":
        default:
            return "Backlog";
        case "Unplayed":
            switch (itemType) {
                case "Game":
                default:
                case "DLC":
                case "Console":
                    return "Unplayed";
                case "Film":
                case "Series":
                    return "Unwatched";
                case "Book":
                    return "Unread";
                case "Album":
                    return "Unlistened";
                case "Peripheral":
                case "Collectible":
                    return "Unused";
                case "Miscellaneous":
                    return "Unplayed";
            }
        case "Replay":
            switch (itemType) {
                case "Game":
                default:
                case "DLC":
                    return "Replay";
                case "Film":
                case "Series":
                    return "Rewatch";
                case "Book":
                    return "Reread";
                case "Album":
                    return "Relisten";
                case "Console":
                    return "Replay";
                case "Peripheral":
                    return "Reuse";
                case "Collectible":
                    return "Reuse";
                case "Miscellaneous":
                    return "Reuse";
            }
        case "Retired":
            switch (itemType) {
                case "Game":
                default:
                case "DLC":
                case "Console":
                    return "Retired";
                case "Film":
                case "Series":
                case "Book":
                case "Album":
                case "Peripheral":
                case "Collectible":
                case "Miscellaneous":
                    return "Stopped";
            }
        case "Beaten":
            switch (itemType) {
                case "Game":
                default:
                case "DLC":
                    return "Beaten";
                case "Film":
                case "Series":
                    return "Watched";
                case "Book":
                    return "Read";
                case "Album":
                    return "Listened";
                case "Console":
                    return "Played";
                case "Peripheral":
                    return "Used";
                case "Collectible":
                    return "Used";
                case "Miscellaneous":
                    return "Used";
            }
        case "Completed":
            switch (itemType) {
                case "Game":
                default:
                case "DLC":
                    return "Completed";
                case "Film":
                    return "Watched";
                case "Series":
                    return "Finished";
                case "Book":
                    return "Read";
                case "Album":
                    return "Listened";
                case "Console":
                    return "Finished";
                case "Peripheral":
                    return "Completed";
                case "Collectible":
                    return "Completed";
                case "Miscellaneous":
                    return "Completed";
            }
        case "Null":
            return "Null";
    }
}