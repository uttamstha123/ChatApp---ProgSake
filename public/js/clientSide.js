const nextPage = document.querySelector(".continue");
const next = document.querySelector(".next");
let signup = "";

fetch("./serverResponse.env")
  .then((response) => response.text())
  .then((text) => {
    signup = text;
    if (signup == "true") {
      verified();
      nextPage.style = "pointer-events: visible";
      nextPage.style.background = "#5e27a7";
      // delete data inside serverResponse
    } else if (signup == "false") {
      next.innerText = "Wrong OTP";
      next.style = "background: red;";
      console.log("something went wrong");
    }
  });

function verified() {
  next.innerText = "Verified";
  next.style = "background: #dedede;";
  next.style = "color: var(--primary-clr)";
}

function verifyOTP(val) {
  if (val) {
    next.innerText = "Verify OTP";
    next.style = "background: var(--input-text); ";
  }
}
