import Config from "../util/Config";
import Logger, { VerboseLevel } from "../util/Logger";
import { Command } from "./Interface";
const c = new Logger("/debug", "blue");

export default async function handle(command: Command) {
    if (!command.args[0]) c.log(`VerboseLevel: ${Config.VERBOSE_LEVEL}`);
    else {
        let level = parseInt(command.args[0]);
        if (!level) level = 0;
        if (level > VerboseLevel.VERBH || level < 0) {
            c.log("抱歉级别只能设置在0到4之间哦");
            return;
        }

        Config.VERBOSE_LEVEL = level as VerboseLevel;
        Logger.VERBOSE_LEVEL = level as VerboseLevel;
        c.log("级别设置成功");
    }
}