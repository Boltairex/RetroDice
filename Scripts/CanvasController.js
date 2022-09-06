var infoPanel;
var infoContext;
var XScale = 0.4, YScale = 0.5;
var Correction = { // Przez dziwny rendering tej czcionki trzeba ją przesuwać
    xCor: 20,
    yCor: 40   
}

function InitializeCanvas() {  
    infoPanel = document.getElementById("InfoPanel");
    infoContext = infoPanel.getContext("2d");
    infoContext.font = '25px "Press Start 2P", cursive';
    infoContext.fillStyle  = "white";
    infoContext.textAlign = "center";
    infoContext.scale(XScale, YScale);
    infoContext.mozImageSmoothingEnabled = false;
    infoContext.translate(0.3,0.3) // By zmniejszyć rozmazanie
}

function DrawText(text) 
{  
    ClearText();
    let measure = infoContext.measureText(text);
    if(measure.width > 500)
    {
        let array = text.split(' ');
        let i = 0;
        let cuttedText = [];
        while(i < array.length)
        {
            let str = "";
            let localMeasure;
            do
            {   
                str += array[i] + " ";
                i++;
                localMeasure = infoContext.measureText(str);
            }
            while(localMeasure.width < 450 && i < array.length);
            cuttedText.push(str);
        }

        let midPoint = infoPanel.height / cuttedText.length;
        for(let x = 0, pointer = (-cuttedText.length / 2); x < cuttedText.length; x++, pointer++)
        {
            let height = 100 + (pointer * 50); // Względem punktu środkowego, przemieszczanie czcionki z paddingiem.
            infoContext.fillText(cuttedText[x], // Tekst
            infoPanel.width / 2 / XScale + Correction.xCor, height + midPoint / 2 / YScale + Correction.yCor); // Pozycja
        } 
    }
    else
        infoContext.fillText(text, infoPanel.width/ 2 / XScale + Correction.xCor, infoPanel.height/2 / YScale);
}

function ClearText() 
{  
    infoContext.clearRect(0, 0, 2000, 2000); // Jest renderowany w większej skali, dlatego trzeba czyścić więcej
}