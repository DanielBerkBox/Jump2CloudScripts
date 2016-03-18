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

// retorna dados extendidos (horses,time server, items etc)
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
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate(),
        hours: now.getHours(),
        minuts: now.getMinutes(),
        seconds: now.getSeconds()
        
    };
}
handlers.buyHorse = function (args) {

    var strhorse = args.strhorse;
    var stritem = args.stritem;
    var horsedata = GetHorseDataFromString(strhorse);
    var playerCash = GetPlayerCurrency();
    var keysPlayerData = ["horsesnum","horsesids"];
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

    if(horsedata.coinsPrice > playerCash.playerCoins)
    {
        return {
            ret: "-1",
            playerCoins: playerCash.playerCoins.toString(),
            coinsPrice: horsedata.coinsPrice.toString(),
            playerGem: playerCash.playerGem.toString(),
            gemsPrice: horsedata.gemsPrice.toString()
        }
    }
    if (horsedata.gemsPrice > playerCash.playerGem) {
        return {
            ret: "-2",
            playerCoins: playerCash.playerCoins.toString(),
            coinsPrice: horsedata.coinsPrice.toString(),
            playerGem: playerCash.playerGem.toString(),
            gemsPrice: horsedata.gemsPrice.toString()
        }
    }
        
    for (var idaux in jhorsesids) {
        // cavalo já pertenco ao player
        if(idaux == horsedata.id)
        {
            return {

                ret: -3
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
    )
    log.info("log gemsPrice " + horsedata.id + " | " + horsedata.gemsPrice.toString() + "| " + dataux["horsesids"] + " | " + jhorsesids.length.toString());
    if (horsedata.gemsPrice > 0) {
        var playerCurrency = server.SubtractUserVirtualCurrency({
            PlayFabId: currentPlayerId,
            VirtualCurrency: "GE",
            Amount: horsedata.gemsPrice

        }
       )
    }


    return {

        ret:1
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
        "impulse": sts[6],
        "stamina": sts[7],
        "mindfulness": sts[8],
        "genetics": sts[9],
        "confidence": sts[10],
        "condition": sts[11],
        "coinsPrice": sts[12],
        "gemsPrice": sts[13],      
        "breedDate": new Date(),
        "ateDate": new Date(),
        "grooDate": new Date(),
        "idDet_Main": sts[32],
        "idDet_Head": sts[33],
        "idDet_Leg": sts[34],
        "crinar": sts[35],
        "crinag": sts[36],
        "crinab": sts[37],
        "crinaa": sts[38],
    
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
    str += horsedata["race"]+ ",";
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
    for (var id in aIds) {

        if (cont == 0) {
            strret = "xx" + id;
        }
        else {
            strret += ",";
            strret += id;
        }
        cont++;
    }

    return "1," + strret.toString() + "," + aIds.length.toString();//strret;
}

function GetHorseItemFromString(str) {

    var arraux = aStr.split(",");
    return arraux;
    
}

function GetHorseItemString(aItems) {

    var arItems = [];
    arItems = aItems;
    var cont = 0;
    var strret;
    for (var itemId in arItems) {

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
}