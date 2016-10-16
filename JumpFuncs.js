// JavaScript source code
var MIN_ATTR = 60;
var MAX_ATTR = 100;
var GROOMIN_LOSE = 2;
var GROOMIN_INC = 2;
var FOOD_LOSE = 2;
var FOOD_INC_1 = 3;
var FOOD_INC_2 = 5;
var FOOD_INC_3 = 7;
var FOOD_COINS_2 = 20;
var FOOD_GEM_2 = 0;
var FOOD_COINS_3 = 40;
var FOOD_GEM_3 = 3;
var COND_LIMIT_MIN = 70;
var COND_LIMIT1 = 80;
var COND_LIMIT2 = 85;
var COND_LIMIT3 = 90;
var GEM_PER_WIN = 5;
var GEM_PER_2ND = 3;
var GEM_PER_3ND = 1;


handlers.getPlayerData = function (args) {

    var playerCoins = 0;
    var playerGem = 0;
    var jgender = 1;
    var jcolor = 1;
    var jwins = 0;
    var jheld = 0;
    var jhorsesnum = 0;

    var keysPlayerData = ["gender", "color", "wins", "held", "horsesnum"];

    var playerCurrency = GetPlayerCurrency();
    if (playerCurrency)
    {
        playerCoins = playerCurrency.playerCoins;
        playerGem = playerCurrency.playerGem;
    }
    /*var playerCurrency = server.AddUserVirtualCurrency({
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
    }*/

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
        horsesnum: jhorsesnum,
        aGROOMIN_LOSE: GROOMIN_LOSE,
        aGROOMIN_INC:  GROOMIN_INC,
        aFOOD_LOSE: FOOD_LOSE,
        aFOOD_INC_1: FOOD_INC_1,
        aFOOD_INC_2: FOOD_INC_2,
        aFOOD_INC_3: FOOD_INC_3,
        aFOOD_COINS_2: FOOD_COINS_2,
        aFOOD_GEM_2: FOOD_GEM_2,
        aFOOD_COINS_3: FOOD_COINS_3,
        aFOOD_GEM_3: FOOD_GEM_3,
        aCOND_LIMIT_MIN: COND_LIMIT_MIN,
        aCOND_LIMIT1: COND_LIMIT1,
        aCOND_LIMIT2: COND_LIMIT2,
        aCOND_LIMIT3: COND_LIMIT3
   
        
    };
}

// retorna dados extendidos (horsesids,time server)
handlers.getPlayerDataExt = function (args) {

    var now = new Date();
    var keysPlayerData = ["horsesids"];
    var jhorsesids = "0";   

    var playerData = server.GetUserData(
    {
        PlayFabId: currentPlayerId,
        Keys: keysPlayerData
    });

    if (playerData.Data) {

        if (playerData.Data["horsesids"]) {
            var horsesidsaux = playerData.Data["horsesids"];
            jhorsesids = horsesidsaux.Value;
            
        }
    }   

    return {
        horsesids: jhorsesids,
        year: now.getFullYear().toString(),
        month: now.getMonth().toString(),
        day: now.getDate().toString(),
        hours: now.getHours().toString(),
        minuts: now.getMinutes().toString(),
        seconds: now.getSeconds().toString()
        
    };
}

handlers.getHorseData = function (args) {

    var horseid = args.horseid;
    var keysPlayerData = ["horseid_" + horseid.toString(), "horseitems_" + horseid.toString()];
    var lhorsedata = "0";
    var lhorseitems = "0";
    var playerData = server.GetUserData(
   {
       PlayFabId: currentPlayerId,
       Keys: keysPlayerData
   });

    if (playerData.Data) {

        if (playerData.Data["horseid_" + horseid.toString()]) {
            var horsesdatasaux = playerData.Data["horseid_" + horseid.toString()];
            lhorsedata = horsesdatasaux.Value;

        }
        if (playerData.Data["horseitems_" + horseid.toString()]) {
            var horsesitemsaux = playerData.Data["horseitems_" + horseid.toString()];
            lhorseitems = horsesitemsaux.Value;

        }
    }

    return {

        horsedata: lhorsedata,
        horseitems:lhorseitems
       
    };

}
handlers.buyHorse = function (args) {

    return DoBuy(args);    

}

handlers.grooming = function(args) 
{
    var horseid = args.horseid;
    var now = new Date();
    var keysPlayerData = ["horseid_" + horseid.toString()];
    var lhorsedataStr = "0";

    var playerData = server.GetUserData(
    {
      PlayFabId: currentPlayerId,
      Keys: keysPlayerData
    });
    if (playerData.Data) {

        if (playerData.Data["horseid_" + horseid.toString()]) {
            var horsesdatasaux = playerData.Data["horseid_" + horseid.toString()];
            lhorsedataStr = horsesdatasaux.Value;
        }
       
    }

    if (lhorsedataStr == "0") {
        return {

            ret: "-1",
            horsedata:""
        }
    }

    var lhorsedata = GetHorseDataFromString(lhorsedataStr);
    var daysdif = DaysBetween(lhorsedata.grooDate, now);
    // primeira vez.
    if (daysdif > 9999)
        daysdif = 1;

    if (daysdif <= 0) {

        return { ret: "-4", coins: "0", gems: "0", horsedata: "" }
    }

    //var lattr = lhorsedata.confidence - (daysdif * GROOMIN_LOSE) + GROOMIN_INC;
    var lattr = lhorsedata.confidence - (daysdif * GROOMIN_LOSE);
    if (lattr < COND_LIMIT_MIN)
        lattr = COND_LIMIT_MIN;

    lattr = lattr + GROOMIN_INC;
    if (lattr > MAX_ATTR)
        lattr = MAX_ATTR;

    lhorsedata.grooDate = now;
    lhorsedata.confidence = lattr;

    var dataux = {};
    var keyaux = "horseid_" + lhorsedata.id;
    lhorsedataStr = GetHorseString(lhorsedata);
    dataux[keyaux] = lhorsedataStr;

    server.UpdateUserData({

        PlayFabId: currentPlayerId,
        "Data": dataux,
        "Permission": "Public"
    });

    return {

        ret: "1",
        horsedata: lhorsedataStr,
        year: now.getFullYear().toString(),
        month: now.getMonth().toString(),
        day: now.getDate().toString(),
        hours: now.getHours().toString(),
        minuts: now.getMinutes().toString(),
        seconds: now.getSeconds().toString()

    }


}

handlers.feeding = function (args) {
    var horseid = args.horseid;
    var now = new Date();
    var keysPlayerData = ["horseid_" + horseid.toString()];
    var lhorsedataStr = "0";
    var lfoodinc = FOOD_INC_1;
    var lfoodcoins = 0;
    var lfoodgem = 0;

    var lcondmax = COND_LIMIT1;


    if (args.food == 2) {
        lfoodinc = FOOD_INC_2;
        lfoodcoins = FOOD_COINS_2;
        lfoodgem = FOOD_GEM_2;
        lcondmax = COND_LIMIT2;
    }
    if (args.food == 3) {
        lfoodinc = FOOD_INC_3;
        lfoodcoins = FOOD_COINS_3;
        lfoodgem = FOOD_GEM_3;
        lcondmax = COND_LIMIT3;
    }


    var playerData = server.GetUserData(
    {
        PlayFabId: currentPlayerId,
        Keys: keysPlayerData
    });
    if (playerData.Data) {

        if (playerData.Data["horseid_" + horseid.toString()]) {
            var horsesdatasaux = playerData.Data["horseid_" + horseid.toString()];
            lhorsedataStr = horsesdatasaux.Value;
        }

    }

    if (lhorsedataStr == "0") {
        return {

            ret: "-1",
            coins: "",
            gems:"",
            horsedata: ""
        }
    }
      
    var lhorsedata = GetHorseDataFromString(lhorsedataStr);
    var daysdif = DaysBetween(lhorsedata.ateDate, now);
    //log.info(" daysdif : " + daysdif.toString() + " now:" + now.toDateString() + " ateDate:" + lhorsedata.ateDate.toDateString());
    // primeira vez.
    if (daysdif > 9999)
        daysdif = 1;

    if (daysdif <= 0) {

        return { ret: "-4", coins: "0", gems: "0", horsedata:""}
    }

    //var lattr = parseInt(lhorsedata.condition) - (daysdif * FOOD_LOSE) + lfoodinc;
    var lattr = parseInt(lhorsedata.condition) - (daysdif * FOOD_LOSE);
    //log.info(" daysdif : " + daysdif.toString() + "lhorsedata.condition " + lhorsedata.condition.toString());
    //log.info(" lattr : " + lattr.toString() + " lfoodinc " + lfoodinc.toString());
    if (lattr < COND_LIMIT_MIN)
        lattr = COND_LIMIT_MIN;

    lattr = lattr + lfoodinc;
    if (lattr > lcondmax)
        lattr = lcondmax;

    lhorsedata.ateDate = now;
    lhorsedata.condition = lattr.toString();
    //log.info(" lattr : " + lattr.toString() + " lfoodinc " + lfoodinc.toString() + " ateDate:" + lhorsedata.ateDate.toDateString());

    var dataux = {};
    var keyaux = "horseid_" + lhorsedata.id;
    lhorsedataStr = GetHorseString(lhorsedata);
    dataux[keyaux] = lhorsedataStr;

    var playerCash = GetPlayerCurrency();

    if (lfoodcoins > 0) {
        
        if (lfoodcoins > playerCash.playerCoins) {

            return { ret: "-3", coins: playerCash.playerCoins.toString(), gems: playerCash.playerGem.toString(), horsedata:""}
        }

        var playerCurrency = server.SubtractUserVirtualCurrency({
            PlayFabId: currentPlayerId,
            VirtualCurrency: "GO",
            Amount: lfoodcoins

        }
        );
        playerCash.playerCoins = playerCurrency.Balance;       

    }

    if (lfoodgem > 0) {

        if (lfoodgem > playerCash.playerGem) {

            return { ret: "-2", coins: playerCash.playerCoins.toString(), gems: playerCash.playerGem.toString(), horsedata:"0" }
        }
        var playerCurrency = server.SubtractUserVirtualCurrency({
            PlayFabId: currentPlayerId,
            VirtualCurrency: "GE",
            Amount: lfoodgem

        }
       );
        playerCash.playerGem = playerCurrency.Balance;
       
    }
    server.UpdateUserData({

        PlayFabId: currentPlayerId,
        "Data": dataux,
        "Permission": "Public"
    });

    return {

        ret: "1",
        coins: playerCash.playerCoins.toString(),
        gems: playerCash.playerGem.toString(),
        horsedata: lhorsedataStr,
        year: now.getFullYear().toString(),
        month: now.getMonth().toString(),
        day: now.getDate().toString(),
        hours: now.getHours().toString(),
        minuts: now.getMinutes().toString(),
        seconds: now.getSeconds().toString()

    }


}

handlers.breeding = function (args) 
{
    var marestr = args.marestr;
    var stallionstr = args.stallionstr;
    var lidMare = args.idmare;
    var lidStallion = args.idstallion;   
    var lname = args.name;
    var lcoins = args.coins;
    var lgems = args.gems;

    //var marestr ;
    //var stallionstr;

    //log.info("  ***** BREEDING *****  : " + args.name); 

    /*return {
            ret: "-5",
            horsedata: "0",
            playercoins: "0", 
            playergems: "0"
        }
    */

    var keysPlayerData = ["horseid_" + lidMare.toString(), "horseid_" + lidStallion.toString(), "breedid", "horsesnum"];    
    var lbreedid = "1000";
    var jhorsesnum = 0;   

    
    var playerData = server.GetUserData(
   {
       PlayFabId: currentPlayerId,
       Keys: keysPlayerData
   });
    if (playerData.Data) {
               
        if (playerData.Data["horsesnum"]) {
            var horsesnumaux = playerData.Data["horsesnum"];
            jhorsesnum = parseInt(horsesnumaux.Value);
        }
        if (playerData.Data["breedid"]) {
            var lbaux = playerData.Data["breedid"];
            lbreedid = lbaux.Value;
            var lbreedidInt = parseInt(lbreedid);
            lbreedidInt = lbreedidInt + 1;
            lbreedid = lbreedidInt.toString();

        }
        if (playerData.Data["horseid_" + lidMare.toString()]) {

            marestr = playerData.Data["horseid_" + lidMare.toString()].Value;
        }
        if (playerData.Data["horseid_" + lidStallion.toString()]) {

            stallionstr = playerData.Data["horseid_" + lidStallion.toString()].Value;
        }

    }
  
    //log.info("  stallionstr " + stallionstr );
    var lhorsedataStallion = GetHorseDataFromString(stallionstr);
    //log.info("  marestr " + marestr);
    var lhorsedataMare = GetHorseDataFromString(marestr);
    //log.info("  lhorsedataMare" + lhorsedataMare);
    //log.info("  lhorsedataStallion" + lhorsedataStallion);
    //log.info("  Stattlion and mare id:" + lhorsedataStallion.id + "," + lhorsedataMare.id);
    if ((lhorsedataStallion.id == "0") || (lhorsedataMare.id == "0")) {

        return {
            ret: "-3",
            horsedata: "0",
            playercoins: "0",
            playergems: "0"
        }
    }

    //log.info(" Stattlion id:"  +lhorsedataStallion.id);

    var breeddata = DoBreed(marestr, stallionstr);
    
    breeddata.id = lbreedid;
    breeddata.coinsPrice = lcoins;
    breeddata.gemsPrice = lgems;
    breeddata.name = lname;
    //log.info(" breed ret: id:" + breeddata.id);
    var argbuy = {};
    argbuy["strhorse"] = GetHorseString(breeddata);
    argbuy["stritem"] = "0";
    //log.info(" breed sthorse:" + argbuy["strhorse"]);
    var retbuy = DoBuy(argbuy);
    //log.info(" breed sthorse 2:" + argbuy["strhorse"]);
    retbuy["horsedata"] = argbuy["strhorse"];
    

   // log.info(" Stattlion id:" + retbuy["horsedata"]);
    return retbuy;

}

handlers.buyitem = function (args) {

    var itemid = args.itemid;
    var horseid = args.horseid;
    var itemcoins = args.itemcoins;
    var itemgems = args.itemgems;
    var playerCash = GetPlayerCurrency();
    var keysPlayerData = ["horseid_" + horseid.toString(), "horseitems_" + horseid.toString()];

    var lhorsedata = "0";
    var lhorseitems = "0";
    var itemsList = [];
    var playerData = server.GetUserData(
   {
       PlayFabId: currentPlayerId,
       Keys: keysPlayerData
   });

    if (playerData.Data) {

        if (playerData.Data["horseid_" + horseid.toString()]) {
            var horsesdatasaux = playerData.Data["horseid_" + horseid.toString()];
            lhorsedata = horsesdatasaux.Value;

        }
        if (playerData.Data["horseitems_" + horseid.toString()]) {
            var horsesitemsaux = playerData.Data["horseitems_" + horseid.toString()];
            lhorseitems = horsesitemsaux.Value;

        }
    }
   
    
    if (lhorsedata == "0") {
        return {
            ret: "-1",
            msg: "Horse not found"
        }
    }
    //log.info(" ITEM: " + itemid + " HORSE " + horseid + " itens: " + lhorseitems );
    
    if(lhorseitems != "0")
        itemsList = GetHorseItemFromString(lhorseitems);
   
   // log.info(" ITEM: " + itemid + " HORSE " + horseid + " itens: " + lhorseitems + " itemsList len: " + itemsList.length.toString());
   
    for (var i in itemsList) {
        var itaux = itemsList[i];
        if(itaux == itemid) // horse ja tem o item
        {
            return {
                ret: "-2",
                msg: "Horse already has the item."
            }
        }
    }
    
    itemsList.push(itemid);
   // log.info(" itemsList len 2: " + itemsList.length.toString());
   
    if (parseInt(itemcoins) > playerCash.playerCoins) {
        return {

            ret: "-3",
            msg: "You do not have enough coins."
        }
    }
    if (parseInt(itemgems) > playerCash.playerGem) {
        return {

            ret: "-3",
            msg: "You do not have enough gems."
        }
    }
    lhorseitems = GetHorseItemString(itemsList);
    
    var dataux = {};
  

    keyaux = "horseitems_" + horseid
    dataux[keyaux] = lhorseitems;  

    //teste
    //return { ret: "-5" , horsesitems:lhorseitems }

    server.UpdateUserData({

        PlayFabId: currentPlayerId,
        "Data": dataux,
        "Permission": "Public"
    });   

    var playerCurrency = server.SubtractUserVirtualCurrency({
        PlayFabId: currentPlayerId,
        VirtualCurrency: "GO",
        Amount: parseInt(itemcoins)

    }
    );
    
    if (parseInt(itemgems) > 0) {
        var playerCurrency = server.SubtractUserVirtualCurrency({
            PlayFabId: currentPlayerId,
            VirtualCurrency: "GE",
            Amount: parseInt(itemgems)

        }
       );
    }
    
    return {

        ret: "1",
        horseid: horseid,
        itemid: itemid
    }    


}

handlers.sellHorse = function (args)
{
    var strhorse = args.strhorse;    
    var horsedata = GetHorseDataFromString(strhorse);
    var keysPlayerData = ["horsesnum", "horsesids"];    
    var keysToDel = ["horseid_" + horsedata.id, "horseitems_" + horsedata.id];
    var jhorsesnum = 0;
    var jhorsesids = [];
    var playerData = server.GetUserData(
   {
       PlayFabId: currentPlayerId,
       Keys: keysPlayerData
   });
    if (playerData.Data) {

        if (playerData.Data["horsesnum"]) {
            var horsesaux = playerData.Data["horsesnum"];
            jhorsesnum = parseInt(horsesaux.Value);
        }
        if (playerData.Data["horsesids"]) {
            var horsesidsaux = playerData.Data["horsesids"];
            var straux = horsesidsaux.Value;
            jhorsesids = GetHorseIdsFromString(straux);
        }
    }
    if (jhorsesnum < 2) {

        return {
            ret: "-1"
        }
    }

    var idxtoDel = -1;
    for (var i in jhorsesids) {
        var idaux = jhorsesids[i];
        // cavalo já pertenco ao player
        if (idaux == horsedata.id) {
            idxtoDel = i;
        }
    }
    if (idxtoDel >= 0) {
        jhorsesids.splice(idxtoDel, 1);
        jhorsesnum--;
    }
    else {
        return {ret:"-2"}
    }
    var lcoins = parseInt(horsedata.coinsPrice) / 2;
    var lgems = parseInt(horsedata.gemsPrice) / 2;

    var dataux = {};       
    dataux["horsesnum"] = jhorsesnum.toString();
    dataux["horsesids"] = GetHorseIdsString(jhorsesids);

    server.UpdateUserData({

        PlayFabId: currentPlayerId,
        "Data": dataux,
        "KeysToRemove": keysToDel,        
        "Permission": "Public"
    });
    var playerCurrency = server.AddUserVirtualCurrency({
        PlayFabId: currentPlayerId,
        VirtualCurrency: "GO",
        Amount: lcoins.toString()

    }
    );
    //log.info("log gemsPrice " + horsedata.id + " | " + horsedata.gemsPrice.toString() + "| " + dataux["horsesids"] + " | " + jhorsesids.length.toString());
    if (horsedata.gemsPrice > 0) {
        var playerCurrency = server.AddUserVirtualCurrency({
            PlayFabId: currentPlayerId,
            VirtualCurrency: "GE",
            Amount: lgems.toString()

        }
       );
    }

    return {

        ret: "1"
        
    }

}

handlers.raceDone = function (args) {
        
    log.info(" racedone 0.10");
    var lcost = parseInt(args.cost);
    log.info(" racedone 0.2");
    var lcoinsprize = parseInt(args.prize);
    log.info(" racedone 0.3");
    var lplace = parseInt(args.place);
    log.info(" racedone 0.4");
    var lgemPrize = 0;//parseInt(GEM_PER_WIN.toString());
    var keysPlayerData = ["wins", "held"];
    log.info(" racedone 0.5");
    var jwins = 0;
    var jheld = 0;
    var jsaldo = lcoinsprize - lcost;

    log.info(" racedone 1");
    var playerData = server.GetUserData(
    {
       PlayFabId: currentPlayerId,
       Keys: keysPlayerData
    });

    if (playerData.Data) {        

        if (playerData.Data["wins"]) {
            var winsaux = playerData.Data["wins"];
            jwins = parseInt(winsaux.Value);
        }

        if (playerData.Data["held"]) {
            var heldaux = playerData.Data["held"];
            jheld = parseInt(heldaux.Value);
        }
        
    }
    log.info(" racedone 2");
    log.info(" racedone lplace  =" + lplace.toString());
    if (lplace == 1) {
        lgemPrize = parseInt(GEM_PER_WIN.toString());//lgemPrize = 0;
        jwins++;
    }
    else
    if (lplace == 2) {
        lgemPrize = parseInt(GEM_PER_2ND.toString());
    }
    else
    if (lplace == 3) {
        lgemPrize = parseInt(GEM_PER_3ND.toString());
    }

    jheld++;
    log.info(" racedone 2.1");
    var playerCurrency;
    if (jsaldo > 0) {

        log.info(" racedone saldo:" + jsaldo.toString());
        playerCurrency = server.AddUserVirtualCurrency({
            PlayFabId: currentPlayerId,
            VirtualCurrency: "GO",
            Amount: jsaldo.toString()

        }
        );
    }
    else
    if (jsaldo < 0) {

        log.info(" racedone saldo negativo:" + jsaldo.toString());
        log.info(" racedone saldo negativo");
        jsaldo = jsaldo * (-1);
        playerCurrency = server.SubtractUserVirtualCurrency({
            PlayFabId: currentPlayerId,
            VirtualCurrency: "GO",
            Amount: jsaldo.toString()

        }
       );
    }
    //log.info(" racedone 3");
    if (lgemPrize > 0) {
             playerCurrency = server.AddUserVirtualCurrency({
            PlayFabId: currentPlayerId,
            VirtualCurrency: "GE",
            Amount: lgemPrize.toString()

        }
       );
    }
    var dataux = {};  
    dataux["wins"] = jwins.toString();
    dataux["held"] = jheld.toString();
    server.UpdateUserData({

        PlayFabId: currentPlayerId,
        "Data": dataux,
        "Permission": "Public"
    });

    log.info(" racedone 4");
    // statistics
    var playerStats = server.GetPlayerStatistics({
        PlayFabId: currentPlayerId
    }).Statistics;

    var lcoinsScore = { StatisticName: "coinsScore", Value: lcoinsprize };
    if (playerStats) {
        for (i = 0; i < playerStats.length; ++i) {
            if (playerStats[i].StatisticName == "coinsScore") {
                lcoinsScore.Value = playerStats[i].Value + lcoinsprize;
            }
        }
    }
    log.info(" racedone 5");
    server.UpdatePlayerStatistics({
        PlayFabId: currentPlayerId,
        Statistics: [lcoinsScore]
    });

    log.info(" racedone 6");
    return {
        ret: "1",
        saldo: jsaldo.toString(),
        gem: lgemPrize.toString()

    }
    

}

function GetPlayerCurrency()
{
    var lplayerCoins = 0;
    var lplayerGem = 0;
    var infoAux = { GetUserVirtualCurrency: true }
    var inforesult;
    
    var combined = server.GetPlayerCombinedInfo({

        PlayFabId: currentPlayerId,
        InfoRequestParameters: infoAux
    });
   
    if (combined) {

        if (combined["InfoResultPayload"]) {
            //log.info("GetPlayerCurrency: 2,5 " + combined.toString());
            inforesult = combined["InfoResultPayload"];
        }        
        
    }
    if (inforesult) {
        
            //var inforesult = combined.data["InfoResultPayload"];
            if (inforesult.UserVirtualCurrency) {

                //log.info(" UserVirtualCurrency : " + inforesult.UserVirtualCurrency.toString());
                lplayerCoins = parseInt(inforesult.UserVirtualCurrency["GO"]);
                lplayerGem = parseInt(inforesult.UserVirtualCurrency["GE"]);
            }
        }

    /*
    var playerCurrency = server.AddUserVirtualCurrency({
        PlayFabId: currentPlayerId,
        VirtualCurrency: "GO",
        Amount: 0
    }
    )
   
    
    if (playerCurrency["Balance"]) {
   
        lplayerCoins = playerCurrency["Balance"];
    }

    playerCurrency = server.AddUserVirtualCurrency({
        PlayFabId: currentPlayerId,
        VirtualCurrency: "GE",
        Amount: 0
    }
    )
   
    if (playerCurrency["Balance"]) {   
        lplayerGem = playerCurrency["Balance"];
    }
    */
    return {

        playerCoins: lplayerCoins,
        playerGem: lplayerGem
    }
}
function GetHorseDataFromString(aStr) {

    var sts = aStr.split(",");
    var lidx = 0;
    var horseData = {

        "id": sts[0],
        "name": sts[1],
        "idMare": sts[2],
        "idStalion" : sts[3],
        "group": sts[4],
        "race": sts[5],
        "gender": sts[6],
        "impulse": sts[7],
        "stamina": sts[8],
        "mindfulness": sts[9],
        "genetics": sts[10],
        "confidence": sts[11],
        "condition": sts[12],
        "coinsPrice": sts[13],
        "gemsPrice": sts[14],      
        "breedDate": new Date(),
        "ateDate": new Date(),
        "grooDate": new Date(),
        "idDet_Main": sts[33],
        "idDet_Head": sts[34],
        "idDet_Leg": sts[35],
        "crinar": sts[36],
        "crinag": sts[37],
        "crinab": sts[38],
        "crinaa": sts[39]
        
    
    }

    //log.info(" GetHorseDataFromString horseData: " + horseData.toString());
  
    
     var d = new Date();
     d.setFullYear(parseInt(sts[15]), parseInt(sts[16]), parseInt(sts[17]));
     d.setHours(parseInt(sts[18]), parseInt(sts[19]), parseInt(sts[20]));
     horseData.breedDate = d;

     //log.info(" GetHorseDataFromString  horseData.breedDate: " + horseData.breedDate.toString());

     d = new Date();
     d.setFullYear(parseInt(sts[21]), parseInt(sts[22]), parseInt(sts[23]));
     d.setHours(parseInt(sts[24]), parseInt(sts[25]), parseInt(sts[26]));
     //horseData["breedDate"] = d;
     horseData.ateDate = d;

     //log.info(" GetHorseDataFromString  horseData.ateDate: " + horseData.ateDate.toString());

     d = new Date();
     d.setFullYear(parseInt(sts[27]), parseInt(sts[28]), parseInt(sts[29]));
     d.setHours(parseInt(sts[30]), parseInt(sts[31]), parseInt(sts[32]));
    //horseData["breedDate"] = d;
     horseData.grooDate = d;
        
     //log.info(" GetHorseDataFromString  horseData.grooDate: " + horseData.grooDate.toString());

     
    return horseData;
   
}

function GetHorseString(aHorse) {

    var horsedata = {};
    var str;
    horsedata = aHorse;
    str = horsedata["id"] + ",";
    str += horsedata["name"] + ",";
    str += horsedata["idMare"]+ ",";
    str += horsedata["idStalion"]+ ",";
    str += horsedata["group"]+ ",";
    str += horsedata["race"] + ",";
    str += horsedata["gender"] + ",";
    str += horsedata["impulse"]+ ",";
    str += horsedata["stamina"]+ ",";
    str += horsedata["mindfulness"]+ ",";
    str += horsedata["genetics"]+ ",";
    str += horsedata["confidence"]+ ",";
    str += horsedata["condition"]+ ",";
    str += horsedata["coinsPrice"]+ ",";
    str += horsedata["gemsPrice"] + ",";

    var d = new Date();
    d = horsedata["breedDate"];
    str += d.getFullYear() + ",";
    str += d.getMonth() + ",";
    str += d.getDate() + ",";
    str += d.getHours() + ",";
    str += d.getMinutes() + ",";
    str += d.getSeconds() + ",";

    d = horsedata["ateDate"];
    str += d.getFullYear() + ",";
    str += d.getMonth() + ",";
    str += d.getDate() + ",";
    str += d.getHours() + ",";
    str += d.getMinutes() + ",";
    str += d.getSeconds() + ",";

    d = horsedata["grooDate"];
    str += d.getFullYear() + ",";
    str += d.getMonth() + ",";
    str += d.getDate() + ",";
    str += d.getHours() + ",";
    str += d.getMinutes() + ",";
    str += d.getSeconds() + ",";

    str += horsedata["idDet_Main"] + ",";
    str += horsedata["idDet_Head"] + ",";
    str += horsedata["idDet_Leg"] + ",";
    str += horsedata["crinar"] + ",";
    str += horsedata["crinag"] + ",";
    str += horsedata["crinab"] + ",";
    str += horsedata["crinaa"];
  
   
    return str;

}

function GetHorseIdsFromString(aStr) {

    var arraux = aStr.split(",");
    return arraux;
        
}

function GetHorseIdsString(aIds) {
       
    var cont = 0;
    var strret;
    for (var i in aIds) {

        var id = aIds[i];
        if (cont == 0) {
            strret = id;
        }
        else {
            strret += ",";
            strret += id;
        }
        cont++;
    }

    return strret;
}

function GetHorseItemFromString(aStr) {

    var arraux = [];   
    arraux = aStr.split(",");
    return arraux;
    
}

function GetHorseItemString(aItems) {

    var arItems = [];
    arItems = aItems;
    var cont = 0;
    var strret;
    for (var i in arItems) {

        var itemId = arItems[i];
        if (cont == 0) {
            strret = itemId;           
        }
        else
        {
            strret += ",";
            strret += itemId;
        }
        cont++;
    }

    return strret;
}

function DaysBetween  (date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms / one_day);
}

function DoBuy(args) {

    //log.info(" ENTROU NO BUY");
    //log.info(" dobuy: " + args.strhorse);
    var now = new Date();
    var strhorse = args.strhorse;
    var stritem = args.stritem;
    var horsedata = GetHorseDataFromString(strhorse);
    var playerCash = GetPlayerCurrency();
    var keysPlayerData = ["horsesnum", "horsesids"];
    var jhorsesnum = 0;
    var jhorsesids = [];
    //log.info(" dobuy: atedate " + horsedata.ateDate.toString());

    // ajusta datas feed e grooing 2016-0-14
    horsedata.ateDate = new Date();
    horsedata.ateDate.setDate(horsedata.ateDate.getDate() - 1);
    horsedata.grooDate = new Date();
    horsedata.grooDate.setDate(horsedata.grooDate.getDate() - 1);
   // log.info(" dobuy: groodate " + horsedata.grooDate.toString());
    strhorse = GetHorseString(horsedata);
   // log.info(" dobuy: strhorse bew dates : " + strhorse);
    var playerData = server.GetUserData(
    {
        PlayFabId: currentPlayerId,
        Keys: keysPlayerData
    });
    if (playerData.Data) {

        if (playerData.Data["horsesnum"]) {
            var horsesaux = playerData.Data["horsesnum"];
            jhorsesnum = parseInt(horsesaux.Value);
        }
        if (playerData.Data["horsesids"]) {
            var horsesidsaux = playerData.Data["horsesids"];
            var straux = horsesidsaux.Value;
            jhorsesids = GetHorseIdsFromString(straux);
        }
    }

    if (parseInt(horsedata.coinsPrice) > playerCash.playerCoins) {
        return {
            ret: "-1",
            playerCoins: playerCash.playerCoins.toString(),
            coinsPrice: horsedata.coinsPrice.toString(),
            playerGem: playerCash.playerGem.toString(),
            gemsPrice: horsedata.gemsPrice.toString(),
            year: now.getFullYear().toString(),
            month: now.getMonth().toString(),
            day: now.getDate().toString(),
            hours: now.getHours().toString(),
            minuts: now.getMinutes().toString(),
            seconds: now.getSeconds().toString()
        }
    }
    if (parseInt(horsedata.gemsPrice) > playerCash.playerGem) {
        return {
            ret: "-2",
            playerCoins: playerCash.playerCoins.toString(),
            coinsPrice: horsedata.coinsPrice.toString(),
            playerGem: playerCash.playerGem.toString(),
            gemsPrice: horsedata.gemsPrice.toString(),
            year: now.getFullYear().toString(),
            month: now.getMonth().toString(),
            day: now.getDate().toString(),
            hours: now.getHours().toString(),
            minuts: now.getMinutes().toString(),
            seconds: now.getSeconds().toString()
        }
    }

    // limites de cavalo.
    if (jhorsesids.length >= 20)
    {
        return {

            ret: "-7",
            year: now.getFullYear().toString(),
            month: now.getMonth().toString(),
            day: now.getDate().toString(),
            hours: now.getHours().toString(),
            minuts: now.getMinutes().toString(),
            seconds: now.getSeconds().toString()

        }
    }

    for (var i in jhorsesids) {
        var idaux = jhorsesids[i];
        // cavalo já pertenco ao player
        if (idaux == horsedata.id) {
            return {

                ret: "-3",
                year: now.getFullYear().toString(),
                month: now.getMonth().toString(),
                day: now.getDate().toString(),
                hours: now.getHours().toString(),
                minuts: now.getMinutes().toString(),
                seconds: now.getSeconds().toString()

            }
        }
    }

    jhorsesids.push(horsedata.id);

    var dataux = {};
    var keyaux = "horseid_" + horsedata.id;
    dataux[keyaux] = strhorse;
    keyaux = "horseitems_" + horsedata.id;
    dataux[keyaux] = stritem;
    jhorsesnum++;
    dataux["horsesnum"] = jhorsesnum.toString();
    dataux["horsesids"] = GetHorseIdsString(jhorsesids);

    // se for breed, registra o id para controle de geracao de breed ids
    var idint = parseInt(horsedata.id);
    if (idint >= 1000)
        dataux["breedid"] = horsedata.id.toString();

    //log.info(" dobuy breedid " + horsedata.id.toString())
    server.UpdateUserData({

        PlayFabId: currentPlayerId,
        "Data": dataux,
        "Permission": "Public"
    });
    var playerCurrency = server.SubtractUserVirtualCurrency({
        PlayFabId: currentPlayerId,
        VirtualCurrency: "GO",
        Amount: horsedata.coinsPrice

    }
    );
    //log.info("log gemsPrice " + horsedata.id + " | " + horsedata.gemsPrice.toString() + "| " + dataux["horsesids"] + " | " + jhorsesids.length.toString());
    if (horsedata.gemsPrice > 0) {
        var playerCurrency = server.SubtractUserVirtualCurrency({
            PlayFabId: currentPlayerId,
            VirtualCurrency: "GE",
            Amount: horsedata.gemsPrice

        }
       );
    }


    return {

        ret: "1",
        year: now.getFullYear().toString(),
        month: now.getMonth().toString(),
        day: now.getDate().toString(),
        hours: now.getHours().toString(),
        minuts: now.getMinutes().toString(),
        seconds: now.getSeconds().toString()
    }



}

function DoBreed(marestr,stallionstr) 
{
    //log.info(" DOBREED marestr: " + marestr);
    var maredata = GetHorseDataFromString(marestr);
    //log.info(" DOBREED stallionstr: " + stallionstr);
    var stalliondata = GetHorseDataFromString(stallionstr);
    var breeddata = GetHorseDataFromString(marestr);
    var lcoins = parseInt(maredata.coinsPrice);
    var lgems = parseInt(maredata.gemsPrice);
    var rnd = 0;
    var attrrnd = 0;

   // log.info(" DOBREED: " + breeddata.id);

    // preco do breed sera igual ao maior valor entre mare e stallion.
    /*if (parseInt(stalliondata.coinsPrice) > lcoins)
        lcoins = stalliondata.coinsPrice;
    if (parseInt(stalliondata.gemsPrice) > lgems)
        lgems = stalliondata.gemsPrice;*/

    breeddata.coinsPrice = lcoins.toString();
    breeddata.gemsPrice = lgems.toString();

    breeddata.idMare = maredata.id;
    breeddata.idStalion = stalliondata.id;

    breeddata.stamina = GetAttrValue("stamina", stalliondata, maredata).toString();
    breeddata.impulse = GetAttrValue("impulse", stalliondata, maredata).toString();
    breeddata.mindfulness = GetAttrValue("mindfulness", stalliondata, maredata).toString();
    breeddata.genetics = GetAttrValue("genetics", stalliondata, maredata).toString();

    //log.info(" DOBREED MINDFULL " + breeddata.mindfulness.toString());

    rnd = Math.floor((Math.random() * 3) + 1) - 1;
    breeddata.idDet_Leg = rnd.toString();
    rnd = Math.floor((Math.random() * 2) + 1) - 1;
    breeddata.idDet_Head = rnd.toString();

    rnd = Math.floor((Math.random() * 10) + 1);
    if (stalliondata.genetics > maredata.genetics) {
        breeddata.crinaa = stalliondata.crinaa;
        breeddata.crinab = stalliondata.crinab;
        breeddata.crinag = stalliondata.crinag;
        breeddata.crinar = stalliondata.crinar;
    }

    //log.info(" DOBREED CRINA " + breeddata.crinaa.toString());

    rnd = Math.floor((Math.random() * 9) + 1);
    breeddata.idDet_Main = "0" + rnd.toString();    
    rnd = Math.floor((Math.random() * 2) + 1);
    breeddata.gender = rnd.toString();
    
    var now = new Date();
    breeddata.breedDate = now;
    //log.info(" DOBREED DATE " + breeddata.breedDate.toString());
    breeddata.ateDate = new Date();
    breeddata.ateDate.setDate(breeddata.ateDate.getDate() - 1);
    //log.info(" DOBREED Ate date " + breeddata.ateDate.toString());

    breeddata.grooDate = new Date();
    breeddata.grooDate.setDate(breeddata.grooDate.getDate() - 1);
   // log.info(" DOBREED groo  date " + breeddata.grooDate.toString());
    
    return breeddata;
    
}

function GetAttrValue(aAttr, aStallion, aMare) {

    var ret = 0;
    var difdefault = MAX_ATTR - MIN_ATTR;  
    var gapMare = MAX_ATTR - parseInt(aMare[aAttr]);
    var gapStallion = MAX_ATTR - parseInt(aStallion[aAttr]);

    //log.info("gaps: M:" + gapMare.toString() + " S:" + gapStallion.toString());    

    var percentMare = 20.5 * (parseInt(aMare.genetics.toString()) / MAX_ATTR);
    var percentStallion = 20.5 * (parseInt(aStallion.genetics.toString()) / MAX_ATTR);

    //log.info(" aMare.genetics :" + aMare.genetics);    
    //log.info("difdefault: " + difdefault.toString() +" percentMare:" + percentMare.toString() + " percentStallion:" + percentStallion.toString());

    var variavelMare = (Math.random() * 15) + 1;
    var variavelStallion = (Math.random() * 15) + 1;

    percentMare = percentMare - variavelMare;
    percentStallion = percentStallion - variavelStallion;

    var resultMare =  parseInt(aMare[aAttr]) + (gapMare * (percentMare / 100));
    var resultStallion = parseInt(aStallion[aAttr]) +( gapStallion * (percentStallion / 100));
    var resultM =  Math.floor((resultMare+resultStallion)/2);
    ret = parseInt(resultM.toString());    
    
    if(ret > MAX_ATTR)
        ret = MAX_ATTR;
    if (ret < MIN_ATTR)
        ret = MIN_ATTR;

   // log.info(aAttr + " ret attr:" + ret.toString());
    return ret;

    /*
    var rnd = 0;
    var attrrnd = 0;
    var ret = 0;
    var vaux = -4;
    var mareorstallion = 5;

    log.info(" attr:" + aAttr);

    if (aStallion.genetics > aMare.genetics)
        mareorstallion = 4;
    if (aMare.genetics > aStallion.genetics)
        mareorstallion = 6;

    log.info(" attr mareorstallion :" + mareorstallion.toString());

    rnd = Math.floor((Math.random() * 100) + 1);
    if (rnd < aStallion.genetics)
        vaux = vaux + 1;

    rnd = Math.floor((Math.random() * 100) + 1);
    if (rnd < aMare.genetics)
        vaux = vaux + 1;

    log.info(" attr vaux :" + vaux.toString());

    rnd = Math.floor((Math.random() * 10) + 1);
    attrrnd = Math.floor((Math.random() * 6) + 1) - vaux;
    if (rnd >= mareorstallion)
        ret = parseInt(aStallion[aAttr]) + attrrnd;
    else
        ret = parseInt(aMare[aAttr]) + attrrnd;

    log.info(" aStallion[aAttr] " + aStallion[aAttr].toString() + " aMare[aAttr] " + aMare[aAttr].toString() + " attrrnd " + attrrnd.toString());

    log.info(" attr ret :" + ret.toString());
    return ret;*/
}