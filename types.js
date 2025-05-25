function UpdateCollectionCounts(gameType) {
    collectionCount++;

    switch (gameType) {
        case "Game":
        case "Arcade Game":
        case "Collection":
        case "Modpack":
        case "Mod":
        case "Game Map":
        case "Bundle":
        case "Pinball Machine":
            gameCount++;
            break;
        case "DLC":
        case "DLC Bundle":
        case "Season Pass":
        case "Update":
        case "Game Update":
        case "Texture Pack":
        case "Demo":
        case "Skin Pack":
        case "Add-On":
        case "Expansion":
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
        case "Video":
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
        case "Story":
        case "Short Story":
            bookCount++;
            break;
        case "Album":
        case "Soundtrack":
        case "Concert":
        case "Track":
        case "Single":
        case "EP":
        case "LP":
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
        case "Card":
        case "Trading Card":
        case "Trading Card Collection":
        case "Collectible Card":
        case "Collectible Card Set":
        case "Trading Card Game":
        case "Trading Card Game Set":
        case "Trading Card Game Deck":
        case "Trading Card Game Expansion":
        case "Trading Card Game Opus":
        case "Pokémon TCG Card":
        case "Pokémon TCG Expansion":
        case "Pokémon TCG Collection":
        case "Pokémon TCG Deck":
        case "Pokémon TCG Portfolio":
        case "Pokémon TCG Collector's Album":
        case "Pokémon TCG Mini Binder":
        case "Pokémon TCG Bundle":
        case "Pokémon TCG Tin":
        case "Pokémon TCG Elite Trainer Box":
        case "Jumbo Pokémon TCG Card":
        case "Pin":
        case "Pin Set":
        case "Medal":
        case "Diorama":
        case "LEGO Set":
        case "LEGO Polybag Set":
        case "MEGA Set":
        case "K'NEX Set":
        case "HOT WHEELS Car":
        case "Toy Car":
        case "Steelbook":
        case "Coaster Set":
        case "Art Card Set":
        case "Keychain":
        case "Keyring":
        case "Calendar":
        case "Magnet Set":
        case "Plush":
        case "Coin":
        case "Collectible Coin":
        case "T-Shirt":
        default:
            collectibleCount++;
            break;
        case "Application":
        case "Theme Park Attraction":
        case "Rollercoaster":
            miscellaneousCount++;
            break;
    }
}

function GetTypeIcon(itemType) {
    switch (itemType) {
        case "Game":
        case "Modpack":
        case "Controller":
            return "icons/game.svg";
        case "Arcade Game":
            return "icons/joystick.svg";
        case "DLC":
        case "DLC Bundle":
        case "Update":
        case "Game Update":
        case "Demo":
        case "Application":
        case "Skin Pack":
        case "Goodie Pack":
        case "Add-On":
        case "Expansion":
        case "Season Pass":
        case "Texture Pack":
        case "Mod":
        case "Game Map":
            return "icons/dlc.svg";
        case "Film":
        case "Short Film":
        case "Animated Short":
        case "Special Episode":
        case "OVA":
        case "Serial Reconstruction":
        case "Video":
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
        case "Story":
        case "Short Story":
            return "icons/book.svg";
        case "Album":
        case "Single":
        case "Soundtrack":
        case "Concert":
        case "Audiobook":
        case "Audio Drama":
        case "Track":
        case "EP":
        case "LP":
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
        case "Diorama":
        case "LEGO Set":
        case "LEGO Polybag Set":
        case "K'NEX Set":
        case "MEGA Set":
        case "Calendar":
        case "Magnet Set":
        case "Plush":
        case "Pokémon TCG Elite Trainer Box":
        default:
            return "icons/cube.svg";
        case "Minecraft Dungeons Arcade Card":
        case "amiibo Card":
        case "Poster":
        case "Card":
        case "Trading Card":
        case "Trading Card Collection":
        case "Collectible Card":
        case "Collectible Card Set":
        case "Trading Card Game":
        case "Trading Card Game Set":
        case "Trading Card Game Deck":
        case "Trading Card Game Expansion":
        case "Trading Card Game Opus":
        case "Pokémon TCG Card":
        case "Pokémon TCG Expansion":
        case "Pokémon TCG Collection":
        case "Pokémon TCG Deck":
        case "Pokémon TCG Portfolio":
        case "Pokémon TCG Collector's Album":
        case "Pokémon TCG Mini Binder":
        case "Pokémon TCG Bundle":
        case "Pokémon TCG Tin":
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
        case "Tamagotchi":
        case "Coin":
        case "Collectible Coin":
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
    switch (itemType) {
        case "Game":
        case "Arcade Game":
        case "Collection":
        case "Modpack":
        case "Mod":
        case "Bundle":
        case "Pinball Machine":
        case "Game Map":
        default:
            return ("Game");
        case "DLC":
        case "DLC Bundle":
        case "Season Pass":
        case "Update":
        case "Game Update":
        case "Texture Pack":
        case "Demo":
        case "Skin Pack":
        case "Add-On":
        case "Expansion":
            return ("DLC");
        case "Film":
        case "Short Film":
        case "Film Box Set":
        case "Film Collection":
        case "Animated Short":
        case "Special Episode":
        case "OVA":
        case "Serial Reconstruction":
        case "Video":
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
        case "Story":
        case "Short Story":
            return ("Book");
        case "Album":
        case "Soundtrack":
        case "Concert":
        case "Track":
        case "Single":
        case "EP":
        case "LP":
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
        case "Card":
        case "Trading Card":
        case "Trading Card Collection":
        case "Collectible Card":
        case "Collectible Card Set":
        case "Trading Card Game":
        case "Trading Card Game Set":
        case "Trading Card Game Deck":
        case "Trading Card Game Expansion":
        case "Trading Card Game Opus":
        case "Pokémon TCG Card":
        case "Pokémon TCG Expansion":
        case "Pokémon TCG Collection":
        case "Pokémon TCG Deck":
        case "Pokémon TCG Portfolio":
        case "Pokémon TCG Collector's Album":
        case "Pokémon TCG Mini Binder":
        case "Pokémon TCG Bundle":
        case "Pokémon TCG Tin":
        case "Pokémon TCG Elite Trainer Box":
        case "Jumbo Pokémon TCG Card":
        case "Pin":
        case "Pin Set":
        case "Medal":
        case "Diorama":
        case "LEGO Set":
        case "LEGO Polybag Set":
        case "MEGA Set":
        case "K'NEX Set":
        case "HOT WHEELS Car":
        case "Toy Car":
        case "Steelbook":
        case "Coaster Set":
        case "Art Card Set":
        case "Keychain":
        case "Keyring":
        case "Calendar":
        case "Magnet Set":
        case "Plush":
        case "Coin":
        case "Collectible Coin":
        case "T-Shirt":
            return ("Collectible");
        case "Theme Park Attraction":
        case "Rollercoaster":
        case "Application":
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
                    return "Repeat";
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
                    return "Done";
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