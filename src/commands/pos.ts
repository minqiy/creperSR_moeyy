import Logger from "../util/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/pos", "blue");

export default async function handle(command: Command) {
    if (!Interface.target) {
        c.log("名妫_moeyy:温馨提示您还没有使用target绑定UID哦");
        return;
    }

    const pos = Interface.target.player.db.posData.pos;
    c.log(`您目前处于: x=${pos.x}, y=${pos.y}, z=${pos.z}.`);
}