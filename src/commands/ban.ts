import Logger from "../util/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/ban", "blue");

export default async function handle(command: Command) {
    if (!Interface.target) {
        c.log("名妫_moeyy:您还没有绑定UID哦");
        return;
    }

    const banStatus = Interface.target.player.db.banned;
    Interface.target.player.db.banned = !banStatus;
    Interface.target.player.save();
    Interface.target.kick();

    c.log(`${banStatus ? "Banned" : "Unbanned"} ${Interface.target.account.name}`);
}