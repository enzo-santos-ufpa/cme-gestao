class SchoolData {
    static fromObject(obj) {
        return new SchoolData(
            obj["school-name"],
            obj["inep-code"],
            obj["current-process"],
            obj["offered-modalities"],
            obj["resolution"]
        )
    }

    constructor(schoolName, inepCode, currentProcess, offeredModalities, resolution) {
        this.schoolName = schoolName;
        this.inepCode = inepCode;
        this.offeredModalities = offeredModalities;
        this.currentProcess = currentProcess;
        this.resolution = resolution;
    }
}

class InputModel {
    constructor(id, label, type, required) {
        this.id = id;
        this.label = label;
        this.type = type;
        this.required = required;
    }
}

function main() {
    const form = document.getElementById("form-container");

    const models = [
        new InputModel("school-name", "Nome da escola", "text", true),
        new InputModel("inep-code", "Código INEP", "text", true),
        new InputModel("offered-modalities", "Etapa(s)/Modalidade(s) de ensino ofertada(s)", "text", true),
        new InputModel("current-process", "Processo atual", "text", false),
        new InputModel("resolution", "Resolução", "text", false),
    ];

    for (let i = 0; i < models.length; i++) {
        const model = models[i];

        const p = document.createElement("p")
        p.innerText = model.label
        p.style.gridRow = `${i + 2}`
        p.style.gridColumn = "2"
        form.appendChild(p)

        const input = document.createElement("input")
        input.id = `form.${model.id}`
        input.type = model.type
        input.required = model.required;
        input.style.gridRow = `${i + 2}`
        input.style.gridColumn = "3"
        form.appendChild(input)
    }

    const button = document.getElementById("save-button")
    button.onclick = function (_) {
        const matrix = models.map(model => {
            const id = model.id;
            const element = document.getElementById(`form.${id}`);
            return [model, element.value];
        });

        const missingLabels = matrix
            .filter(([model, text]) => !text && model.required)
            .map(([model, _]) => model.label);

        if (missingLabels.length) {
            alert("Os campos\n\n" + missingLabels
                .map(label => "- " + label)
                .join("\n") + "\n\n são obrigatórios.")
            return;
        }

        const obj = new Map(matrix.map(([model, text]) => [model.id, text]));
        const data = SchoolData.fromObject(Object.fromEntries(obj));
    }
}

main()