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
    const router = express_promise_router();
    router.get("/api", index.info);
    return router;
})());

app.use("/api/", (() => {
    const router = express_promise_router();
    router.post("/escolas", escolas.create);
    router.get("/escolas", escolas.read)
    router.put("/escolas/:id", escolas.update);
    return router;
})());

export default app;
