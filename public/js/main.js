// jest won't error out on DOM calls.
// const {getDates} = require('./utils.js')

document.addEventListener("DOMContentLoaded", ()=>{


    ///hold data to filter through front end 
    let allRes
    let chosenDate 
    let existingRes 
    let avail  /// available reservations 

    //////

    function selectHandler(data, elem) { 

        let date = new Date(data.date).toLocaleString('en-US')
       
        

        chosenDate = date.substr(0,9)  
        

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
        e.target.style.display = "none"
        let parent =e.target.parentNode   
        
        parent.querySelector("#form").style.display = "block"  
    }

}
  


// helpers 

  
  ////2. Filter all res to selected date 


  function filterAll() { 
      
    return allRes.filter((res) => res.slot.includes(chosenDate))
  }

///// 3. Reformat dates of each resp slot 

  function reFormatDates(resp) {
       resp.forEach((res) => {
       return  res.slot = new Date(res.slot).toLocaleString('en-US')
      } ) 
      return resp 

  }


 
//// Inital fetch to get all exisiting res and save to local array dates 

function getRes () { 

    
    fetch("http://localhost:3000/reservations")

      .then(resp => resp.json())
      .then( (resp) => {
        
        allRes =reFormatDates(resp) 
        existingRes = filterAll()
        debugger
        avail = getAvail(existingRes)
        displayExisting()
        renderTimeSlots()
    
      })
  }



})



