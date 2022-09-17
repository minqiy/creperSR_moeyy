import Logger from "../util/Logger";
import { Command } from "./Interface";
const c = new Logger("/exit", "blue");

export default async function handle(command: Command) {
    c.log("名妫_moeyy:总算打发走了一个二愣子玩家");
    process.exit(0);
}