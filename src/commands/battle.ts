import { BattleAvatar, BattleBuff, HeroPath, Item, ItemList, SceneBattleInfo, SceneMonsterWave, StartCocoonStageScRsp } from "../data/proto/StarRail";
import Avatar from "../db/Avatar";
import Inventory from "../db/Inventory";
import Logger from "../util/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/battle", "blue");

export default async function handle(command: Command) {
    if (command.args.length == 0) {
        c.log("battle使用方法: /battle <怪物Id>");
        return;
    }
    
    if (!Interface.target) {
        c.log("名妫_moeyy:您还没有绑定127.0.0.1:端口哦");
        return;
    }


    const player = Interface.target.player;
    if (player.db.posData.planeID != 20101) {
        c.log("如果未能进入战斗，这边名妫_moeyy提醒您，建议切换地图，该地图无法触发战斗哦");
    }

    const inventory = await player.getInventory();
    const avatars = await Avatar.getAvatarsForLineup(player, player.db.lineup.lineups[player.db.lineup.curIndex]);
    const monsters = command.args.map(arg => Number(arg));

    Interface.target.send(StartCocoonStageScRsp, {
        retcode: 0,
        propEntityId: 0,
        cocoonId: 1001,
        wave: 0,
        battleInfo: {
            logicRandomSeed: 1,
            stageId: 1022010,
            monsterWaveList: [
                { monsterIdList: monsters, dropList: [{ itemList: [{ itemId: 102, num: 10 } as Item] } as ItemList] } as SceneMonsterWave
            ],
            battleAvatarList: avatars.map((avatar, i) => {
                const equipment = inventory.getEquipmentByUid(avatar.db.equipmentUniqueId);
                const equipData = (equipment) ? [{
                    id: equipment.tid,
                    level: equipment.level,
                    promotion: equipment.promotion,
                    rank: equipment.rank
                }] : [];

                return {
                    avatarType: avatar.db.avatarType,
                    equipmentList: equipData,
                    hp: avatar.db.fightProps.hp,
                    id: avatar.db.baseAvatarId,
                    sp: avatar.db.fightProps.sp,
                    index: i,
                    level: avatar.db.level,
                    promotion: avatar.db.promotion,
                    rank: avatar.db.rank,
                    relicList: [],
                    skilltreeList: []
                };
            }),
            buffList: new Array<BattleBuff>(),
            battleId: 0,
            heroPathList: new Array<HeroPath>(),
            roundsLimit: 100
        } as SceneBattleInfo
    } as StartCocoonStageScRsp);
}