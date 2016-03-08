// JavaScript source code

handlers.getPlayerData = function (args) {

    var playerCoins = 0;
    var playerGem = 0;
    var jgender = 1;
    var jcolor = 1;
    var jwins = 0;
    var jheld = 0;
    var jhorsesnum = 0;

    var keysPlayerData = ["gender", "color", "wins", "held", "horsesnum"];

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

    if (playerData.Data) {
        if (playerData.Data["gender"]) {
            var genreaux = playerData.Data["gender"];
            jgender = parseInt(genreaux.Value);
        }

        if (playerData.Data["color"]) {
            var jcoloraux = playerData.Data["color"];
            jcolor = parseInt(jcoloraux.Value);
        }

        if (playerData.Data["wins"]) {
            var winsaux = playerData.Data["wins"];
            jwins = parseInt(winsaux.Value);
        }

        if (playerData.Data["held"]) {
            var heldaux = playerData.Data["held"];
            jheld = parseInt(heldaux.Value);
        }

        if (playerData.Data["horsesnum"]) {
            var horsesaux = playerData.Data["horsesnum"];
            jhorsesnum = parseInt(horsesaux.Value);
        }
    }
       

    return {
        coins: playerCoins,
        gems: playerGem,
        gender: jgender,
        color: jcolor,
        wins: jwins,
        held: jheld,
        horsesnum: jhorsesnum     

    };
}