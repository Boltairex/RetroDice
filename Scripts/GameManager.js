var DiceObjects = [];
var ThrowCounterObject;
var Textures = {};
var DiceValues = [];
var Lock = [false, false, false, false, false];
var Throws = 3;
var Rounds = 1;
var CurrentRound = 1;
var LeftPanelButtons = [];

var LockInterface = false;
var Players = {};
var CurrentPlayer = 0;

async function InitializeGame()
{
    //Wczesna inicjalizacja
    ThrowCounterObject = document.getElementById("ThrowsCounter");
    DiceObjects = document.querySelectorAll("img.dice");

    let aColumn = Array.from(document.querySelectorAll("div.bColumn"));
    let bColumn = Array.from(document.querySelectorAll("div.aColumn"))
    delete aColumn[6];

    for(let column in aColumn) {
        if(aColumn[column] != undefined)
            LeftPanelButtons.push(aColumn[column]);
    } 
    for(let column in bColumn) {
        if(bColumn[column] != undefined)
            LeftPanelButtons.push(bColumn[column]);
    }

    console.log(LeftPanelButtons)
    await new Promise((resolve) => {
        for(let x = 1; x <= 6; x++) Textures["dice"+ (x - 1)] = "./Textures/Dice" + x + ".jpeg";
        resolve("Done");
    });

    await new Promise((resolve) => {
        Textures["rollImage"] = "./Textures/DiceThrow.png";
        document.getElementById("ThrowButton").src = Textures["rollImage"];
        resolve("Done");
    });

    // Zabezpieczenia i wprowadzanie ustawień
    Rounds = parseInt(prompt("Ile rund ma trwać gra? Może trwać maksymalnie od 1 do 8, inaczej gra zrobi sie niestabilna."));
    while(Rounds < 1)
    { Rounds = parseInt(prompt("Nie można wybrać mniej niż 1 rundę. Wybierz od 1 do 8, lub więcej - na własną odpowiedzialność.")); }

    let playersCount = parseInt(prompt("Z iloma graczami chcesz rozpocząć grę? Można maksymalnie od 1 do 4 graczy, inaczej gra zrobi sie niestabilna."));
    while(playersCount < 0)
    { playersCount = parseInt(prompt("Nie można wybrać mniej niż 1 gracza. Wybierz od 1 do 4, lub więcej - na własną odpowiedzialność.")); }

    // Późna inicjalizacja oraz ustawianie nazw graczy
    for(let x = 0; x < playersCount; x++) {
        let name = "";
        let occupied = false;
        do
        {
            occupied = false;
            name = prompt("Jak ma nazywać się " + (x + 1) + " gracz?");
            Object.keys(Players).forEach(element => { if(element == undefined) {} else if(name == element) { occupied = true; console.log(element);} })
        }   
        while(occupied);

        Players[name] = {
            Points: 0,
            Used: [0,0,0,0,0,0,0]
        };
    }
    InitializePlayerData({Players: this.Players, Rounds: this.Rounds});
    alert("Gracze utworzeni. Miłej gry życzę");
        
    setTimeout(_ => {
        CurrentPlayer = -1;
        DrawText("Gracz '" + Object.keys(Players)[0] + "' zaczyna.")
        NextPlayer();
    },1000);
}

function NextPlayer()
{   
    try
    {
    Throws = 3;
    ThrowCounterObject.innerHTML = "Pozostało rzutów: " + Throws;
    let plyObject = Object.keys(Players);
    for(let x = 0; x < 5; x++) { // Reset obiektów
        Lock[x] = false;
        DiceObjects[x].style.border = "";
        DiceObjects[x].src = "";
        DiceValues[x] = 0;
    }

    if(plyObject[plyObject.length - 1] == GetCurrentPlayer()) CurrentRound++; // Dodawanie rund

    //#region Koniec gry
    if(CurrentRound > Rounds) { // Gdy skończ się rundy
        DrawText("Gra skończona.");
        let highest = 0, player = "";
        console.log(plyObject);
        plyObject.forEach(key => { // Wyciąganie najwyższej wartości
            if(Players[key].Points > highest) {
                highest = Players[key].Points;
                player = key;
            }
        });

        let addToWinner = "";
        plyObject.forEach(key => { // Sprawdzanie, czy ktoś nie ma takiej samej ilości punktów.
            if(Players[key].Points == highest && player != key)
                addToWinner += ',' + key;
        });

        if(addToWinner != "") {
            ThrowCounterObject.innerHTML = ("Gra zakończyła sie remisem, pomiedzy: " + player + addToWinner + " z wynikiem " + highest + " punktów.")
        }
        else {
            ThrowCounterObject.innerHTML = ("Gra zakończyła sie wygrana " + player + ", z wynikiem " + highest + " punktów!")
        }
        return;
    }
    //#endregion Koniec Gry

    CurrentPlayer++;
    if(CurrentPlayer >= plyObject.length)
        CurrentPlayer = 0;

    for(let x = 0; x < 13; x++) {
        if(Players[GetCurrentPlayer()].Used[x] == 1) {
            LeftPanelButtons[x].style.border ="3px solid black"
            LeftPanelButtons[x].style.filter ="saturate(0%)"
        }
        else {
            LeftPanelButtons[x].style.border =""
            LeftPanelButtons[x].style.filter ="saturate(100%)"
        }
    }
    DrawText("Gracz " +GetCurrentPlayerToDisplay()+" rzuca.")
    LockInterface = false;
    } 
    //#region Wyłapywanie złych ustawień.
    catch {
        ThrowCounterObject.innerHTML = "NULL";
        DrawText("Bład w ustawieniach. Upewnij sie, że wpisane zostały poprawne wartości.");
        LockInterface = true;
    }
    //#endregion Wyłapywanie złych ustawień.
}

function LockDice(index)
{
    if(Lock[index]) {
        Lock[index] = false;
        DiceObjects[index].style.border = "";
        return;
    }

    Lock[index] = true;
    DiceObjects[index].style.border = "3px solid red";
}

function ThrowDices()
{
    if(LockInterface) return;

    if(Throws > 0) {
        Throws--;
        for(let x = 0; x < 5; x++) {
            if(!Lock[x]) { 
                let val = Roll();
                if(DiceValues.length < x) DiceValues.push(val + 1)
                else DiceValues[x] = val + 1;
                SetDice(x, val)
            }
        }
    }
    ThrowCounterObject.innerHTML = "Pozostało rzutów: " + Throws;
}

function SetDice (index, type) 
{   
    $(DiceObjects[index]).addClass('dice-anim');
    $(DiceObjects[index]).one('webkitAnimationEnd animationend', function(event) {
        $(this).removeClass('dice-anim')
    });
    DiceObjects[index].src = Textures["dice" + type]; 
}

function Roll() { return Math.floor(Math.random() * 6) } 

function UseMod(modStr)
{
    if(LockInterface) return;

    if(DiceValues[0] == 0)
    {
        DrawText("Zapomniałeś rzucić kostka.");
        return;
    }

    let banIndex = -1;
    let points = 0;
    let plyName = GetCurrentPlayerToDisplay();
    switch(modStr) {
        case "One":
            banIndex = 0;
            if(Players[GetCurrentPlayer()].Used[banIndex] == 1) return;
            points += OneMod(DiceValues)
            DrawText(plyName + " zyskuje z jedynki " + points + " punktów!");
        break;
        case "Two":
            banIndex = 1;
            if(Players[GetCurrentPlayer()].Used[banIndex] == 1) return;
            points += TwoMod(DiceValues)
            DrawText(plyName + " zyskuje z dwójki " + points + " punktów!");
        break;
        case "Three":
            banIndex = 2;
            if(Players[GetCurrentPlayer()].Used[banIndex] == 1) return;
            points += ThreeMod(DiceValues)
            DrawText(plyName + " zyskuje z trójki " + points + " punktów!");
        break;
        case "Four":
            banIndex = 3;
            if(Players[GetCurrentPlayer()].Used[banIndex] == 1) return;
            points += FourMod(DiceValues)
            DrawText(plyName + " zyskuje z czwórki " + points + " punktów!");
        break;
        case "Five":
            banIndex = 4;
            if(Players[GetCurrentPlayer()].Used[banIndex] == 1) return;
            points += FiveMod(DiceValues)
            DrawText(plyName + " zyskuje z piatki " + points + " punktów!");
        break;
        case "Six":
            banIndex = 5;
            if(Players[GetCurrentPlayer()].Used[banIndex] == 1) return;
            points += SixMod(DiceValues)
            DrawText(plyName + " zyskuje z szóstki " + points + " punktów!");
        break;

        case "ThreePairs":
            banIndex = 6;
            if(Players[GetCurrentPlayer()].Used[banIndex] == 1) return;
            points += ThreePairsMod(DiceValues)
            DrawText(plyName + " używa '3-Pairs'! " + points + " punktów!");
        break;
        case "FourPairs":
            banIndex = 7;
            if(Players[GetCurrentPlayer()].Used[banIndex] == 1) return;
            points += FourPairsMod(DiceValues)
            DrawText(plyName + " używa '4-Pairs'! " + points + " punktów!");
        break;
        case "Full":
            banIndex = 8;
            if(Players[GetCurrentPlayer()].Used[banIndex] == 1) return;
            points += FullMod(DiceValues)
            DrawText(plyName + " wchodzi na pełnej! Będzie to " + points + " punktów!");
        break;
        case "SStrit":
            banIndex = 9;
            if(Players[GetCurrentPlayer()].Used[banIndex] == 1) return;
            points += SmallStritMod(DiceValues)
            DrawText("Mały strit. Gracz " + plyName + " zdobywa tym " + points + " punktów!");
        break;
        case "HStrit":
            banIndex = 10;
            if(Players[GetCurrentPlayer()].Used[banIndex] == 1) return;
            points += HugeStritMod(DiceValues)
            DrawText("Duży strit! Gracz " + plyName + " zdobywa tym " + points + " punktów!");
        break;
        case "General":
            banIndex = 11;
            if(Players[GetCurrentPlayer()].Used[banIndex] == 1) return;
            points += GeneralMod(DiceValues)
            DrawText(plyName + " używa generała! Zgarnął tym " + points + " punktów!");
        break;
        case "Chance":
            banIndex = 12;
            if(Players[GetCurrentPlayer()].Used[banIndex] == 1) return;
            points += ChanceMod(DiceValues)
            DrawText(plyName + " używa szansy. Razem będzie to " + points + " punktów!");
        break;
        case "None":
            points += -5
            DrawText(plyName + " dostaje kare w wysokości " + points + " punktów.");
        break;  
        default:
             points = 0;
        break;
    }

    LockInterface = true;
    setTimeout(_ => {
        let ply = GetCurrentPlayer();
        Players[ply].Points += points;

        if(banIndex != -1) Players[ply].Used[banIndex] = 1;
        
        console.log(ply + ", " + Players[ply].Points);
        console.log(CurrentRound);

        SetColumnValue({Round: CurrentRound, Player: ply, Value: points}) // Z PlayerColumnManager
        UpdatePlayerPoints(ply,Players[ply].Points); // Z PlayerColumnManager
        NextPlayer();
    },1000);
}

function GetCurrentPlayer() { return Object.keys(Players)[CurrentPlayer];}

function GetCurrentPlayerToDisplay() { return "'" + Object.keys(Players)[CurrentPlayer] + "'";}

function GetPlayersCount() { return Object.keys(Players).length;}

function GetPlayerIndex(name)
{
    let ply = Object.keys(Players)
    for(let x = 0; x < GetPlayersCount(); x++)
    {
        if(ply[x] == name)
            return x;
    }
    return -1;
}