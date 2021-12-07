import Forms from "./form";

type EstadoAutenticacaoListener = ((autenticado: boolean) => void);

export type EstadoAutenticacao = Forms.Formulario<"email" | "senha">;

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
        localStorage.setItem("currentUser", JSON.stringify(estado.json()));
    }

    private onLogout() {
        this.listeners.forEach(listener => listener(false));
        localStorage.setItem("currentUser", "null");
    }

    login(estado: EstadoAutenticacao): boolean {
        let conta = undefined;

        estado.campo("email").erro = (() => {
            const texto = estado.campo("email").texto;
            if (!texto.trim().length) return "Insira seu e-mail.";

            conta = Autenticador.contas.find(conta => conta.email === texto);
            if (!conta) return "O e-mail fornecido não existe.";
            return undefined;
        })();
        estado.campo("senha").erro = (() => {
            const texto = estado.campo("senha").texto;
            if (!texto.trim().length) return "Insira sua senha.";
            if (estado.campo("email").erro) return undefined;
            if (conta) return texto === conta.senha ? undefined : "A senha está inválida."
            return undefined;
        })();

        if (!estado.campo("email").erro && !estado.campo("senha").erro) {
            this.onLogin(estado);
            return true;
        }
        return false;
    }

    logout() {
        this.onLogout();
    }
}
