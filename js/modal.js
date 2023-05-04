import { PVROOF_URL } from "./global.js";
import handleForm from "./finalSubmission.js";
import { setCurrencyName } from "./utils.js";

var openModalBtn = document.getElementById("property-open-modal");
var selectHouse = document.getElementById("select-house");
var selectSchool = document.getElementById("select-school");
var yesOwn = document.getElementById("yes-own");
var noOwn = document.getElementById("no-own");
var closeModal = document.getElementById("close-x-modal");
var prev = document.getElementById("prev-arrow");
var energyForm = document.getElementById("energy-form");
var userForm = document.getElementById("user-form");
var otpValidateForm = document.getElementById("otp-validate-form");
var addressForm1 = document.getElementById("address-form1");
var addressForm2 = document.getElementById("address-form2");

var propertyModal = document.getElementsByClassName("property-modal")[0];
var percent = document.getElementsByClassName("percent")[0];

let allTab = document.getElementsByClassName("tab");
const getProgressPercent = () => {
  return (100 / allTab.length) * (currentTab + 1).toString() + "%";
};

const dataObject = {
  address: "",
  property: "",
  ownThisProperty: null,
  battery: null,
  monthlyUsgae: null,
  monthlyBill: null,
  name: "",
  email: "",
  telephone: "",
};
var otp_inputs = document.querySelectorAll(".otp__digit");

var mykey = "0123456789".split("");

otp_inputs.forEach((_) => {
  _.addEventListener("keyup", handle_next_input);
});
function handle_next_input(event) {
  let current = event.target;
  let index = parseInt(current.classList[3].split("__")[2]);
  if (event.key === "Backspace") {
    current.value = "";
  } else {
    current.value = event.key;
  }

  if (event.keyCode == 8 && index > 1) {
    current.previousElementSibling.focus();
  }

  if (index < 4 && mykey.indexOf("" + event.key + "") != -1) {
    var next = current.nextElementSibling;
    next.focus();
  }
}
const setLocalStorageDataObject = (dataObject) => {
  window.localStorage.setItem("dataObject", JSON.stringify(dataObject));
};
const updateDataObject = (data) => {
  let newObject = JSON.parse(window.localStorage.getItem("dataObject"));
  Object.keys(data).forEach(function (key, index) {
    newObject[key] = data[key];
  });
  setLocalStorageDataObject(newObject);
};

document.getElementById("resend-otp").onclick = function () {
  const dataObject = JSON.parse(localStorage.getItem("dataObject"));
  validateTelephone(dataObject.telephone);
};

const validateTelephone = (telephone) => {
  var formdata = new FormData();

  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  formdata.append("telephone", telephone);

  fetch(`${PVROOF_URL}/proximity/generateOTP`, requestOptions)
    .then((response) => {
      if (response.status == 200) {
        response.json().then((result) => {
          percent.style.width = getProgressPercent();
          nextTab();
        });
      } else {
        response.json().then((result) => {
          alert(result.message);
        });
      }
    })
    .catch((error) => {});
};

const validateOTP = async (telephone, otp) => {
  var formdata = new FormData();

  formdata.append("telephone", telephone);
  formdata.append("otp", otp);
  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };
  let response = await fetch(
    `${PVROOF_URL}/proximity/verifyOTP`,
    requestOptions
  );
  return response;
};

const checkOtp = (telephone, otp) => {
  validateOTP(telephone, otp)
    .then((response) => {
      if (response.status === 200) {
        setCurrencyName().then((currency_code) => {
          handleForm(currency_code).then((res) => {
            document.getElementById("final-msg").innerText =
              "Report status: " + res;
          });
        });

        percent.style.width = getProgressPercent();
        nextTab();
      } else if (response.status === 400) {
        alert("Invalid OTP entered, Please enter correct OTP");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Something went wrong, Please try again.");
    });
};

var currentTab = 0;
showTab(currentTab);

function showTab(n) {
  if (currentTab === 6) {
    document.getElementById("final-msg").innerText =
      "Report status: " + "Your report is being generated.";
  }
  percent.style.width = getProgressPercent();
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  let prevArrow = document.getElementById("prev-arrow");
  if (n === 0) {
    prevArrow.style.display = "none";
  } else {
    prevArrow.style.display = "block";
  }
}

function nextTab() {
  currentTab = currentTab + 1;
  let dataObject = JSON.parse(window.localStorage.getItem("dataObject"));
  for (let i = 0; i < currentTab; i++) {
    if (currentTab === 3 && dataObject.address) {
      currentTab += 1;
    }
    allTab[i].style.display = "none";
  }
  showTab(currentTab);
}

function prevTab() {
  currentTab = currentTab - 1;
  let newObject = JSON.parse(window.localStorage.getItem("dataObject"));
  for (let i = 0; i < allTab.length; i++) {
    if (currentTab === 3 && newObject.address) {
      currentTab -= 1;
    }
    allTab[i].style.display = "none";
  }
  showTab(currentTab);
}

openModalBtn.onclick = function () {
  percent.style.width = getProgressPercent();
  propertyModal.style.display = "flex";
  propertyModal.style.opacity = 1;
  setLocalStorageDataObject(dataObject);
};

closeModal.onclick = function () {
  propertyModal.style.display = "none";
  propertyModal.style.opacity = 0;
  currentTab = 0;
  for (let i = 0; i < allTab.length; i++) {
    allTab[i].style.display = "none";
  }
  allTab[0].style.display = "block";

  energyForm.reset();
  userForm.reset();
  otpValidateForm.reset();
  addressForm1.reset();
  addressForm2.reset();
  document.getElementById("final-msg").innerText =
    "Report status: " + "Your report is being generated.";
};
selectHouse.onclick = function () {
  updateDataObject({ property: "house" });
  nextTab();
};

selectSchool.onclick = function () {
  updateDataObject({ property: "school" });
  nextTab();
};

yesOwn.onclick = function () {
  updateDataObject({ ownThisProperty: true });
  nextTab();
};

noOwn.onclick = function () {
  updateDataObject({ ownThisProperty: false });
  nextTab();
};

energyForm.onsubmit = function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const energyFormProps = Object.fromEntries(formData);
  updateDataObject(energyFormProps);
  nextTab();
};

userForm.onsubmit = function (event) {
  event.preventDefault();

  const phoneNumber = phoneInput.getNumber();
  localStorage.setItem(
    "telephone_country_code",
    phoneInput.getSelectedCountryData().iso2
  );

  const formData = new FormData(event.target);
  const userFormProps = Object.fromEntries(formData);
  const name = userFormProps.name;
  const email = userFormProps.email;
  updateDataObject({ telephone: phoneNumber });
  updateDataObject({ name: name });
  updateDataObject({ email: email });
  validateTelephone(phoneNumber);
};

otpValidateForm.onsubmit = function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const userFormProps = Object.fromEntries(formData);
  const otp1 = userFormProps.otp1;
  const otp2 = userFormProps.otp2;
  const otp3 = userFormProps.otp3;
  const otp4 = userFormProps.otp4;
  let newObject = JSON.parse(window.localStorage.getItem("dataObject"));
  checkOtp(newObject.telephone, otp1 + otp2 + otp3 + otp4);
};

var phoneInput;
addressForm1.onsubmit = function (event) {
  event.preventDefault();

  setLocalStorageDataObject(dataObject);
  const formData = new FormData(event.target);
  const addressFormProps = Object.fromEntries(formData);
  updateDataObject(addressFormProps);
  percent.style.width = getProgressPercent();
  propertyModal.style.display = "flex";
  propertyModal.style.opacity = 1;

  const phoneInputField = document.querySelector("#phone");
  phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: localStorage.getItem("country_short"),
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });
};

addressForm2.onsubmit = function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const addressFormProps = Object.fromEntries(formData);
  updateDataObject(addressFormProps);
  nextTab();

  const phoneInputField = document.querySelector("#phone");
  phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: localStorage.getItem("country_short"),
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });
};

prev.onclick = function () {
  prevTab();
};
