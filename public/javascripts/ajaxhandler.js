$(document).ready(function() {
	$("#successHandler").hide();
	$("#createUser").click(function() {
		$("#successHandler").hide();
		var pw = sha256_digest(sha256_digest($('#pass').val()));
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
			success: function(res) {
				console.log(res);
				$("#successHandler").attr("class", ".alert-message .block-message .success");
				$("#successHandler").text("User created!! Woohoo!");
				$("#successHandler").show();
			},
			error: function(err) {
				$("#successHandler").attr("class", ".alert-message .block-message .error");
				$("#successHandler").text("Oops, looks like something went wrong! Please try again");
				$("#successHandler").show();
		}});
	});
	$("#enterMatch").click(function() {
		$("#successHandler").hide();
		$.ajax({
			type: 'POST',
			url: '/m',
			data: {
				wuser: $('#wuser').val(),
				wpass: sha256_digest(sha256_digest($('#wpass').val())),
				luser: $('#luser').val(),
				lpass: sha256_digest(sha256_digest($('#lpass').val()))
			},
			success: function() {
				$("#successHandler").attr("class", ".alert-message .block-message .success");
				$("#successHandler").text("Match created!! Woohoo!");
				$("#successHandler").show();
			},
			failure: function(err) {
				$("#successHandler").attr("class", ".alert-message .block-message .error");
				$("#successHandler").text("Oops, looks like something went wrong! Please try again");
				$("#successHandler").show();
			}
		});
	});
});
