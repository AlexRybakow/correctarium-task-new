import moment from 'moment';

const hour = 3600000;

const fileType  = ["doc", "docx", "rtf"];

const checkTypeforEstimate = (type:any) => {
    if (fileType.includes(type)) {
        return 1
    } else {
        return 1.2
    }
}

export const getPriceEstimate = (value:number, lang:string):number => {
    const cyrillicLetters = 0.05;
    const latinLetters = 0.12
    const symbolPrice = lang === 'en' ? latinLetters : cyrillicLetters;
    const textEstimate = Math.max(1000, value)*symbolPrice
    return textEstimate;
}

export const getTimeEstimate = (textLength:number, ln:string)=> {
    const cyrillicSymbolPerGour = 1333;
    const latinSymbolPerHour = 333
    const symbolsPerHourCount = ln === 'en' ? latinSymbolPerHour : cyrillicSymbolPerGour;
    const time = Math.max(hour, hour/2 + ((textLength/symbolsPerHourCount)*hour))
    return time;
}


export const getDeliveryTime = (time:number, getEstimate:any) => {
    getEstimate = moment()
        
    while(true){
        const startWork = moment(getEstimate).startOf("day").hour(10).minute(0).valueOf()
        const endWork =  moment(getEstimate).startOf("day").hour(19).minute(0).valueOf()

        if(getEstimate.valueOf() > endWork) {
                getEstimate.add(1, "days").set({hours: '10', minutes: '00'})
        }
             
        if(getEstimate.valueOf() < startWork){
            getEstimate.set({hours: '10', minutes: '00'})
        }
      

        if(getEstimate.day() === 6 || getEstimate.day()===0) {
            getEstimate.add(1, "days").set({hours: '10', minutes: '00'})
            continue
        }

        const leftWorkTimeFromNow = endWork - getEstimate.valueOf()
        if(time < leftWorkTimeFromNow){
            console.log(getEstimate.valueOf() + time)
            return getEstimate.valueOf() + time
        }

        time = time - leftWorkTimeFromNow;

        getEstimate.add(1, "days").set({hours: '10', minutes: '00'})
    }
}

export const finalEstimate = (value:number, lang:string, formatPrice:any, getEstimate?:any)=> {
    const checkedType = checkTypeforEstimate(formatPrice);
    const estimatedPrice = getPriceEstimate(value, lang) * checkedType;
    const estimatedDuration = getTimeEstimate(value, lang) * checkedType;
    const estimatedWorkDone = getDeliveryTime(estimatedDuration, getEstimate)
    return [estimatedPrice, estimatedWorkDone]
}

