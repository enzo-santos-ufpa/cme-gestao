class InputModel {
    constructor(label, type, required) {
        this.label = label;
        this.type = type;
        this.required = required;
    }
}

function main() {
    const container = document.getElementById("form-container");

    const models = [
        new InputModel("Nome da escola", "text", true),
        new InputModel("Código INEP", "text", true),
        new InputModel("Etapa(s)/Modalidade(s) de ensino ofertada(s)", "text", true),
        new InputModel("Processo atual", "text", false),
        new InputModel("Resolução", "text", false),
    ];

    for (let i = 0; i < models.length; i++) {
        const model = models[i];

        const p = document.createElement("p")
        p.innerText = model.label
        p.style.gridRow = `${i + 2}`
        p.style.gridColumn = "2"
        container.appendChild(p)

        const input = document.createElement("input")
        input.type = model.type
        input.required = model.required;
        input.style.gridRow = `${i + 2}`
        input.style.gridColumn = "3"
        container.appendChild(input)
    }
}

main()