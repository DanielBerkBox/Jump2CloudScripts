// JavaScript source code

handlers.getPlayerData = function (args) {

    var playerCoins = 0;
    var playerGem = 0;
    var jgenre = 1;
    var jcolor = 1;
    var jwins = 0;
    var jheld = 0;
    var jhorsesnum = 0;

    var keysPlayerData = ["genre", "color", "wins", "held", "horsesnum"];

    var playerCurrency = server.AddUserVirtualCurrency({
        PlayFabId: currentPlayerId,
        VirtualCurrency: "GO",
        Amount : 0
        }
    )
    //if (playerCurrency.Data["Balance"]) {
    if (playerCurrency["Balance"]) {
        //log.info("Player " + currentPlayerId + " already completed level " + levelNum);
        playerCoins = playerCurrency["Balance"];
    }

    playerCurrency = server.AddUserVirtualCurrency({
        PlayFabId: currentPlayerId,
        VirtualCurrency: "GE",
        Amount: 0
    }
    )
    //if (playerCurrency.Data["Balance"]) {
    if (playerCurrency["Balance"]) {
        //log.info("Player " + currentPlayerId + " already completed level " + levelNum);
        playerGem = playerCurrency["Balance"];
    }

    var playerData = server.GetUserData(
	{
	    PlayFabId: currentPlayerId,
	    Keys: keysPlayerData
	});

    if (playerData.data["genre"])
    {
        var genreaux = playerData.Data["genre"];
        jgenre = parseInt(genreaux.Value);
    }

    if (playerData.data["color"]) {
        var jcoloraux = playerData.Data["color"];
        jcolor = parseInt(jcoloraux.Value);
    }

    if (playerData.data["wins"]) {
        var winsaux = playerData.Data["wins"];
        jwins = parseInt(winsaux.Value);
    }

    if (playerData.data["held"]) {
        var heldaux = playerData.Data["held"];
        jheld = parseInt(heldaux.Value);
    }

    if (playerData.data["horsesnum"]) {
        var horsesaux = playerData.Data["horsesnum"];
        jhorsesnum = parseInt(horsesaux.Value);
    }

    return {
        coins: playerCoins,
        gems: playerGem,
        genre: jgenre,
        color: jcolor,
        wins: jwins,
        held: jheld,
        horsesnum:jhorsesnum

    };
}