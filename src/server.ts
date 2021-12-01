import process from "process";
import app from "./api/index";

const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`backend: Executando em ${port}`));
