// JavaScript source code
var MIN_ATTR = 50;
var MAX_ATTR = 100;
var GROOMIN_LOSE = 2;
var GROOMIN_INC = 2;
var FOOD_LOSE = 2;
var FOOD_INC_1 = 3;
var FOOD_INC_2 = 5;
var FOOD_INC_3 = 7;
var FOOD_COINS_2 = 20;
var FOOD_GEM_2 = 0;
var FOOD_COINS_3 = 30;
var FOOD_GEM_3 = 1;
var COND_LIMIT_MIN = 75;
var COND_LIMIT1 = 80;
var COND_LIMIT2 = 85;
var COND_LIMIT3 = 90;


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

    var lattr = lhorsedata.confidence - (daysdif * GROOMIN_LOSE) + GROOMIN_INC;
    
    if (lattr < MIN_ATTR)
        lattr = MIN_ATTR;
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
        lfoodcoins = FOOD_COINS_2;
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
    // primeira vez.
    if (daysdif > 9999)
        daysdif = 1;

    if (daysdif <= 0) {

        return { ret: "-4", coins: "0", gems: "0", horsedata:""}
    }
    var lattr = lhorsedata.condition - (daysdif * FOOD_LOSE) + lfoodinc;
    
    if (lattr < COND_LIMIT_MIN)
        lattr = COND_LIMIT_MIN;
    if (lattr > lcondmax)
        lattr = lcondmax;

    lhorsedata.ateDate = now;
    lhorsedata.condition = lattr;

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
    var lname = args.name;
    var lcoins = args.coins;
    var lgems = args.gems;
    
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
        

    }
    var lhorsedataStallion = GetHorseDataFromString(stallionstr);
    var lhorsedataMare = GetHorseDataFromString(marestr);
    if ((lhorsedataStallion.id == "0") || (lhorsedataMare.id == "0")) {

        return {
            ret: "-3",
            horsedata: "0",
            playercoins: "0",
            playergems: "0"
        }
    }

    var breeddata = DoBreed(marestr, stallionstr);
    breeddata.id = lbreedid;
    breeddata.coinsPrice = lcoins;
    breeddata.gemsPrice = lgems;
    breeddata.name = lname;
    var argbuy = {};
    argbuy["strhorse"] = GetHorseString(breeddata);
    argbuy["stritem"] = "0";

    var retbuy = DoBuy(argbuy);
    argbuy["horsedata"] = argbuy["strhorse"];

    return argbuy;

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
    log.info(" ITEM: " + itemid + " HORSE " + horseid + " itens: " + lhorseitems );
    log.info(" ITEMB: " + itemid + " HORSE " + horseid + " itens: " + lhorseitems );
    if(lhorseitems != "0")
        itemsList = GetHorseItemFromString(lhorseitems);
    log.info(" ITEM: " + itemid + " HORSE " + horseid + " itens: " + lhorseitems + " itemsList len: " + itemsList.length.toString());
    log.info(" itemsList len: " + itemsList.length.toString());
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
    log.info(" itemsList len 2: " + itemsList.length.toString());
   
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
    log.info(" LOG 2  ITEM: " + itemid + " HORSE " + horseid + " itens: " + lhorseitems);

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

function GetPlayerCurrency()
{
    var lplayerCoins = 0;
    var lplayerGem = 0;

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
  
     var d = new Date();
     d.setFullYear(parseInt(sts[14]), parseInt(sts[15]), parseInt(sts[16]));
     d.setHours(parseInt(sts[17]), parseInt(sts[18]), parseInt(sts[19]));
     horseData.breedDate = d;

     d = new Date();
     d.setFullYear(parseInt(sts[20]), parseInt(sts[21]), parseInt(sts[22]));
     d.setHours(parseInt(sts[23]), parseInt(sts[24]), parseInt(sts[25]));
     //horseData["breedDate"] = d;
     horseData.ateDate = d;

     d = new Date();
     d.setFullYear(parseInt(sts[26]), parseInt(sts[27]), parseInt(sts[28]));
     d.setHours(parseInt(sts[29]), parseInt(sts[30]), parseInt(sts[31]));
    //horseData["breedDate"] = d;
     horseData.grooDate = d;
        


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

function GetHorseItemFromString(str) {

    var arraux = [];

    if (str.length.indexOf(",") < 0) 
        arraux.push(parseInt(str))
    else
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

    var now = new Date();
    var strhorse = args.strhorse;
    var stritem = args.stritem;
    var horsedata = GetHorseDataFromString(strhorse);
    var playerCash = GetPlayerCurrency();
    var keysPlayerData = ["horsesnum", "horsesids"];
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
    log.info("log gemsPrice " + horsedata.id + " | " + horsedata.gemsPrice.toString() + "| " + dataux["horsesids"] + " | " + jhorsesids.length.toString());
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
    var maredata = GetHorseDataFromString(marestr);
    var stalliondata = GetHorseDataFromString(stallionstr);
    var breeddata = GetHorseDataFromString(marestr);
    var lcoins = parseInt(maredata.coinsPrice);
    var lgems = parseInt(maredata.gemsPrice);
    var rnd = 0;
    var attrrnd = 0;

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

    rnd = Math.floor((Math.random() * 9) + 1);
    breeddata.idDet_Main = "0" + rnd.toString();    
    rnd = Math.floor((Math.random() * 2) + 1);
    breeddata.gender = rnd.toString();

    breeddata.breedDate = new Date();
    return breeddata;
    
}

function GetAttrValue(aAttr, aStallion, aMare) {

    var rnd = 0;
    var attrrnd = 0;
    var ret = 0;
    var vaux = -4;
    var mareorstallion = 5;

    if (aStallion.genetics > aMare.genetics)
        mareorstallion = 4;
    if (aMare.genetics > aStallion.genetics)
        mareorstallion = 6;

    rnd = Math.floor((Math.random() * 100) + 1);
    if (rnd < aStallion.genetics)
        vaux = vaux + 1;

    rnd = Math.floor((Math.random() * 100) + 1);
    if (rnd < aMare.genetics)
        vaux = vaux + 1;

    rnd = Math.floor((Math.random() * 10) + 1);
    attrrnd = Math.floor((Math.random() * 6) + 1) - vaux;
    if (rnd >= mareorstallion)
        ret = stalliondata[aAttr] + attrrnd;
    else
        ret = maredata[aAttr] + attrrnd;

    return ret;
}