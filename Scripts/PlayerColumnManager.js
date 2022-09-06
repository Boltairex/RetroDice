// ////  Gracz Gracz Gracz Gracz
// Index   P1    P2    P3    P4
// Index   P1    P2    P3    P4
// Index   P1    P2    P3    P4
// Index   P1    P2    P3    P4
// Index   P1    P2    P3    P4
// Index   P1    P2    P3    P4
// Index   P1    P2    P3    P4


// Ilość rund, nazwy graczy

/*
Obj = {
    Rounds: 7,
    Players: ["Jason Born","Ratata"]
};
*/
var InterfaceInfo = [] // Jednowymiarowa, przesuwa się co ilość graczy
var PlayersCount = 0;

function InitializePlayerData(data)
{
    let grid = document.getElementById("RightSidePanel");
    let players = Object.keys(data.Players);
    PlayersCount = players.length;

    for(let x = 0; x < players.length; x++)
    {
        let name = document.createElement("div");
        name.classList.add("playerColumn");
        name.style.gridColumn = x + 1;
        name.style.fontSize = "0.5vw";
        name.innerHTML = players[x];
        grid.appendChild(name);
    }

    for(let r = 0; r < data.Rounds; r++)
    {
        for(let x = 0; x < players.length; x++)
        {
            let field = document.createElement("div");
            field.classList.add("playerColumn");
            field.style.gridColumn = x + 1;
            field.innerHTML = "";
            grid.appendChild(field);
        }
    }

    for(let x = 0; x < players.length; x++)
    {
        let name = document.createElement("div");
        name.classList.add("playerColumn");
        name.style.gridColumn = x + 1;
        name.style.border = "3px solid red"
        name.innerHTML = "0";
        grid.appendChild(name);
    }

    InterfaceInfo = document.querySelectorAll("div.playerColumn")
    console.log(InterfaceInfo)
}
/*
Obj = {
    Round: 1,
    Player: string,
    Value: 23
}
*/
function SetColumnValue(data)
{
    let pos = PlayerToColumnIndex(data.Round, data.Player);
    InterfaceInfo[pos].innerHTML = data.Value;
}

function PlayerToColumnIndex(round, player)
{
    let i = GetPlayerIndex(player);
    return round * PlayersCount + i;  
}

function UpdatePlayerPoints(player, value)
{
    let i = GetPlayerIndex(player);
    InterfaceInfo[InterfaceInfo.length + (i - PlayersCount)].innerHTML = value;
}