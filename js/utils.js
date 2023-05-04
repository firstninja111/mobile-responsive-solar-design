export const setCurrencyName = async () => {
    const country_long = localStorage.getItem('country_long')
    var currency_code
    if (country_long != null) {
        await fetch('https://api.pvroof.io/utils/currency-data')
            .then((response) => response.json())
            .then((data) => {
                const index = data["Country Name"].indexOf(country_long)
                var currency = data["Currency Name"][index]
                if (currency !== null) {
                    currency_code = currency
                } else {
                    currency_code = 'United States Dollar'
                }
            });
    } else {
        const telephone_country_code = localStorage.getItem('telephone_country_code')
        const country = COUNTRIES.find(key => key.code === telephone_country_code.toUpperCase())
        if (country) {
            const country_long = country.name
            await fetch('https://api.pvroof.io/utils/currency-data')
                .then((response) => response.json())
                .then((data) => {
                    const index = data["Country Name"].indexOf(country_long)
                    var currency = data["Currency Name"][index]
                    if (currency !== null) {
                        currency_code = currency
                    } else {
                        currency_code = 'United States Dollar'
                    }
                });
        } else {
            currency_code = 'United States Dollar'
        }
    }

    return currency_code
}
