import app from "./api/index";
import net from "net";

import dotenv from "dotenv";
import {rede} from "./lib/utils";

dotenv.config();


const listener = app.listen(3030, () => {
    function possuiPorta(address: any): address is net.AddressInfo {
        return "port" in address;
    }

    const address = listener.address();
    const url = rede.urlAtual({
        porta: possuiPorta(address) ? address.port : address,
    });
    console.log(`backend: Executando em ${url}`);
});
