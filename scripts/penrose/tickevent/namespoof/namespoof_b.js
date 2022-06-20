import { world } from "mojang-minecraft";
import { crypto, flag } from "../../../util.js";
import config from "../../../data/config.js";
import { setTickInterval } from "../../../timer/scheduling.js";

const World = world;

function rip(player) {
    // Get all tags
    let tags = player.getTags();

    // This removes old ban tags
    tags.forEach(t => {
        if(t.startsWith("Reason:")) {
            player.removeTag(t);
        }
        if(t.startsWith("By:")) {
            player.removeTag(t);
        }
    });
    // Tag with reason and by who
    try {
        player.addTag('Reason:Namespoof B (Disabler)');
        player.addTag('By:Paradox');
        player.addTag('isBanned');
    // Despawn if we cannot kick the player
    } catch (error) {
        player.triggerEvent('paradox:kick');
    }
}

function namespoofb() {
    // Get Dynamic Property
    let nameSpoofBoolean = World.getDynamicProperty('namespoofb_b');
    if (nameSpoofBoolean === undefined) {
        nameSpoofBoolean = config.modules.namespoofB.enabled;
    }
    // Unsubscribe if disabled in-game
    if (nameSpoofBoolean === false) {
        World.events.tick.unsubscribe(namespoofb);
        return;
    }
    // run as each player
    for (let player of World.getPlayers()) {
        // Check for hash/salt and validate password
        let hash = player.getDynamicProperty('hash');
        let salt = player.getDynamicProperty('salt');
        let encode;
    try {
        encode = crypto(salt, config.modules.encryption.password);
    } catch (error) {}
        if (hash !== undefined && encode === hash) {
            continue;
        }
        // Namespoof/B = regex check
        if (config.modules.namespoofB.banregex.test(player.name)) {
            rip(player);
        } else if (config.modules.namespoofB.kickregex.test(player.name)) {
            flag(player, "Namespoof", "B", "Exploit", false, false, false, false, false, false);
        }
    }
    return;
}

const NamespoofB = () => {
    // Executes every 2 seconds
    setTickInterval(() => namespoofb(), 40);
};

export { NamespoofB };