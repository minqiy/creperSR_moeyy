import Account from "../db/Account";
import Logger from "../util/Logger";
import { Command } from "./Interface";
const c = new Logger("/account", "blue");

export default async function handle(command: Command) {
    switch (command.args[0]) {
        case "create":
            if (!command.args[1]) {
                c.log("创建用户: account create <name> [uid]");
                return;
            }
            try {
                const acc = await Account.create(command.args[1], command.args[2]);
                c.log("名妫_moeyy:恭喜你，用户创建成功 .");
            } catch (e) {
                c.error(e as Error);
            }
            break;
        case "delete":
            if (!command.args[1]) {
                c.log("删除用户: account delete <uid>");
                return;
            }
            const acc = await Account.fromUID(command.args[1]);
            if (!acc) {
                c.error("名妫_moeyy:您输入的用户名或者UID不在范围内或在数据中无法被检索");
                return;
            }
            Account.delete(command.args[1]);
            c.log("名妫_moeyy：用户删除成功");
            break;
        default:
            c.log("创建用户: account create <name> [uid]");
            c.log("删除用户: account delete <uid>");
    }
}
