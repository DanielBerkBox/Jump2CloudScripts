// JavaScript source code

handlers.getPlayerData = function (args) {

    var playerCoins = 0;
    var playerCurrency = server.AddUserVirtualCurrency({
        PlayFabId: currentPlayerId,
        VirtualCurrency: "GO",
        Amount : 1
        }
    )

    /*if (playerCurrency.Data["Balance"]) {
        //log.info("Player " + currentPlayerId + " already completed level " + levelNum);
        playerCoins = playerCurrency.Data["Balance"];
    }*/

    return {
        coins: playerCurrency
    };
}