import app from "./api/index";
import net from "net";

import dotenv from "dotenv";
import {networkInterfaces} from "os";

dotenv.config();


const listener = app.listen(3030, () => {
    function possuiPorta(address: any): address is net.AddressInfo {
        return "port" in address;
    }

    const domain = Object.values(networkInterfaces())
        .flatMap(child => child)
        .find(network => network.family === "IPv4" && !network.internal)
        ?.address || "localhost";

    const address = listener.address();
    console.log(`backend: Executando em ${domain}:${possuiPorta(address) ? address.port : address}`);
});
