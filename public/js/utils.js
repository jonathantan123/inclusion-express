// define your functions like this so they're testable


// /1. Create Object to hold dates of res as keys, and already reserved times in an array as value


  function getAvail(array) {
    let object = {} 
    let slots = ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"]
    let totalTables = 10 
    slots.forEach(slot => object[slot] = totalTables)
    
    array.forEach((resp) => {
      
      let time = new Date(resp.slot).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true } )
      let half 
      time.includes("30")?  half = `${parseInt(time[0]) + 1}` +  ":00 PM": half = `${time[0]}` + ":30 PM" 
        if(object[time]) {   
            object[time] -= 1
                if(object[half]) {  
                    object[half] -= 1
                }
            } 
        })

        return object
    }

 




