// jest won't error out on DOM calls.


document.addEventListener("DOMContentLoaded", ()=>{

    ///hold data to filter through front end 
    let allRes
    let chosenDate 
    let existingRes 
    let avail = {} /// available reservations 

    //////

    function selectHandler(data, elem) { 
        chosenDate = new Date(data.date).toISOString().substr(0,10)  
        getRes()   
    }


    let myCalendar = new VanillaCalendar({
        selector: "#myCalendar", 
        onSelect: selectHandler    
    })
        

    let dates =  {}

    let mainContainer = document.getElementById("body-container")

    // let button = document.createElement("button")


    //// create elementts 
   
    /// hidden form to display on click 
 function createForm (node) { 
    let formContainer = document.createElement("form")
    formContainer.id = "form"
    let input = document.createElement("input")
    let submit = document.createElement("input")
    submit.type = "submit"
    submit.dataset.id = "submit"
    input.placeholder = "name"
    formContainer.style.display = "none"
    formContainer.appendChild(input)
    formContainer.appendChild(submit)
    node.appendChild(formContainer)
    formContainer.addEventListener("submit", formHandler)

 }


  ///// Render Exisiting Reservations 

  function displayExisting() {
      let container = document.getElementById("existing-container")  
      container.innerHTML = ""
      let existingRes = allRes.filter((res) => res.slot.includes(chosenDate))

      existingRes.forEach((res) => {   
        let time = new Date(res.slot).toLocaleString('en-US', { hour: 'numeric', hour12: true })
        let resTag = document.createElement("p")
        resTag.innerText = `${res.name} is dining at ${time}`
        container.appendChild(resTag)
        
      })
  }

  //// Render Available Time Slots
  
  function renderTimeSlots() { 
      
    let resContainer = document.getElementById("reservations-container")
    resContainer.innerHTML = ""

      
    Object.keys(avail).forEach((slot) => { 
        
        let slotContainer = document.createElement("div")
        let timeSlot = document.createElement("p")

        timeSlot.innerHTML = slot
        slotContainer.appendChild(timeSlot)
        
        if(avail[slot] > 0) { 
            let button = document.createElement("button")
                button.innerText = "Reserve"
                button.id = slot
                slotContainer.appendChild(button)
                button.addEventListener("click", clickHandler)

            createForm(slotContainer)
        } else { 
            let span = document.createElement("span")
                span.innerText = "Unavailable"
                slotContainer.appendChild(span)
        }

        resContainer.appendChild(slotContainer)

        
     
    })

  }
  
  //// event handlers 

  function formHandler(e) {
        
    let object = {
        name: e.target[0].value, 
        slot: e.target.parentNode.querySelector("p").innerText, 
        date: chosenDate
    }

    fetch('http://localhost:3000/reservations', {
     method: "POST", 
     headers: {
       "content-type": 'application/json', 
       "accept": 'application/json'
     }, 
     body: JSON.stringify(object)
   })
 }

  function clickHandler (e) {
    
    if(e.target.innerText === "Reserve") {
        let parent =e.target.parentNode   
        parent.querySelector("#form").style.display = "block"  
    }

}
  


// helpers 

// /1. Create Object to hold dates of res as keys, and already reserved times in an array as value
  function getDates() {
      
    let slots = ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"]
    let totalTables = 10 
    slots.forEach(slot => avail[slot] = totalTables)
    
    existingRes.forEach((resp) => {
      let time = new Date(resp.slot).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true } )
      let half 
      time.includes("30")?  half = `${parseInt(time[0]) + 1}` +  ":00 PM": half = `${time[0]}` + ":30 PM" 
        if(avail[time]) {   
            avail[time] -= 1
                if(avail[half]) {  
                    avail[half] -= 1
                }
            } 
        })
    }

  ////2. Filter all res to selected date 

  function filterAll() { 
    return allRes.filter((res) => res.slot.includes(chosenDate))
  }
  
 
//// Inital fetch to get all exisiting res and save to local array dates 

function getRes () { 

    
    fetch("http://localhost:3000/reservations")

      .then(resp => resp.json())
      .then( (resp) => {

        allRes =resp
        existingRes = filterAll()
        getDates()
        displayExisting()
        renderTimeSlots()
    
      })
  }



})



