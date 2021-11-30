import Formulario from "./form";

type EstadoAutenticacaoListener = ((autenticado: boolean) => void);

export type EstadoAutenticacao = Formulario.Tipo<"email" | "senha">;

type Conta = { email: string, senha: string };

export default class Autenticador {
    private static contas: Conta[] = [
        {email: "admin", senha: "admin"},
    ];

    private listeners: EstadoAutenticacaoListener[] = [];

    addOnStateListener(listener: EstadoAutenticacaoListener) {
        this.listeners.push(listener);
    }

    private onLogin(estado: EstadoAutenticacao) {
        this.listeners.forEach(listener => listener(true));
        localStorage.setItem("currentUser", JSON.stringify({email: estado.email.texto, senha: estado.senha.texto}));
    }

    private onLogout() {
        this.listeners.forEach(listener => listener(false));
        localStorage.setItem("currentUser", "null");
    }

    login(estado: EstadoAutenticacao): EstadoAutenticacao | null {
        let conta = undefined;

        const novoEstado = {...estado};
        novoEstado.email.erro = (() => {
            const texto = estado.email.texto;
            if (!texto.trim().length) return "Insira seu e-mail.";

            conta = Autenticador.contas.find(conta => conta.email === texto);
            if (conta === undefined) return "O e-mail fornecido não existe.";
            return undefined;
        })();
        novoEstado.senha.erro = (() => {
            const texto = estado.senha.texto;
            if (!texto.trim().length) return "Insira sua senha.";
            if (novoEstado.email.erro !== undefined) return undefined;
            if (conta !== undefined) return texto === conta.senha ? undefined : "A senha está inválida."
            return undefined;
        })();

        if (novoEstado.email.erro === undefined && novoEstado.senha.erro === undefined) {
            this.onLogin(estado);
        }
        return novoEstado;
    }

    logout() {
        this.onLogout();
    }
}
