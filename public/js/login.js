var modalBg = document.querySelector(".login-modal-bg");
var modalClose = document.querySelector(".close");
var navbar = document.querySelector("nav");
var OTP = document.getElementById("OTP");
var phoneNumber = document.getElementById("phoneNumber");
var otpConfirm = document.getElementById("confirmLogin");
var phoneDiv = document.getElementById("phoneDiv");
var loginContinue = document.getElementById("loginContinue");
var loginModal = document.querySelector(".login-modal");
var modalBack = document.getElementById("modalBack");
var joinusbtn = document.getElementById("landing-joinus");
var sidejoinusbtn = document.getElementById("sidebar-joinus");

phoneDivActive = () => {
    phoneDiv.style.display = "block";
    loginModal.classList.add("phoneDivActive");
    OTP.style.display = "none";
    loginModal.classList.remove("OTPActive");
    phoneNumber.innerHTML = "";
    phoneDiv.style.display = "flex";
};

OTPDivActive = () => {
    phoneDiv.style.display = "none";
    loginModal.classList.remove("phoneDivActive");
    OTP.style.display = "block";
    loginModal.classList.add("OTPActive");
    phoneNumber.classList.add("phone");
};

modalCloseFunction = () => {
    modalBg.classList.remove("bg-active");
    phoneDivActive();
    document.getElementById("otp-div").reset();
};

modalOpenFunction = () => {
    modalBg.classList.add("bg-active");
    navbar.style.zIndex = "0";
};

modalClose.addEventListener("click", function() {
    modalCloseFunction();
});

loginContinue.onclick = function() {
	// alert(window.location.pathname);
    let inputText = parseInt(document.querySelector("#inputPhoneNo").value);
	document.getElementById("loginContinue").style.pointerEvents="none";
    phoneNumber.innerHTML = inputText;
	var regexp = /^\d{10}$/;
	if(regexp.test(inputText)) {
		firebase.auth().signInWithPhoneNumber("+91"+inputText, window.recaptchaVerifier).then((confirmationResult) => {
			console.log(confirmationResult);
			alert("An OTP has been sent to your provided mobile number")
			codeResult = confirmationResult;
			document.getElementById("loginContinue").style.pointerEvents="auto";
			OTPDivActive();
		}).catch(err => {
			if(err)
			{
				console.log(err);
				alert("Please try your number after some time");
				location.reload();
			}
		})
	}
	else
	{
		document.getElementById("loginContinue").style.pointerEvents="auto";
		alert("Please Enter Correct Mobile Number");
	}
};

otpConfirm.onclick = function() {
    let first = parseInt(document.querySelector("#otp-1").value);
	let second = parseInt(document.querySelector("#otp-2").value);
	let third = parseInt(document.querySelector("#otp-3").value);
	let fourth = parseInt(document.querySelector("#otp-4").value);
	let fifth = parseInt(document.querySelector("#otp-5").value);
	let sixth = parseInt(document.querySelector("#otp-6").value);
	let code = String(first)+String(second)+String(third)+String(fourth)+String(fifth)+String(sixth)
	code=code.trim();
	if(code.length == 6){
		document.getElementById("confirmLogin").style.pointerEvents="none";
		document.getElementById("confirmLogin").innerText = "Please Wait.."
		codeResult.confirm(code).then(async (result) => {
			console.log(result)
			var inputText = parseInt(document.querySelector("#inputPhoneNo").value);
			const response = await fetch("/phoneauth", {
				method  :"POST",
				mode : "same-origin",
				headers : {
				  'Content-type' : 'application/json'
				},
				body : JSON.stringify({phoneNumber : "+91"+inputText})
			  });
	
			  const decode = await response.json();
			  console.log(decode);
			  location.reload();
		}).catch(err => {
			console.log(err);
			location.reload();
		})
	}
	else{
		alert("Please Enter 6 digit OTP");
	}
};

modalBack.onclick = function() {
    phoneDivActive();
};

// code for otp input

let in1 = document.getElementById('otp-1'),
    ins = document.querySelectorAll('input[type="number"]'),
	 splitNumber = function(e) {
		let data = e.data || e.target.value; 
		if ( ! data ) return; 
		if ( data.length === 1 ) return; 
		
		popuNext(e.target, data);
	},
	popuNext = function(el, data) {
		el.value = data[0]; 
		data = data.substring(1); 
		if ( el.nextElementSibling && data.length ) {
			popuNext(el.nextElementSibling, data);
		}
	};

ins.forEach(function(input) {
	input.addEventListener('keyup', function(e){
		if (e.keyCode === 16 || e.keyCode == 9 || e.keyCode == 224 || e.keyCode == 18 || e.keyCode == 17) {
			 return;
		}
		
		if ( (e.keyCode === 8 || e.keyCode === 37) && this.previousElementSibling && this.previousElementSibling.tagName === "INPUT" ) {
			this.previousElementSibling.select();
		} else if (e.keyCode !== 8 && this.nextElementSibling) {
			this.nextElementSibling.select();
		}
		
		if ( e.target.value.length > 1 ) {
			splitNumber(e);
		}
	});
	
	input.addEventListener('focus', function(e) {
		if ( this === in1 ) return;
		
		if ( in1.value == '' ) {
			in1.focus();
		}
		
		if ( this.previousElementSibling.value == '' ) {
			this.previousElementSibling.focus();
		}
	});
});


in1.addEventListener('input', splitNumber);
