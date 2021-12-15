import {index, escolas} from "./controllers";
import express from "express";
import cors from "cors";
import express_promise_router from "express-promise-router";

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.json({type: 'application/vnd.api+json'}));
app.use(cors());

app.use((() => {
    const router = express();
    router.get("/api", index.info);
    return router;
})());

app.use("/api/", (() => {
    const router = express_promise_router();
    router.get("/escolas/ler", escolas.ler);
    router.post("/escolas/criar", escolas.criar);
    router.get("/escolas/autorizadas", escolas.autorizadas);
    router.get("/escolas/pendentes", escolas.pendentes);
    router.put("/escolas/:id", escolas.atualizar);
    router.post("/escolas/cadastro/responder", escolas.responderTriagem);
    return router;
})());

export default app;
