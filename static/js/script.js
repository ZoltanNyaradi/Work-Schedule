document.addEventListener("DOMContentLoaded",function(){
	
	loadSchedule(loadDatesOfTheWeek());
	// Load the schedule on the screen

	document.getElementById("previous").addEventListener("click",(event)=>{changeWeek(-6)});
	document.getElementById("next").addEventListener("click",(event)=>{changeWeek(+8)});

	if (document.getElementById("edit-schedule").innerHTML!==""){
		loadToday();
		// Load the current date to edit-schedule

		let shiftClass = document.getElementsByClassName("shift");
		for(let i=0; i<4; i++){
			shiftClass[i].addEventListener("click",(event)=>{klickToShift()});
		}
		document.getElementById("vacation").addEventListener("click",(event)=>{klickToVacation()});
		document.getElementById("sick").addEventListener("click",(event)=>{klickToSick()});
	
	loadEmployeesToEditSchedule();
	}

	loadMessages();


})

function loadSchedule(datesOfTheWeek){
	/***
	 * Load the schedule table on the screen
	 */
	
	let schedule = document.getElementById("schedule");
	// Asign variable for schedule div
	let row = [];
	// Declare an array for rows
	let column = [];
	// Declare an array for columns
	let cell = [];
	// Declare an array for cells
	let daysOfTheWeek = ["","Monday","Tuesday","Wednesday","Thurstday","Friday","Saturday","Sunday"];
	// Declare an array for days and fill it up
	// First column for the employees,
	// so the first variable will be an empty string
	
	let employees = loadEmployees();
	// Declare an array for employees and fill it up
	// The first element will be "" here as well
	let numberOfEmployees = employees.length;
	// Declare a variable to count the employees
	
	let shiftsOfTheWeek = loadSchiftOfTheWeek(datesOfTheWeek[0], numberOfEmployees, employees, datesOfTheWeek);
	// Declare a matrix for shifts

	

	for(let i = 0; i < numberOfEmployees; i++){
		row.push(document.createElement("div"));
		// Make a row for every employee and one more for the dates
		row[i].classList.add("row");
		// Add the row class to them
  		schedule.children[0].children[0].appendChild(row[i]);
  		// Place it in the schedule

  		column.push([]);
  		// Add an empty Array for columns
  		cell.push([]);
  		// Add an empty Array for cells

  			for(let j = 0; j < 8; j++){
  				column[i].push(document.createElement("div"));
  				// Make a column for the emplyoees and 7 for the days of the week
  				column[i][j].classList.add("col");
  				// Add col class to them
  				row[i].appendChild(column[i][j])
  				// Add the columns to a row

  				if(i==0){
  					// If we are in the first row
  					column[i][j].classList.add("first-row");
  					// Add the first row class to it
  					cell[i].push(document.createElement("p"));
  					// Add a paragraph to the cell
  					cell[i][j].innerHTML = `${daysOfTheWeek[j]} <br/> ${datesOfTheWeek[j]}`;
  					// Add the proper day and date to it
  					column[i][j].appendChild(cell[i][j]);
  					// Add it to a column
  				}
  				else if(j==0){
  					// Else if it is the first column but not the first row
  					if (employees[i].groups%2==0){
  						// Color the first cells by positions
  						// If the employee in an even group
  						column[i][j].classList.add("first-col-primary");
  						// Add to the primary color group
  					}else{
  						column[i][j].classList.add("first-col-secondary");
  						// Else add to the secondary color group
  					}
  					column[i][j].classList.add("first-col");
  					// Add the first-col class to it
  					cell[i].push(document.createElement("p"));
  					// Add a paragraph to the cell
  					cell[i][j].innerHTML = employees[i].username;
  					// Write an emplyoee's name in it
  					column[i][j].appendChild(cell[i][j]);
  					// The cell to a column
  				}else{
  					// If it is neither first row or first column
  					if(shiftsOfTheWeek[i-1][j-1]===undefined){
  						// If there is no related shift to the cell
  						column[i][j].innerHTML = "";
  						// Add an empty text to the cell
  					} else {
  						// If there is a related shift to the cell
  					column[i][j].innerHTML = shiftsOfTheWeek[i-1][j-1];
  						// Add this shift as a text to it
  					}
  					if(document.getElementById("edit-schedule").innerHTML!==""){
	  					// Add event listener for every cell if the user is an admin
	  					column[i][j].addEventListener("click",(event)=>{
	  						fillForm(datesOfTheWeek[j], employees[i].id)
	  					});
  					}
  						// Fill employee and date to editSchedule 
  				}

  			}
	}
}

function loadEmployees(){
	/**
	 * Load emplyoees from database
	 * Return them grouped
	 */
	const users = JSON.parse(document.getElementById('users-data').textContent);
	// Assign a variabble for users with json
	groups = [];
	// Declare an array for groups
	users.forEach ((user) =>{
		// Collect groups
		if(user.is_staff){
		group = user.groups;
		if(!groups.includes(group)){
			groups.push(group);}
		}})

	orderedUsers=[""];
	// Declare an array for employees,
	// Assign an empty string for the first one

	groups.forEach((group) =>{
		// Fill up the array grouped
		users.forEach((user) =>{
			if(group==user.groups && user.is_staff){
				orderedUsers.push(user);
			}
		});
	});

	return orderedUsers;
	// Return employees
}

function loadToday(){
	/**
	 * Loads the current day into edit-schedule 
	 */
	const today = new Date().toISOString().slice(0, 10);
	// Assign today date for a variable
	document.getElementById("shift-date").value=today;
	// Set the current day in edit-schedule
}

function klickToShift(){
	/**
	* Give a color for shift inputs,
	* what shows that they are active
	* Check out check-boxes in edit-schedule
	*/
	let shifts = document.getElementsByClassName("shift");
	// Assign variable for shift inputs
	for(let i=0; i<4; i++){
		// Set color to offwhite by shift inputs
		shifts[i].style.backgroundColor = "#EEEEFF";
	}
	document.getElementById("vacation").checked=false;
	// Check out vacation check-box
	document.getElementById("sick").checked=false;
	// Check out sick check-box
}

function klickToVacation(){
	/**
	 * Give an inactive color
	 * and clear shift inputs
	 * Check off sick check-box
	 */
	let shiftClass = document.getElementsByClassName("shift");
	// Assign variable for shift inputs
	for(let i=0; i<4; i++){
		// Clear and color shift inputs
		shiftClass[i].style.backgroundColor = "#EEEEFF88";
		shiftClass[i].value = undefined;
	}
	document.getElementById("sick").checked=false;
	// Check out sick check-box
}

function klickToSick(){
	/**
	 * Give an inactive color
	 * and clear shift inputs
	 * Check off vacation check-box
	 */
	let shiftClass = document.getElementsByClassName("shift");
	// Assign variable for shift inputs
	for(let i=0; i<4; i++){
		// Clear and color shift inputs
		shiftClass[i].style.backgroundColor = "#EEEEFF88";
		shiftClass[i].value = undefined;
	}
	document.getElementById("vacation").checked=false;
	// Check out vacation check-box
}

function loadEmployeesToEditSchedule(){
	/**
	 * Fill up employee-name
	 * with the name of the emplyoees
	 */
	const users = JSON.parse(document.getElementById('users-data').textContent);
	// Assign variable for users
	let i=0;
	// Assign an index variable 
	let employeeName = document.getElementById("employee-name");
	// Assign varaible for employee-name select
	let options=[];
	// Declare array for options

	users.forEach ((user)=>{
		if (user.is_staff){
			// If someone is employee
			options[i] = document.createElement("option");
			// Create a new option
			options[i].value = user.id;
			// Add id as value
			options[i].text = user.username;
			// Add name as text 
			employeeName.appendChild(options[i]);
			// Add it to the select
		}
		i++;
		// Increase the index value
	})
}

function loadDatesOfTheWeek(){
	/**
	 * Return the current week's dates
	 */
	const date = new Date();
	// Assign a date constant
	let todayIs = date.getDay();
	// Get the current day of the week
	if (todayIs==0){
		// Set the current monday's date
		date.setDate(date.getDate()-6);
	} else{
		date.setDate(date.getDate()-todayIs+1)
	}

	let datesOfTheWeek = [];
	// Declare a variable for dates
	datesOfTheWeek.push("");
	// Push an empty string for the first column
	for (let i=0; i<7; i++){
		// Fill up the array with dates
		datesOfTheWeek.push(date.toISOString().slice(0, 10));
		date.setDate(date.getDate()+1);
	}
	return datesOfTheWeek;
	// Return the dates of the week
}

function loadSchiftOfTheWeek(monday, numberOfEmployees, employees, datesOfTheWeek){
	/**
	 * Loads shifts into the schedule
	 */

	const schedules = JSON.parse(document.getElementById("schedule-data").textContent);
	// Assign a variable for schedules in database
	let shiftsOfTheWeek = [];
	// Declare an array for current weeks shifts
	let shift = "";
	// Declare a string for shifts
	let shiftExist = false;
	// Declare a boolean what shows if a is already exist

	/* With the 2 outter loop
		we iterate throw the schedule's shift cells
		Then in the inner loop we check
		if we find an existing shift for the related date and employee
		then we write it in the schedule
	*/
	for (let i = 0; i<numberOfEmployees; i++){
		// Iterate as much as employees are
		shiftsOfTheWeek.push([]);
		// Incrase the size of the Array

		for (let j = 1; j<8; j++){
			// Iterate 7 times, as there are 7 days
			// Start from 1 because of indexing
			shiftExist=false;
			// set back shiftExist to false
			schedules.forEach((schedule)=>{
				// Iterate through shifts
				if(schedule.user==employees[i].id && schedule.date == datesOfTheWeek[j]){
					// Is the shift from database has the same date and emplyoee name as the cell
					shiftExist = true;
					// Such a schift exist
					if(schedule.vacation==true){
						// Set shift to "Vacation" if in the database this value is true
						shift = "Vacation";
					} else {
						if (schedule.sick==true){
							// Set shift to "Sick" if in the database this value is true
							shift = "Sick";
						} else {
							// In other case get the shift time from the database
							shift = schedule.begin_of_work_1.slice(0,5) + "-" +
							    schedule.end_of_work_1.slice(0,5);

							if(schedule.begin_of_work_2 != null){
							// If there is a second shift, then concat it to shift
								shift += "<br class='shift-break'>"+ schedule.begin_of_work_2.slice(0,5) + "-" +
							    schedule.end_of_work_2.slice(0,5);
							}
						}

					}					
				}

				
			})
			if(shiftExist){
				// If shift was found push it into the matrix
				shiftsOfTheWeek[i].push(shift);
			} else {
				// If not push an empty string to the matrix
				shiftsOfTheWeek[i].push("");
			}
		}
	}
	shiftsOfTheWeek.shift();
	// Remove the first row
	return shiftsOfTheWeek
	// Return the shifts
}

function fillForm(date, employee){
	/**
	* Fill date and employee in edit schedule
	* with the given properties. 
	*/
	document.getElementById("employee-name").value = employee;
	document.getElementById("shift-date").value = date;
}

function changeWeek(change){
	/**
	 * Either loads the previous
	 * or the next week,
	 * depending on the parameter
	 */

	let scheduleContainer = document.getElementById("schedule-container");
	// Get the container of the schedule

	const oldMonday = scheduleContainer.children[0].children[1].innerHTML.slice(14,25);
	// Get the date of the currently loaded monday
	const year = oldMonday.slice(0,5);
	// Slice the year
	const month = oldMonday.slice(6,8);
	// Slice the month
	const day = oldMonday.slice(9);
	// Slice the day

	let monday = new Date(year, month-1, day);
	// Declare a date type version of monday
	monday.setDate(monday.getDate() + change);
	// Get the next or previous monday

	let date = monday;
	// Declare a new variable for the iteration
	let datesOfTheWeek = [""];
	// Create an array for the new week

	for (let i=0; i<7; i++){
		// Fill the array with the new dates
		datesOfTheWeek.push(date.toISOString().slice(0, 10));
		date.setDate(date.getDate()+1);
	}

	scheduleContainer.innerHTML="";
	// Delete the old schedule

	loadSchedule(datesOfTheWeek);
	// Create the new schedule
}

function loadMessages(){
	/**
	* Load messages from the database to the screen
	*/
	let read = document.getElementById("read");
	// Assign variable for target div
	let textBoubble = [];
	// Declare array for text boubbles
	let i = 0;
	// Declare an indexvalue
	const messages = JSON.parse(document.getElementById("messages-data").textContent);
	// Assign constance for messages
	const employees = JSON.parse(document.getElementById("users-data").textContent);
	// Assign constance for users
	let name="";
	// Declare a variable for employees' name
	
	messages.forEach((message)=>{
		// Go through the messages
		employees.forEach((employee)=>{
			/* Find the write of the message*/
			if(employee.id==message.user){
				name = employee.username;
			}
		})
		textBoubble.push(document.createElement("div"));
		// Create a dive for the boubble
		textBoubble[i].innerHTML = `<div class=text-bubble>
            <p class="message-sender">${name}<p>
            <p class="message-body">${message.body}</p>
            <p class="message-date">${message.created_on}<p>
            </div>`
            // Fill up the boubble with writer, text, an creation time
		read.appendChild(textBoubble[i]);
		// Add it to the page
	i++;
	// Increase idex value	
	});
}