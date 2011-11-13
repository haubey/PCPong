$(document).ready(function() {
	$("#createUser").click(function() {
		var pw = sha256_digest(sha256_digest($('#pass').val()));
		console.log(pw);
		$.ajax({
			type: 'POST',
			url: '/u/new/',
			data: {
				pass: pw,
				name: $('#name').val(),
				user: $('#user').val(),
				email: $('#email').val(),
				masspass: $('#masspass').val()
			},
			success: function() {alert("Hello");},
		});
	});
	$("#enterMatch").click(function() {
		$.ajax({
			type: 'POST',
			url: '/m',
			data: {
				wuser: $('#wuser').val(),
				wpass: sha256_digest(sha256_digest($('#wpass').val())),
				luser: $('#luser').val(),
				lpass: sha256_digest(sha256_digest($('#lpass').val()))
			},
			success: function() {alert("Hello");},
		});
	});
});
