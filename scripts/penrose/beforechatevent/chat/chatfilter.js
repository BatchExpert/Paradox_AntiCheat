import { world } from "mojang-minecraft";
import config from "../../../data/config.js";
import { disabler } from "../../../util.js";

const World = world;

const ChatFilter = () => {
    World.events.beforeChat.subscribe(msg => {
        if (config.modules.chatranks.enabled === true) {
            let message = msg.message;
            let player = msg.sender;

            let tags = player.getTags();
            let rank;
            for (const tag of tags) {
                if (tag.startsWith('Rank:')) {
                    rank = tag.replace('Rank:', '');
                    rank = rank.replaceAll('--', '§4]§r§4[§6');
                }
            }
            if (!rank) {
                rank = "Member";
            }
            let nametag = `§4[§6${rank}§4]§r §7${player.name}§r`;
            player.nameTag = nametag;
            if (!msg.cancel) {
                player.runCommand(`tellraw @a ${JSON.stringify({rawtext:[{text:'§4[§6' + rank + '§4]§r §7' + player.name + ':§r ' + message}]})}`);
                msg.cancel = true;
            }
        } else if (!msg.cancel) {
            let message = msg.message;
            let player = msg.sender;

            player.runCommand(`tellraw @a ${JSON.stringify({rawtext:[{text:player.name + ': ' + message}]})}`);
            msg.cancel = true;
        }
    });
};

export { ChatFilter };
