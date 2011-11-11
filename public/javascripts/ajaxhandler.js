$(document).ready(function() {
	$("#createUser").click(function() {
		senddata()
	});
});

function senddata() {
	console.log($('#user').val());
	var pw = sha256_digest(sha256_digest($('#pass').val()));
	console.log(pw);
	$.ajax({
		type: 'POST',
		url: '/u/new/',
		data: {
			pass: pw,
			name: $('#name').val(),
			user: $('#user').val(),
			email: $('#email').val()
		},
		success: function() {alert("Hello");},
	});
};