function OneMod(dices) {
    let info = GetDicesInfo(dices);
    return info[1];
}

function TwoMod(dices) {
    let info = GetDicesInfo(dices);
    return info[2] * 2;
}

function ThreeMod(dices) {
    let info = GetDicesInfo(dices);
    return info[3] * 3;
}

function FourMod(dices) {
    let info = GetDicesInfo(dices);
    return info[4] * 4;
}

function FiveMod(dices) {
    let info = GetDicesInfo(dices);
    return info[5] * 5;
}

function SixMod(dices) {
    let info = GetDicesInfo(dices);
    return info[6] * 6;
}

// Dolna Tabela

function ThreePairsMod(dices) {
    let info = GetDicesInfo(dices);
    let condition = false;

    Object.values(info).forEach(element => {
        if(element >= 3) condition = true;
    });

    if(!condition) return 0;

    let val = 0;
    for(let x = 1; x <= 6; x++)
        val += info[x] * x;

    return val;
}

function FourPairsMod(dices) {  
    let info = GetDicesInfo(dices);
    let condition = false;
    
    Object.values(info).forEach(element => {
        if(element >= 4) condition = true;
    });

    if(!condition) return 0;

    let val = 0;
    for(let x = 1; x <= 6; x++)
        val += info[x] * x;

    return val;
}

function FullMod(dices) {
    let info = GetDicesInfo(dices);
    let condition1 = false;
    let condition2 = false;
    
    Object.values(info).forEach(element => {
        if(element >= 3) condition1 = true;
        else if(element >= 2) condition2 = true;
    });

    if(!condition1 || !condition2) return 0;
    return 25;
}

function SmallStritMod(dices) {
    let info = GetDicesInfo(dices);
    for(let x = 1; x <= 4; x++)
    {
        if(x == 4) return 0;
        
        if(info[x] > 0) // Sprawdzanie czy od jedynki/dwójki zaczyna się strit
        {
            let pointer = x;
            let count = 1;
            do // Loopowanie przez kolejne szukane punkty
            {
                if(info[pointer] == 0) return 0;
                pointer++;
                count++;
            }
            while(count <= 4)
            break;
        }
    }

    return 30;
}

function HugeStritMod(dices) {
    let info = GetDicesInfo(dices);
    for(let x = 1; x <= 3; x++)
    {
        if(x == 3) return 0;
        
        if(info[x] > 0) // Sprawdzanie czy od jedynki/dwójki zaczyna się strit
        {
            let pointer = x;
            let count = 1;
            do // Loopowanie przez kolejne szukane punkty
            {
                if(info[pointer] == 0) return 0;
                pointer++;
                count++;
            }
            while(count <= 5)
            break;
        }
    }

    return 40;
}

function GeneralMod(dices) {
    let info = GetDicesInfo(dices);
    let condition = false;

    Object.values(info).forEach(element => {
        if(element == 5) condition = true;
    });

    if(!condition) return 0;
    return 50;
    
}

function ChanceMod(dices) {
    let info = GetDicesInfo(dices);

    let val = 0;
    for(let x = 1; x <= 6; x++)
        val += info[x] * x;

    return val;
}

function GetDicesInfo(dices) {
    let obj = {1:0,2:0,3:0,4:0,5:0,6:0}; // wrzucić to do osobnej funkcji, która zwraca info do porównania.
    dices.forEach(dice => {
        obj[dice] += 1;
    });
    return obj;
}