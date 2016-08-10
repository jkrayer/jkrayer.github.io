// JavaScript Document
//run the createRequest function to send form data to the browser/server
function sendEmail () {

	//before we even send we should validate the entire form. rerun each validation and halt this function on any errors
	var validSender = validate_sender_name();
	var validEmail = validate_sender_email();
	var validSubj = validate_sender_subject();
	var validMsg = validate_sender_msg();
	
	//if any validations fail end the send function
	if ( validSender == false || validEmail == false || validSubj == false || validMsg == false ) {return;}

	//Gather The Values of the form inputs to send to the server
	var cfName = document.getElementById("sender_name").value;
	var cfEmail = document.getElementById("sender_email").value;
	var cfSubj = document.getElementById("sender_subj").value;
	var cfMsg = document.getElementById("sender_msg").value;
	
	var url = "php/contactform.php";
	
	request.open("POST", url, true);
	request.onreadystatechange = updatePage;
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	request.send("sender_name=" + escape(cfName) + 
				 "&sender_email=" + escape(cfEmail) + 
				 "&sender_subj=" + cfSubj + 
				 "&sender_msg=" + escape(cfMsg));

} //end function

//Look at what the php script returns and output error or success messages
function updatePage() {
	//only run this when the server sends the done message
	if (request.readyState == 4) {
		//confirm the request is correct ELSE error message
		if (request.status == 200) {
			//first get text returned from the server
			var response = request.responseText;
			
			switch (response) {
				case "1": //PHP errors on the name
					document.getElementById("contact_msg").innerHTML = "Please enter a name that is at least 2 characters long and does not contain numbers.<br />&nbsp;";
					document.getElementById("contact_msg").className = "send_error";
					break;
				case "2":
					document.getElementById("contact_msg").innerHTML = "Please enter a valid email address before attempting to send.<br />&nbsp;";
					document.getElementById("contact_msg").className = "send_error";
					break;
				case "3":
					document.getElementById("contact_msg").innerHTML = "Please choose a subject before attempting to send.<br />&nbsp;";
					document.getElementById("contact_msg").className = "send_error";
					break;
				case "4":
					document.getElementById("contact_msg").innerHTML = "Please enter a message before attempting to send.<br />&nbsp;";
					document.getElementById("contact_msg").className = "send_error";
					break;
				case "5":
					document.getElementById("contact_msg").innerHTML = "There was an error on the server and your message failed to send. Please try again later<br />or email me at jameskrayer [at] yahoo dot com.";
					document.getElementById("contact_msg").className = "send_error";
					break;
				case "7":
					document.getElementById("contact_msg").innerHTML = "Your email has been sent successfully. I will be in touch with you soon.<br />&nbsp;";
					document.getElementById("contact_msg").className = "send_good";
					//Send was successful so clear the form fields
					document.getElementById("sender_name").value = "";
					document.getElementById("sender_email").value = "";
					document.getElementById("sender_subj").value = 0;
					document.getElementById("sender_msg").value = "";
					break;
				
				default: //The Message sent so no errors returned
					document.getElementById("contact_msg").innerHTML = "This is returning the default. Why?";
			} //End Switch

		}//end if 200
		else {
			alert("Error. Request status is " + request.status);
		}
	}//end if 4
} //end function
