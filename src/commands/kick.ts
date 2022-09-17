import Logger from "../util/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/kick", "blue");

export default async function handle(command: Command) {
    if (!Interface.target) {
        c.log("名妫_moeyy:温馨提示您还没有使用target绑定UID哦");
        return;
    }

    Interface.target.kick();

    c.log("踢除成功");
}