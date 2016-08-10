// JavaScript Document
// credit self:

// Validate the sender name
function validate_sender_name() {

	var Numbers= /\d/;
	var illegalChars= /[\(\)\<\>\,\;\:\\\[\]\{\}|!\@\#\$\%\^\&\*\+\=]/;
	var name_error = document.getElementById('name_error');

	// check if empty
	if (document.forms['contact_form'].elements['sender_name'].value == "") {
		name_error.innerHTML = "Please enter your name before attempting to send.";
		return false;
	}
	//check for numbers	
	else if (Numbers.test(document.forms['contact_form'].elements['sender_name'].value)) {
		name_error.innerHTML = "Please do not use numbers in the name field.";
		return false;
	}
	//check for illegal chars
	else if (illegalChars.test(document.forms['contact_form'].elements['sender_name'].value)) {
		name_error.innerHTML = "Please do not use symbols in the name field.";
		return false;
    }
	else {
		name_error.innerHTML = "&nbsp;";
		return true;
	}

}

// Validate sender email
function validate_sender_email() {

	var emailFilter = /^[^@]+@[^@.]+\.[^@]*\w\w$/ ;
	var illegalChars= /[\(\)\<\>\,\;\:\\\"\[\]]/ ;
	var email_error = document.getElementById('email_error');
	
	// check if empty
	if (document.forms['contact_form'].elements['sender_email'].value == "") {
		email_error.innerHTML = "Please enter a valid email address before attempting to send.";
		return false;
	}
	//check if email is structured correctly
	else if (!emailFilter.test(document.forms['contact_form'].elements['sender_email'].value)) {
		email_error.innerHTML = "Please confirm you entered your email address correctly before attempting to send.";
		return false;
	}
	// Illegal Characters?
	else if (illegalChars.test(document.forms['contact_form'].elements['sender_email'].value)) {
		email_error.innerHTML = "Your e-mail address contains invalid characters. Please correct it.";
		return false;
    }
	//evals true empty error
	else {
		email_error.innerHTML = "&nbsp;";
		return true;
	}

}

// Has a subject been selected
function validate_sender_subject() {

	var subject_error = document.getElementById('subject_error');

	//Check if the sender selected a subject
	if (document.forms['contact_form'].elements['sender_subj'].value == 0) {
		subject_error.innerHTML = "Please choose a subject before attempting to send.";
		return false;
	}
	//evals true empty error
	else {
		subject_error.innerHTML = "&nbsp;";
		return true;
	}

}

// Validate Sender Messaage, Just making sure we're not empty
function validate_sender_msg() {

	var msg_error = document.getElementById('msg_error');

	// Check if the sender_subject field is empty
	if (document.forms['contact_form'].elements['sender_msg'].value == "" || document.forms['contact_form'].elements['sender_msg'].value.length < 2) {
		msg_error.innerHTML = "Please enter a message before attempting to send.";
		return false;
	}
	else {
		msg_error.innerHTML = "&nbsp;";
		return true;
	}
 
}

//Re-Validate the whole shebang on submit
function validate_onSubmit() {
	if ( validate_sender_name() ) {
		if ( validate_sender_email() ) {
			if ( validate_sender_subject() ) {
				if (validate_sender_msg() ) {
					return true;
				}
			}
		}
	}
	return false;
}