import { Equipment } from "../data/proto/StarRail";
import Player from "../db/Player";
import ItemExcel from "../util/excel/ItemExcel";
import Logger from "../util/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/item", "blue");

export default async function handle(command: Command) {
    if(command.args.length ==0 ){
        c.log("item使用方法: /item <give|giveall> <itemId> [x<count>|l<level>|r<rank>|p<promotion>]");
        return;
    }
    if (!Interface.target) {
        c.log("名妫_moeyy:温馨提示您还没有使用target绑定UID哦");
        return;
    }

    const player = Interface.target.player;
    const actionType = command.args[0];
    const itemId = Number(command.args[1]);

    let count: number = 0;
    let level: number = 0;
    let rank: number = 0;
    let promotion: number = 0;

    for (let i = 2; i < command.args.length; i++) {
        const arg = command.args[i];
        const number = Number(command.args[i].substring(1));

        if (arg.startsWith("x")) {
            count = number;
        }
        else if (arg.startsWith("l")) {
            level = number;
        }
        else if (arg.startsWith("r")) {
            rank = number;
        }
        else if (arg.startsWith("p")) {
            promotion = number;
        }
    }

    switch (actionType) {
        case "give": {
            await handleGive(player, itemId, count, level, rank, promotion);
            break;
        }
        case "giveall": {
            await handleGiveAll(player);
            break;
        }
        default: {
            c.log("item使用方法: /item <give|giveall> <itemId> [x<count>|l<level>|r<rank>|p<promotion>]");
            break;
        }
    }

    // Sync session.
    await player.session.sync();
}

async function handleGive(player: Player, itemId: number, count:number, level: number, rank: number, promotion: number) {
    if (!itemId) {
        return c.log("名妫_moeyy：这边提醒您哦，item暂时只能获取物品哦");
    }

    // Check if this item exists.
    const itemData = ItemExcel.fromId(itemId);
    if (!itemData) {
        return c.log("名妫_moeyy：您输入的物品id可能超出范围了呢");
    }

    const inventory = await player.getInventory();
    switch (itemData.ItemType) {
        case "Material":
            await inventory.addMaterial(itemId, count);
            break;
        case "Equipment":
            for (let i = 0; i < count; i++) {
                await inventory.addEquipment({
                    tid: itemId,
                    uniqueId: 0,
                    level: level,
                    rank: rank,
                    exp: 1,
                    isProtected: false,
                    promotion: promotion,
                    baseAvatarId: 0
                } as Equipment);
            }
            break;
        default:
            return c.log("名妫_moeyy：我说有可能，有可能这个物品获取不了捏");
            break;
    }

    c.log("物品添加成功");
}

async function handleGiveAll(player: Player) {
    const inventory = await player.getInventory();

    for (const entry of ItemExcel.all()) {
        const count = 
            (entry.ItemType == "Material") ? 2000 :
            (entry.ItemType == "Virtual") ? 10_000_000 : 
            1;
        await inventory.addItem(entry.ID, count);
    }
    
    c.log("全部物品添加成功");
}