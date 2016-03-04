// JavaScript source code

handlers.getPlayerData = function (args) {

    var playerCoins = 0;
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

    return {
        coins: playerCoins
    };
}