let plusbtn = document.querySelector(".plus");
let body = document.querySelector("div");
let grid = document.querySelector(".grid");
let deleteBtn = document.querySelector(".minus");

let deleteMode = false;

let allFilterChildren = document.querySelectorAll(".filter div");

for(let i = 0; i < allFilterChildren.length; i++){
    allFilterChildren[i].addEventListener("click",function(e){
        if(e.currentTarget.classList.contains("color-selected")){
            e.currentTarget.classList.remove("color-selected")
            loadTask();
            return;
        } else {
            e.currentTarget.classList.add("color-selected");
        }
        let allFilterChildrenColor = e.currentTarget.classList[0];
        
        // console.log(allFilterChildrenColor)

        loadTask(allFilterChildrenColor);
    })
}

if (localStorage.getItem("AllTickets") == undefined) {
    let allTickets = {};
    allTickets = JSON.stringify(allTickets);
    localStorage.setItem("AllTickets", allTickets)
}

loadTask();

deleteBtn.addEventListener("click", function (e) {
    if (e.currentTarget.classList.contains("delete-selected")) {
        e.currentTarget.classList.remove("delete-selected");
        deleteMode = false;
    } else {
        e.currentTarget.classList.add("delete-selected")
        deleteMode = true;
    }
})

plusbtn.addEventListener("click", function () {
    deleteMode = false;
    deleteBtn.classList.remove("delete-selected")
    let preModal = document.querySelector(".modal");
    if (preModal != null) {
        return;
    }
    let div = document.createElement("div");
    div.classList.add("modal")
    div.innerHTML = `
    <div class="text-area-section">
    <div class="inner-text-container" contenteditable="true">
    </div>
    </div>
    <div class="filter-priority-section">
        <div class="priority-inner-container">
            <div class="filter-priority pink"></div>
            <div class="filter-priority green"></div>
            <div class="filter-priority blue"></div>
            <div class="filter-priority black selected"></div>
        </div>
    </div>`

    body.append(div);

    let filterpriority = div.querySelectorAll(".filter-priority")
    let ticketColor = "black";
    for (let i = 0; i < filterpriority.length; i++) {
        filterpriority[i].addEventListener("click", function (e) {

            for (let j = 0; j < filterpriority.length; j++) {
                filterpriority[j].classList.remove("selected");
            }

            e.currentTarget.classList.add("selected");
            ticketColor = e.currentTarget.classList[1];

        })
    }

    let textContainer = div.querySelector(".inner-text-container");
    let color = ["pink", "blue", "green", "black"];

    textContainer.addEventListener("keypress", function (e) {
        // console.log(e.key)
        if (e.key == "Enter") {

            let id = uid();
            let task1 = e.currentTarget.innerText
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            let allTicketsObj = {
                color: ticketColor,
                taskValue: task1
            }
            console.log(id);
            allTickets[id] = allTicketsObj

            localStorage.setItem("AllTickets", JSON.stringify(allTickets))

            let ticketDiv = document.createElement("div");
            ticketDiv.classList.add("ticket");
            ticketDiv.setAttribute("ticket-id", id)
            ticketDiv.innerHTML = ` 
            <div ticket-id = "${id}" class="ticket-color ${ticketColor} "></div>
            <div class="ticket-id">
            #${id}
            </div>
            <div ticket-id = "${id}" contenteditable = "true" class="task-section">${task1}</div>
        `
            let ticketColorDiv = ticketDiv.querySelector(".ticket-color")

            let ticketTaskSection = ticketDiv.querySelector(".task-section");

            ticketTaskSection.addEventListener("input", function (e) {
                let updatedTask = e.currentTarget.innerText;
                let currID = e.currentTarget.getAttribute("ticket-id");
                let allTickets = JSON.parse(localStorage.getItem("AllTickets"))
                allTickets[currID].taskValue = updatedTask;
                localStorage.setItem("AllTickets", JSON.stringify(allTickets));
            })

            ticketColorDiv.addEventListener("click", function (e) {
                // console.log(id);
                let currID = ticketDiv.getAttribute("ticket-id");
                let index = -1;
                let currColor = ticketColorDiv.classList[1];
                for (let i = 0; i < color.length; i++) {
                    if (currColor == color[i]) {
                        index = i;
                    }
                }

                index++;
                index = index % 4;
                let newColor = color[index];

                let allTickets = JSON.parse(localStorage.getItem("AllTickets"))
                allTickets[currID].color = newColor;
                localStorage.setItem("AllTickets", JSON.stringify(allTickets));
                ticketColorDiv.classList.remove(currColor);
                ticketColorDiv.classList.add(newColor)
            })

            ticketDiv.addEventListener("click", function () {
                if (deleteMode) {
                    let currID = ticketDiv.getAttribute("ticket-id")
                    let allTickets = JSON.parse(localStorage.getItem("AllTickets"))

                    ticketDiv.remove();

                    delete allTickets[currID];

                    localStorage.setItem("AllTickets", JSON.stringify(allTickets))
                }
            })

            grid.append(ticketDiv)

            div.remove()

            // console.log(ticketColor)
        }


    })
})

function loadTask(color) {
    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

    let ticketsOnUi = document.querySelectorAll(".ticket");

    for(let i = 0; i < ticketsOnUi.length; i++){
        ticketsOnUi[i].remove()
    }

    for (x in allTickets) {
        let currTicketID = x;
        let singleTicketObj = allTickets[x];

        // if(color && color != singleTicketObj.color) continue;

        if(color){
            if(color != singleTicketObj.color) continue;
        }

        let ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");
        ticketDiv.setAttribute("ticket-id", currTicketID)
        ticketDiv.innerHTML = ` 
            <div ticket-id = "${currTicketID}" class="ticket-color ${singleTicketObj.color} "></div>
            <div class="ticket-id">
            #${currTicketID}
            </div>
            <div ticket-id = "${currTicketID}" contenteditable = "true" class="task-section">${singleTicketObj.taskValue}</div>
        `
        let ticketColorDiv = ticketDiv.querySelector(".ticket-color")

        let ticketTaskSection = ticketDiv.querySelector(".task-section");

        ticketTaskSection.addEventListener("input", function (e) {
            let updatedTask = e.currentTarget.innerText;
            let currID = e.currentTarget.getAttribute("ticket-id");
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"))
            allTickets[currID].taskValue = updatedTask;
            localStorage.setItem("AllTickets", JSON.stringify(allTickets));
        })

        ticketColorDiv.addEventListener("click", function (e) {
            // console.log(id);
            let currID = ticketDiv.getAttribute("ticket-id");
            let index = -1;
            let currColor = ticketColorDiv.classList[1];
            for (let i = 0; i < color.length; i++) {
                if (currColor == color[i]) {
                    index = i;
                }
            }

            index++;
            index = index % 4;
            let newColor = color[index];

            let allTickets = JSON.parse(localStorage.getItem("AllTickets"))
            allTickets[currID].color = newColor;
            localStorage.setItem("AllTickets", JSON.stringify(allTickets));
            ticketColorDiv.classList.remove(currColor);
            ticketColorDiv.classList.add(newColor)
        })

        ticketDiv.addEventListener("click", function () {
            if (deleteMode) {
                let currID = ticketDiv.getAttribute("ticket-id")
                let allTickets = JSON.parse(localStorage.getItem("AllTickets"))

                ticketDiv.remove();

                delete allTickets[currID];

                localStorage.setItem("AllTickets", JSON.stringify(allTickets))
            }
        })
        grid.append(ticketDiv)
    }
}