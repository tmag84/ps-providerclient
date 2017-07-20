$(function() {
	$("#registerForm").validate({
		rules: {
			inputConfirmPassword: {
				equalTo: "#inputPassword"
				}
		}
	});
});