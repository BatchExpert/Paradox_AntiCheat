import { Dimension, Entity, Player } from "@minecraft/server";
import getStack from "./stack.js";
import config from "../data/config.js";

const DORC = Dimension.prototype.runCommandAsync;

if (config.debug) {
    for (const v of [Dimension, Entity, Player]) {
        const ORC = v.prototype.runCommandAsync;
        v.prototype.runCommandAsync = function (cmd) {
            console.log(`Run command on ${v.name} (${this.id}): ${cmd} \n${getStack()}`);
            try {
                return ORC.call(this, cmd);
            } catch (e) {
                console.warn(`Run command throws error:\nCommand: ${cmd}\nError: ${e} ${getStack()}`);
                throw e;
            }
        };
    }
}

export default DORC;