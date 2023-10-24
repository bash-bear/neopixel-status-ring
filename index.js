const EventEmitter = require('events');
const ws281x = require('rpi-ws281x-native');

const {
    defaultConfig,
    STATI,
    EVENTS,
    convertColor,
    getPopulatedValueArray,
    cleanDeadPixels
} = require('./src');


/**
 * 
 */
class NeopixelStatusRing extends EventEmitter{
    constructor(params) {
        super();
        this.config = {
            ...defaultConfig,
            ...params
        }

        this.channel = ws281x(this.config.leds, { 
            stripType: this.config.stripType, 
            brightness: this.config.brightness
        });

        this.status = STATI.OFF;
        this.ledArray = this.channel.array
        

        this.turnOff = this.turnOff.bind(this)
        this.turnOn = this.turnOn.bind(this)
        this.finalize = this.finalize.bind(this)
        this.render = this.render.bind(this)

        Object.keys(EVENTS).forEach(eventType => {
            this.on(eventType, this.render)
        })

    }

    render({event, params}){
        
        console.log("Event", event)

        let ledArray = this.channel.array

        switch(event){
            case EVENTS.FINALIZE:
                ws281x.finalize()
                return;
            case EVENTS.TURN_OFF:
                ledArray = getPopulatedValueArray(this.channel.count)
                break;

            case EVENTS.TURN_ON:
                ledArray = getPopulatedValueArray(
                    this.channel.count, 
                    convertColor(this.config.colors.on)
                )
                break;

            case EVENTS.RESET:
                ws281x.reset()
                return;

            default:
                return;
        }

        ledArray = cleanDeadPixels(
            ledArray,
            this.config.deadPixels
        )

        
        console.log("Channel", this.channel, ledArray)
        this.channel.render();

    }


    _renderCycle(){
        let recycle = true;
        switch(this.status){
            case STATI.FINALIZE:
                ws281x.finalize()
                recycle = false
                break;
            case STATI.ON:
                for (let i = 0; i < this.channel.count; i++) {
                    if(this.config.deadPixels.includes(i)){
                        this.ledArray[i] = 0x000000;    
                    } else {
                        this.ledArray[i] = convertColor(this.statusColor);
                    }
                }
                break;
            case STATI.OFF:
            default:
                this.ledArray = [...getPopulatedOffArray(this.channel.count)]
                break;
        }

        if(recycle){
            console.log("Render Cycle", this.status, this.ledArray)
            this.channel.render();
            setTimeout(
                this._renderCycle,
                this.config.cycleTime || 500
            )
        } 
    }

    _localEmit(eventName, params = {}){
        this.emit(eventName, {
            event: eventName,
            params
        })
    }


    turnOff(){
        this._localEmit(EVENTS.TURN_OFF)
    }

    turnOn(){
        this._localEmit(EVENTS.TURN_ON)
    }

    loadingIndicator(color = "pink", preserveStatus = false) {
        let initialStatus = preserveStatus ? [...this.ledArray] : [...this._getOffArray()]
        let lastPixel = 0;
        let round = 0;

        for (let round = 0; i < 3; i++) {


            
        }
    }

    flash(color, preserveStatus = false){
        const currentStatus = [...this.channel.array];
        this.turnOff();
    }   

    finalize(){
        this._localEmit(EVENTS.FINALIZE)
    }

}

module.exports = NeopixelStatusRing