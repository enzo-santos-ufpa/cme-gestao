function updateRadioButton(values) {
    const acronymRadioId = "school-acronym"

    const current = document.createElement("select")
    current.id = acronymRadioId
    current.style.flexGrow = "1"
    values.forEach(value => {
        const option = document.createElement("option")
        option.value = value.toLowerCase()
        option.innerText = value
        current.options.add(option)
    })

    const previous = document.getElementById(acronymRadioId)
    previous.replaceWith(current)
}

function main() {
    document.body.addEventListener('change', function (e) {
        console.log(e.target.id)
        switch (e.target.id) {
            case "school-type-public":
                updateRadioButton(["EMEI", "EMEIF", "EMEF", "UEI"])
                break;
            case "school-type-private":
                updateRadioButton(["OSC", "Privada"])
                break;
        }
    })
}

main()