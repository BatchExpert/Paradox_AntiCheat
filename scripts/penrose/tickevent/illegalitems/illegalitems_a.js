import * as Minecraft from "mojang-minecraft";
import { illegalitems } from "../../../data/itemban.js";
import config from "../../../data/config.js";

const World = Minecraft.world;

const IllegalItemsA = () => {
    World.events.tick.subscribe(() => {
        [...World.getPlayers()].forEach(player => {
            // fix a disabler method
            player.nameTag = player.nameTag.replace("\"", "");
            player.nameTag = player.nameTag.replace("\\", "");

            let inventory = player.getComponent('minecraft:inventory').container;
            let inventory_items = [];
            for (let i = 0; i < inventory.size; i++) {
                try {
                    let inventory_i = inventory.getItem(i);
                    inventory_items.push(inventory_i.id);
                } catch (error) {}
            }

            // If player has an illegal item we clear their entire inventory then kick them
            // If we cannot kick them then we despawn them (no mercy)
            inventory_items.forEach(item => {
                if (illegalitems.includes(item) && !player.hasTag('paradoxOpped') || item > config.modules.illegalitemsA.maxStack && !player.hasTag('paradoxOpped')) {
                    let tags = player.getTags();

                    // This removes old ban tags
                    tags.forEach(t => {
                        if(t.startsWith("Reason:")) {
                            player.removeTag(t.slice(1));
                        }
                        if(t.startsWith("By:")) {
                            player.removeTag(t.slice(1));
                        }
                    });
                    try {
                        player.runCommand(`clear "${player.nameTag}"`);
                    } catch (error) {}
                    try {
                        player.runCommand(`tag "${player.nameTag}" add "Reason:Illegal Item"`);
                        player.runCommand(`tag "${player.nameTag}" add "By:Paradox"`);
                        player.addTag('isBanned');
                    } catch (error) {
                        player.triggerEvent('paradox:kick');
                    }
                }
            });
        });
    });
};

export { IllegalItemsA };