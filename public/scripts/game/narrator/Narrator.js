/** Class for representing narration and dialogue on screen.
 * 
 * rectangle object, x,y top left, width, height...
 * Do we need to know the width?
 * 
 * TODO: Maybe should be a singleton? I dunno...
 */

import GameObject from "../../core/GameObject/GameObject.js";

export default class Narrator extends GameObject {

    style = {
		text: "If you'd like, look inwards.",
		textRatio: 20, // this is from the width of the button: text size = width / ratio
		textSize: 1,
		textFill: this.p5.color(255, 255, 255),
		textStroke: this.p5.color(255, 255, 255),
		textStrokeWeight: 0,
    }

    layout = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }
    
    __letterDelay = 150; //ms - how long to wait between display of letters
    __displayDuration = 15000; //ms - how long to wait with current message on screen
    __displayText = ""; //what we are literally rendering
    __fragmentText = ""; //Full phrase we are rendering
    __phraseStartTime = 0; //Date.now taken when starting phrase.
    __renderingFragment = false; //true if we are showing something.

    constructor(){
		super(0, 0, 0, 0, 0, 0);
    }

    setup(){
        this.layout.width = this.gameSession.canvasWidth;
        this.layout.height = this.gameSession.canvasHeight/2;
        this.resize();

    }

    update(){
        //if we aren't rendering a fragment, grab the next from queue.
        //TODO: Add randomized delay timer to vary presentation
        if(!this.renderingFragment){
            this.fragmentText = this.style.text; //TODO: Beat selection
            //TODO: put in narrator voice
            this.phraseStartTime = Date.now();
            this.renderingFragment = true;
            this.gameSession.soundManager.narratorSound.startLoop();
        } else {
            let tempText="";
            let timeElapsed = Date.now() - this.phraseStartTime;
            let numCharacters = timeElapsed/this.letterDelay;

            if(numCharacters < this.fragmentText.length){
                for(let i = 0; i < numCharacters; i++){
                    tempText+=this.fragmentText[i];
                }
            } else {
                this.gameSession.soundManager.narratorSound.stopLoop();
                tempText = this.fragmentText;
            }

            this.displayText = tempText;
            console.log(numCharacters);

            if(timeElapsed > this.displayDuration){
                this.renderingFragment = false;
                this.fragmentText = "";
                //TODO: change how this is presented
                this.style.text = "Would you like to try raising your arms?";
                
            }
        }

    }

    render(){
        this.p5.push();
        //show a floating line of text.
        this.p5.stroke(this.style.textStroke);
        this.p5.strokeWeight(this.style.textStrokeWeight);
        this.p5.textSize(this.style.textSize);
        this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
        this.p5.textFont("Oswald");
        this.p5.fill(this.style.textFill);
        this.p5.text(this.displayText, this.layout.x + this.layout.width / 2, this.layout.y + this.layout.height / 2);
    
        this.p5.pop();
    }

    resize(){
        this.layout.x = 0;
		this.layout.y = 0;
		this.layout.width = this.gameSession.canvasWidth;
		this.layout.height = this.gameSession.canvasHeight;

		this.layout.xRatio = this.layout.x / this.gameSession.canvasWidth;
		this.layout.yRatio = this.layout.y / this.gameSession.canvasHeight;
		this.layout.widthRatio = this.layout.width / this.gameSession.canvasWidth;
		this.layout.heightRatio = this.layout.height / this.gameSession.canvasHeight;

		this.style.textSize = this.layout.width / this.style.textRatio;
    }

    get displayDuration(){
        return this.__displayDuration;
    }

    set displayDuration(displayDuration){
        this.__displayDuration = displayDuration;
    }

    get letterDelay(){
        return this.__letterDelay;
    }

    set letterDelay(letterDelay){
        this.__letterDelay = letterDelay;
    }

    get displayText(){
        return this.__displayText;
    }
    set displayText(displayText){
        this.__displayText = displayText;
    }

    get fragmentText(){
        return this.__fragmentText;
    }

    set fragmentText(fragmentText){
        this.__fragmentText = fragmentText;
    }

    get phraseStartTime(){
        return this.__phraseStartTime;
    }

    set phraseStartTime(phraseStartTime){
        this.__phraseStartTime = phraseStartTime;
    }

    get renderingFragment(){
        return this.__renderingFragment;
    }
    set renderingFragment(renderingFragment){
        this.__renderingFragment = renderingFragment;
    }

}