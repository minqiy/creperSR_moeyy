import System;
import System.Windows.Forms;
import Fiddler;
import System.Text.RegularExpressions;
 
class Handlers
{
    static function OnBeforeRequest(oS: Session) {
        if(oS.host.EndsWith(".yuanshen.com") || oS.host.EndsWith(".hoyoverse.com") || oS.host.EndsWith(".mihoyo.com") || oS.host.EndsWith(".starrails.com")) {
            oS.host = "localhost";
        }
    }
};
