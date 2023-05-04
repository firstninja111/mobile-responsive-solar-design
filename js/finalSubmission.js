import { AWS_ANALYTICS_URL } from "./global.js"
import { PVROOF_URL } from "./global.js"
import { COUNTRIES } from "./constants.js";

const handleForm = async (currency_code) => {
    console.log('final submission called...', currency_code);
    var statusMsg = ''

    function capitalize(s) {
        // returns the first letter capitalized + the string from index 1 and out aka. the rest of the string
        return s[0].toUpperCase() + s.substr(1);
    }

    const dataObject = JSON.parse(localStorage.getItem('dataObject'))

    var data = {
        "user info": {
            "First Name": dataObject.name, // First Name
            "Last Name": "", // Last Name
            "Email": dataObject.email, // Email
            "Telephone": dataObject.telephone // Telephone
        },

        "Load Profile": {
            "load": dataObject.property === 'house' ? "Household" : 'School' // homeOwner-fixed, solarInstaller-Load profile
        },

        "location": {
            "country": "", // fixed
            "region": dataObject.address, //address
            "start_date": "15 june, 2022", // always fixed date
            "Analysis Period": 20, // homeowner-fixed, solarInstaller - Analysis period
            "Currency": currency_code, // currency, formData['currency']
            "Project Name": "Rooftop Solar Farm",  // fixed
            "Solar-Project Lifecycle (Fixed dont change value)": 25 // fixed
        },

        "Home energy profile": {
            "electricity consumption": parseFloat(dataObject.monthlyBill), //Electricity / month (kWh)
            "yearly consumption/12": { //fixed
                "Jan - Mar": 0, //fixed
                "Apr - Jun": 0, //fixed
                "Jul - Sep": 0, //fixed
                "Oct - Dec": 0 //fixed
            },

            "grid supply/day": 24, //homeowner-fixed, solarInstaller - Electricity supply / day
            "generator supply/day": 0, //homowner-fixed, solarInstaller - Electric generator use/day
            "electric bill": parseFloat(dataObject.monthlyUsgae), // Electricity bill / month
            "Add battery": dataObject.battery === 'on' ? 'True' : 'False', //HomeOwner-fixed, solarInstaller-Add Battery --
            "roof coverage": 0.65 //HomeOwner-fixed, solarInstaller - Solar roof coverage

        },

        "Battery sizing": {
            "reserve days": 1.25, //HomeOwner-fixed, solarInstaller - Reserve days
            "battery voltage": 12, //HomeOwner-fixed, solarInstaller - Battery voltage
            "battery discharge": 0.4, //HomeOwner-fixed, solarInstaller - Battery discharge
            "battery efficiency": 0.95 //HomeOwner-fixed, solarInstaller - Battery efficiency
        },

        "Installation cost": {
            "project cost": 0,  // fixed
            "solar_api_cost/kW": 0, // fixed
            "battery_api_cost": 0 // fixed
        },

        "maintenance cost": {
            "maintenance": 0, // fixed
            "inflation": 0 // fixed
        },

        "Incentives": {
            "National Incentives": 0, //HomeOwner-fixed, SolarInstaller-Federal incentives (USD)
            "State Incentives": 0 //HomeOwner-fixed, SolarInstaller-State incentives (USD)
        },

        "Panel": {
            "panel Watt_peak": 340, //HomeOwner-fixed, SolarInstaller-Panel watt peak
            "Degradation rate": 0.007 // fixed
        },

        "PPA Lease Option": {
            "Lease Tariff": 0, //HomeOwner - fixed, SolarInstaller - Lease-tariff (USD/kWh)
            "Feed-in-tariff": 0.02, //HomeOwner - fixed, SolarInstaller - Feed-in-tariff (USD/kWh)
            "PPA Escalation rate": 0 //HomeOwner - fixed, SolarInstaller - Feed-in-tariff escalation
        },

        "Panel Loan Option": {
            "Term Loan (NOT YET USED)": 0, // fixed
            "Interest on loan": 0.065, // HomeOwner - fixed, SolarInstaller - Interest rate
            "Loan tenure": 5, // HomeOwner - fixed, SolarInstaller - Loan tenure
            "Payments_Year": 12, // HomeOwner - fixed, SolarInstaller - Payment/year(monthly-12, annual-1, quaterly-4, biannual-2) //TODO
            "DSCR (NOT YET USED)": 0, // fixed
            "Fixed payment/yr (NOT YET USED)": 200 // fixed
        },

        "Simulation (P50:90:95)": {
            "Select": "P90" // fixed
        },

        "Default values": {
            "battery cost per kWh": 0, // HomeOwner - fixed, SolarInstaller - Battery cost/kWh
            "Solar PV cost per kW": 0 // HomeOwner - Fixed, SolarInstaller - Solar PV cost/kW
        }
    }

    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    var raw = JSON.stringify(data);
    console.log(raw)
    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow'
    };

    var formdata = new FormData();

    await fetch(AWS_ANALYTICS_URL, requestOptions)
        .then(response => response.json())
        .then(result => {

            formdata.append("name", result['name_of_client']);
            formdata.append("email", result['email']);
            formdata.append("telephone", result['telephone']);
            formdata.append("address", result['address']);
            formdata.append("pdf_report_short", result['pdf_report_short']);
            formdata.append("xlsx_report", result['xlsx_report']);
            formdata.append("json", raw);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            fetch(`${PVROOF_URL}/proximity/saveCustomer`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

            statusMsg = "Your solar savings report has been sent to your email"

        })
        .catch(error => {
            console.log(error);
            statusMsg = "Please key in the right input(s) and try again."
        });

    return statusMsg
}

export default handleForm;