//=============================================================================
// Neo Crystal Engine - Basic Module
// NCE_BasicModule.js
// Version 1.04
//=============================================================================

var Imported = Imported || {};
var Crystal = Crystal || {};

//=============================================================================
/*:
 * @plugindesc Base Plugin used for Neo Crystal Engine.
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin creates a number of basic functions that other Neo Crystal Engine
 * plugins use. This plugin does nothing in terms of function on its own, only
 * making minor tweeks to the aesthetics of the game.
 *
 * ============================================================================
 * Version History
 * ============================================================================
 *
 * - 1.00 (6/22/16): Initial Release
 * - 1.01 (6/25/16): Added some new functionality for usage with Yanfly Engine.
 *                   In addition, some key functions were added for usage with
 *                   some new plugins.
 * - 1.02 (6/26/16): Minor bugfixes.
 * - 1.03 (8/13/16): Fixed game breaking bug where an error would appear if you
 *                   tried to turn of enemy levels.
 * - 1.04 (1/29/18):  Modified the entry of parameters to reflect the new update.
 *
 * ============================================================================
 * Enemy Levels
 * ============================================================================
 *
 * This plugin adds levels to enemies with a display that can be turned on and
 * off at will. This is mostly to make formulas that use level more universal,
 * such as skills that do more or less damage based off of the target's level.
 *
 * Enemy Notetags
 *   <level: x>
 *   Sets level to x. If this notetag is not used, the default level defined in
 *   the plugin settings will be used.
 *
 *  <show level>
 *  If levels are not shown by default, this notetag will cause all instances of
 *  this enemy to display their level in their name.
 *
 *  <hide level>
 *  If levels are shown by default, this notetag will cause all instances of
 *  this enemy to not display their level, displaying letters when applicable.
 *
 * ============================================================================
 * Stat Display Settings
 * ============================================================================
 *
 * This offers a number of stylistic settings for the display of HP and MP both
 * in and outside of battle. These settings allow the player to add the TP bar
 * to the menu, remove the display of MP for actors who can't use it, remove any
 * display of maximum HP/MP even if it would fit in the space and completely
 * remove the display of the TP value leaving only the bar (note that costs are
 * still shown despite that).
 *
 * *** Note ***
 * The game may not always display the maximum HP or MP values even if the
 * settings are turned on. This is because the game also evaluates whether or
 * not it can display the maximum in the space, opting to omit the value if it
 * cannot.
 *
 *
 * ============================================================================
 * Custom Displays
 * ============================================================================
 * For maximum compatibility, this plugin includes settings to override changes
 * to the menu and battle system if you are using a custom display of some kind
 * as to ensure that the rest of the plugin is usable even if you are. For all
 * intents and purposes the AltMenuScreen plugin that comes with RPG Maker MV is
 * not considered a custom menu display and will work fine with this plugin with
 * the "Custom Menu Display" setting turned off.
 *
 * *** Note ***
 * Even though this plugin is built with external compatibility in mind, I can't
 * guarentee that this will work with all custom battle and custom menu systems.
 * I hope you guys will understand if your prefered system does not work, but
 * feel free to message me about the issue and I will see what I can do about
 * it. Please note that this is not a promise and the feasibility of any patches
 * will be evaluated on a case by case basis.
 *
 * ============================================================================
 * End of Help
 * ============================================================================
 *
 * @author Crystal Noel
 *
 * @param ---Enemy Levels---
 * @default
 *
 * @param Default Enemy Level
 * @parent ---Enemy Levels---
 * @desc Default level for enemies.
 * @type number
 * @min 1
 * @default 1
 *
 * @param Show Enemy Levels
 * @type boolean
 * @on Yes
 * @off No
 * @desc Should the game disply the levels of enemies in game?
 * NO - false     YES - true
 * @default true
 *
 * @param ---Stat Display---
 * @default
 *
 * @param Always Display MP
 * @parent ---Stat Display---
 * @type boolean
 * @on Yes
 * @off No
 * @desc Display MP even if no skills use MP?
 * NO - false     YES - true
 * @default false
 *
 * @param Display TP in Menu
 * @parent ---Stat Display---
 * @type boolean
 * @on Yes
 * @off No
 * @desc Should the game display TP on the menu screen?
 * NO - false     YES - true
 * @default true
 *
 * @param Always Display TP
 * @parent ---Stat Display---
 * @type boolean
 * @on Yes
 * @off No
 * @desc Display TP even if no skills use TP?
 * NO - false     YES - true
 * @default false
 *
 * @param Prioritize MP
 * @parent ---Stat Display---
 * @type boolean
 * @on Yes
 * @off No
 * @desc Display MP when no skills use TP (even if no skills use MP either)?
 * NO - false     YES - true
 * @default false
 *
 * @param Display Max HP (Field)
 * @parent ---Stat Display---
 * @type boolean
 * @on Yes
 * @off No
 * @desc Should the game the maximum HP of actors outside of battle if possible?
 * NO - false     YES - true
 * @default true
 *
 *
 * @param Display Max HP (Battle)
 * @parent ---Stat Display---
 * @type boolean
 * @on Yes
 * @off No
 * @desc Should the game the maximum HP of actors in battle if possible?
 * NO - false     YES - true
 * @default false
 *
 * @param Display Max MP (Field)
 * @parent ---Stat Display---
 * @type boolean
 * @on Yes
 * @off No
 * @desc Should the game the maximum MP of actors outside of battle if possible?
 * NO - false     YES - true
 * @default true
 *
 *
 * @param Display Max MP (Battle)
 * @parent ---Stat Display---
 * @type boolean
 * @on Yes
 * @off No
 * @desc Should the game the maximum HP of actors in battle if possible?
 * NO - false     YES - true
 * @default false
 *
 * @param Display TP (Field)
 * @parent ---Stat Display---
 * @type boolean
 * @on Yes
 * @off No
 * @desc Should the game the TP value of actors outside of battle?
 * NO - false     YES - true
 * @default true
 *
 *
 * @param Display TP (Battle)
 * @parent ---Stat Display---
 * @type boolean
 * @on Yes
 * @off No
 * @desc Should the game the TP value of actors in battle?
 * NO - false     YES - true
 * @default true
 *
 * @param ---Custom Displays---
 * @default
 *
 * @param Alternate Menu Screen
 * @parent ---Custom Displays---
 * @type boolean
 * @on Yes
 * @off No
 * @desc Are you using a the plugin named AltMenuScreen that came with RMMV?
 * NO - false     YES - true
 * @default false
 *
 * @param Custom Battle Display
 * @parent ---Custom Displays---
 * @type boolean
 * @on Yes
 * @off No
 * @desc Are you using a custom battle display?
 * NO - false     YES - true
 * @default false
 */
//=============================================================================

//=============================================================================
// Plugin Registry
//=============================================================================

Crystal.Registry = Crystal.Registry || {};
Crystal.Registry.NCE_BasicModule = Crystal.Registry.NCE_BasicModule || {};
Crystal.Registry.ScriptNames = Crystal.Registry.ScriptNames || {};
Crystal.Registry.ScriptNames.NCE_BasicModule = "Neo Crystal Engine - Basic Module";

Crystal.Registry.checkScripts = function(name, req, version, website) {
  if (website == undefined) {
    var website = "http://crystalnoel42.wordpress.com/";
  };
  var text = "Imported." + String(req);
  if (version == null) {
    if (!eval(text)) {
      Crystal.Registry.raiseRequirement(name, req, version, website);
    };
  } else {
    if (!eval(text) || eval(text + " < version")) {
      Crystal.Registry.raiseRequirement(name, req, version, website);
    };
  };
};

Crystal.Registry.raiseRequirement = function(name, req, version, website) {
  var name =  Crystal.Registry.ScriptNames[name];
  var req = Crystal.Registry.ScriptNames[req];
  if (version == null) {
    var msg  = "The pluggin \"" + name + "\" requires the pluggin \"" + req + "\" to work properly.\n";
    var html = msg;
    msg  += "Go to " + website + " to download this pluggin.";
  } else {
    var msg = "The pluggin \"" + name + "\" requires the pluggin \"" + req + "\" version " + version.toFixed(2) + " or higher to work properly.\n";
    var html = msg;
    msg  += "Go to " + website + " to download this pluggin.";
    html += "Go to <a heref" + website + "> to download this pluggin.";
  };
  throw {
    name:          "Pluggin Error",
    level:         "Pluggin Requirement",
    message:       msg,
    htmlMessage:    html,
    toString:      function(){return this.name + ": " + this.message}
  };
};

Imported.NCE_BasicModule = 1.04;

//=============================================================================
// Parameter Variables
//=============================================================================

Crystal.BasicParameters = PluginManager.parameters('NCE_BasicModule');
Crystal.Basic = Crystal.Basic || {};
Crystal.Basic.DefaultEnemyLevel  = Number(Crystal.BasicParameters["Default Enemy Level"]);
Crystal.Basic.ShowEnemyLevels      = eval(String(Crystal.BasicParameters["Show Enemy Levels"]));
Crystal.Basic.AlwaysDisplayMP      = eval(String(Crystal.BasicParameters["Always Display MP"]));
Crystal.Basic.DisplayTP            = eval(String(Crystal.BasicParameters["Display TP in Menu"]));
Crystal.Basic.AlwaysDisplayTP      = eval(String(Crystal.BasicParameters["Always Display TP"]));
Crystal.Basic.PrioritizeMP         = eval(String(Crystal.BasicParameters["Prioritize MP"]));
Crystal.Basic.DisplayMaxHPField    = eval(String(Crystal.BasicParameters["Display Max HP (Field)"]));
Crystal.Basic.DisplayMaxHPBattle   = eval(String(Crystal.BasicParameters["Display Max HP (Battle)"]));
Crystal.Basic.DisplayMaxMPField    = eval(String(Crystal.BasicParameters["Display Max MP (Field)"]));
Crystal.Basic.DisplayMaxHPBattle   = eval(String(Crystal.BasicParameters["Display Max MP (Battle)"]));
Crystal.Basic.DisplayTPValueField  = eval(String(Crystal.BasicParameters["Display TP (Field)"]));
Crystal.Basic.DisplayTPValueBattle = eval(String(Crystal.BasicParameters["Display TP (Battle)"]));
Crystal.Basic.CustomMenuDisplay    = eval(String(Crystal.BasicParameters["Alternate Menu Screen"]));
Crystal.Basic.CustomBattleDisplay  = eval(String(Crystal.BasicParameters["Custom Battle Display"]));
Crystal.Basic.StatNames = {
  "mhp": 0,
  "mmp": 1,
  "atk": 2,
  "def": 3,
  "mat": 4,
  "mdf": 5,
  "agi": 6,
  "luk": 7,
};

//=============================================================================
// Global Functions
//=============================================================================

checkNotes = function(notes, tag, args) {
  if (args == null) {
    var regexp = "<" + String(tag) + ">";
  } else if (args == "num") {
    var regexp = "<" + String(tag) + ": ([+-.\\d]+)>";
  } else if (args == "num%") {
    var regexp = "<" + String(tag) + ": ([+-.\\d]+)%>";
  } else if (args == "string") {
    var regexp = "<" + String(tag) + ": (.+)>";
  } else if (args == "statNum") {
    var regexp = "<" + String(tag) + " (\\w+): ([+-.\\d]+)>";
  } else if (args == "statNum%") {
    var regexp = "<" + String(tag) + " (\\w+): ([+-.\\d]+)%>";
  } else if (args == "numArray") {
    var regexp = "<" + String(tag) + ": (\\d{1})>";
  } else {
    var regexp = "<" + String(tag) + String(args) + ">";
  };
  var match = RegExp(regexp, "gi");
  var vals = notes.matchAll(match);
  if (vals) {
    return vals;
  } else {
    return false;
  }
};

String.prototype.matchAll = function(regexp) {
  var matches = [];
  this.replace(regexp, function() {
    var arr = ([]).slice.call(arguments, 0);
    var extras = arr.splice(-2);
    arr.index = extras[0];
    arr.input = extras[1];
    matches.push(arr);
  });
  return matches.length ? matches : null;
};

Crystal.Basic.loadExternalText = function(name, source) {
  this.files++;
  var path = "data/nce_text/" + name + ".txt"
  var text = new XMLHttpRequest();
  text.open("GET", path);
  text.onload  = function() { Crystal.Basic.processNotes(text.responseText, source); };
  text.onerror = function() { throw new Error("Failed to load: " + path); };
  text.send();
};

Crystal.Basic.processNotes = function(text, source) {
};

Crystal.Basic.saveTextData = function(data, filename) {
  var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/data/')
  if (path.match(/^\/([A-Z]\:)/)) {
    path = path.slice(1);
  };
  path = decodeURIComponent(path);
  var fs = require('fs');
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  fs.writeFileSync(path + filename + ".json", JSON.stringify(data));
};

//-----------------------------------------------------------------------------
// Game_BattlerBase
//
// The superclass of Game_Battler. It mainly contains parameters

Game_BattlerBase.prototype.note = function () {
  var note = "";
  this.traitObjects().forEach(function(obj) {
    if (obj) {
      note += obj.note;
      note += "\r\n";
    };
  }, this);
  return note;
};

Game_BattlerBase.prototype.equipmentNote = function () {
  var note = "";
  this.equips().forEach(function(obj) {
    if (obj) {
      note += obj.note;
      note += "\r\n";
    };
  }, this);
  return note;
};

Game_BattlerBase.prototype.tpRate = function() {
    return this.tp / this.maxTp();
};

//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

Game_Actor.prototype.displayMP = function() {
  if (Crystal.Basic.AlwaysDisplayMP) {
    return true;
  } else if (Crystal.Basic.PrioritizeMP) {
    return !this.displayTP();
  } else {
    return this.skills().some(function(skill) {
      return skill.mpCost > 0;
    }, this);
  };
};

Game_Actor.prototype.displayTP = function() {
  if ($dataSystem.optDisplayTp) {
    if (Crystal.Basic.DisplayTP && Crystal.Basic.AlwaysDisplayTP) {
      return true;
    } else if (Crystal.Basic.AlwaysDisplayTP) {
      return $gameParty.inBattle();
    } else {
      if ($gameParty.inBattle() || Crystal.Basic.DisplayTP) {
        return this.skills().some(function(skill) {
          return skill.tpCost > 0;
        }, this);
      } else {
        return false;
      };
    };
  } else {
    return false;
  };
};

Game_Actor.prototype.baseNote = function() {
  var note = this.actor().note;
  note += "\r\n"
  note += this.currentClass().note;
  return note;
};


//-----------------------------------------------------------------------------
// Game_Enemy
//
// The game object class for an enemy.

Object.defineProperty(Game_Enemy.prototype, 'level', {
    get: function() {
        return this._level;
    },
    configurable: true
});

Crystal.Registry.NCE_BasicModule.Game_Enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {
  Crystal.Registry.NCE_BasicModule.Game_Enemy_setup.call(this, enemyId, x, y);
  level = checkNotes(this.enemy().note, "level", "num", true);
  if (level) {
    this._level = Number(level.pop()[1]);
  } else {
    this._level = Crystal.Basic.DefaultEnemyLevel;
  };
};

Crystal.Registry.NCE_BasicModule.Game_Enemy_name = Game_Enemy.prototype.name;
Game_Enemy.prototype.name = function() {
  if (this.showLevel()) {
    return this.originalName() + " Lv. " + String(this.level);
  } else {
    return Crystal.Registry.NCE_BasicModule.Game_Enemy_name.call(this);
  };
};

Game_Enemy.prototype.showLevel = function() {
  if (Crystal.Basic.ShowEnemyLevels) {
    return !checkNotes(this.enemy().note, "hide level", null);
  } else {
    return checkNotes(this.enemy().note, "show level", null);
  };
};

Game_Enemy.prototype.baseNote = function() {
  var note = this.enemy().note;
  note += "\r\n"
  if (Imported.NCE_EnemyClasses) {
    note += this.currentClass().note;
  };
  return note;
};

//-----------------------------------------------------------------------------
// Window_Base
//
// The superclass of all windows within the game.

Window_Base.prototype.drawActorHp = function(actor, x, y, width) {
  width = width || 186;
  var color1 = this.hpGaugeColor1();
  var color2 = this.hpGaugeColor2();
  this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
  this.changeTextColor(this.systemColor());
  this.drawText(TextManager.hpA, x, y, 44);
  this.drawCurrentAndMaxHP(actor.hp, actor.mhp, x, y, width,
                           this.hpColor(actor), this.normalColor());
};

Window_Base.prototype.drawCurrentAndMaxHP = function(current, max, x, y,
                                                     width, color1, color2) {
  var labelWidth = this.textWidth(TextManager.hpA);
  var valueWidth = this.textWidth('0000');
  var slashWidth = this.textWidth('/');
  var x1 = x + width - valueWidth;
  var x2 = x1 - slashWidth;
  var x3 = x2 - valueWidth;
  if ($gameParty.inBattle()) {
    var displayMax = Crystal.Basic.DisplayMaxHPBattle;
  } else {
    var displayMax = Crystal.Basic.DisplayMaxHPField;
  };
  if ((x3 >= x + labelWidth) && displayMax) {
    this.changeTextColor(color1);
    this.drawText(current, x3, y, valueWidth, 'right');
    this.changeTextColor(color2);
    this.drawText('/', x2, y, slashWidth, 'right');
    this.drawText(max, x1, y, valueWidth, 'right');
  } else {
    this.changeTextColor(color1);
    this.drawText(current, x1, y, valueWidth, 'right');
  }
};

Window_Base.prototype.drawActorMp = function(actor, x, y, width) {
  width = width || 186;
  var color1 = this.mpGaugeColor1();
  var color2 = this.mpGaugeColor2();
  this.drawMPGauge(x, y, width, actor, color1, color2);
  this.changeTextColor(this.systemColor());
  this.drawText(TextManager.mpA, x, y, 44);
  this.drawCurrentAndMaxMP(actor.mp, actor.mmp, x, y, width,
                           this.mpColor(actor), this.normalColor());
};

Window_Base.prototype.drawMPGauge = function(x, y, width, actor, color1, color2) {
  this.drawGauge(x, y, width, actor.mpRate(), color1, color2)
};

Window_Base.prototype.drawCurrentAndMaxMP = function(current, max, x, y,
                                                     width, color1, color2) {
  var labelWidth = this.textWidth(TextManager.mpA);
  var valueWidth = this.textWidth('0000');
  var slashWidth = this.textWidth('/');
  var x1 = x + width - valueWidth;
  var x2 = x1 - slashWidth;
  var x3 = x2 - valueWidth;
  if ($gameParty.inBattle()) {
    var displayMax = Crystal.Basic.DisplayMaxMPBattle;
  } else {
    var displayMax = Crystal.Basic.DisplayMaxMPField;
  };
  if ((x3 >= x + labelWidth) && displayMax) {
    this.changeTextColor(color1);
    this.drawText(current, x3, y, valueWidth, 'right');
    this.changeTextColor(color2);
    this.drawText('/', x2, y, slashWidth, 'right');
    this.drawText(max, x1, y, valueWidth, 'right');
  } else {
    this.changeTextColor(color1);
    this.drawText(current, x1, y, valueWidth, 'right');
  }
};

Window_Base.prototype.drawActorTp = function(actor, x, y, width) {
  width = width || 96;
  var color1 = this.tpGaugeColor1();
  var color2 = this.tpGaugeColor2();
  this.drawTPGauge(x, y, width, actor, color1, color2);
  this.changeTextColor(this.systemColor());
  this.drawText(TextManager.tpA, x, y, 44);
  this.changeTextColor(this.tpColor(actor));
  if ($gameParty.inBattle()) {
    var displayValue = Crystal.Basic.DisplayTPValueBattle;
  } else {
    var displayValue = Crystal.Basic.DisplayTPValueField;
  };
  if (displayValue) {
    this.drawText(actor.tp, x + width - 64, y, 64, 'right');
  };
};

Window_Base.prototype.drawTPGauge = function(x, y, width, actor, color1, color2) {
  this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
};

Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
  var lineHeight = this.lineHeight();
  var x2 = x + 180;
  var width2 = Math.min(200, width - 180 - this.textPadding());
  this.drawActorName(actor, x, y);
  this.drawActorLevel(actor, x, y + lineHeight * 1);
  this.drawActorIcons(actor, x, y + lineHeight * 2);
  this.drawActorClass(actor, x2, y);
  this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
  if (actor.displayMP() && actor.displayTP()) {
    this.drawActorMp(actor, x2, y + lineHeight * 2, width2 / 2 - 2);
    this.drawActorTp(actor, x2 + width2 / 2 + 2, y + lineHeight * 2, width2 / 2 - 2);
  } else if (actor.displayMP()) {
    this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
  } else if (actor.displayTP()) {
    this.drawActorTp(actor, x2, y + lineHeight * 2, width2);
  };
};

if (Crystal.Basic.CustomMenuDisplay) {

  //-----------------------------------------------------------------------------
  // Window_MenuStatus
  //
  // The window for displaying party member status on the menu screen.

  Window_MenuStatus.prototype.drawItemStatus = function(index) {
      var actor = $gameParty.members()[index];
      var rect = this.itemRectForText(index);
      var x = rect.x;
      var y = rect.y;
      var width = rect.width;
      var bottom = y + rect.height;
      var lineHeight = this.lineHeight();
      this.drawActorName(actor, x, y + lineHeight * 0, width);
      this.drawActorLevel(actor, x, y + lineHeight * 1, width);
      this.drawActorClass(actor, x, bottom - lineHeight * 5, width);
      this.drawActorHp(actor, x, bottom - lineHeight * 4, width);
      if (actor.displayMP() && actor.displayTP()) {
        this.drawActorMp(actor, x, bottom - lineHeight * 3, width);
        this.drawActorTp(actor, x, bottom - lineHeight * 2, width);
      } else if (actor.displayMP()) {
        this.drawActorMp(actor, x, bottom - lineHeight * 3, width);
      } else if (actor.displayTP()) {
        this.drawActorTp(actor, x, bottom - lineHeight * 2, width);
      };
      this.drawActorIcons(actor, x, bottom - lineHeight * 1, width);
  };

};

//-----------------------------------------------------------------------------
// Window_Status
//
// The window for displaying full status on the status screen.

Window_Status.prototype.drawBasicInfo = function(x, y) {
  var lineHeight = this.lineHeight();
  this.drawActorLevel(this._actor, x, y + lineHeight * 0);
  this.drawActorIcons(this._actor, x, y + lineHeight * 1);
  this.drawActorHp(this._actor, x, y + lineHeight * 2);
  if (this._actor.displayMP() && this._actor.displayTP()) {
    this.drawActorMp(this._actor, x, y + lineHeight * 3, 93);
    this.drawActorTp(this._actor, x + 93, y + lineHeight * 3, 93);
  } else if (this._actor.displayMP()) {
    this.drawActorMp(this._actor, x, y + lineHeight * 3, 186);
  } else if (this._actor.displayTP()) {
    this.drawActorTp(this._actor, x, y + lineHeight * 3, 186);
  };
};

if (!Crystal.Basic.CustomBattleDisplay) {

  //-----------------------------------------------------------------------------
  // Window_BattleStatus
  //
  // The window for displaying the status of party members on the battle screen.

  Window_BattleStatus.prototype.drawGaugeArea = function(rect, actor) {
    if (actor.displayMP() && actor.displayTP()) {
      this.drawGaugeAreaWithTp(rect, actor);
    } else if (actor.displayMP()) {
      this.drawGaugeAreaWithoutTp(rect, actor);
    } else if (actor.displayTP()) {
      this.drawGaugeAreaWithoutMp(rect, actor);
    } else {
      this.drawGaugeAreaWithHp(rect, actor);
    };
  };

  Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
    this.drawActorHp(actor, rect.x + 0, rect.y, 140);
    this.drawActorMp(actor, rect.x + 150, rect.y, 90);
    this.drawActorTp(actor, rect.x + 240, rect.y, 90);
  };

  Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
      this.drawActorHp(actor, rect.x + 0, rect.y, 140);
      this.drawActorMp(actor, rect.x + 150,  rect.y, 180);
  };

  Window_BattleStatus.prototype.drawGaugeAreaWithHp = function(rect, actor) {
    this.drawActorHp(actor, rect.x + 0, rect.y, 140);
  };

  Window_BattleStatus.prototype.drawGaugeAreaWithoutMp = function(rect, actor) {
    this.drawActorHp(actor, rect.x + 0, rect.y, 140);
    this.drawActorTp(actor, rect.x + 150,  rect.y, 180);
  };

} else if (Imported.YEP_BattleStatusWindow) {

  //-----------------------------------------------------------------------------
  // Window_BattleStatus
  //
  // The window for displaying the status of party members on the battle screen.

  Window_BattleStatus.prototype.drawGaugeArea = function(rect, actor) {
      this.contents.fontSize = Yanfly.Param.BSWParamFontSize;
      this._enableYBuffer = true;
      var wy = rect.y + rect.height - this.lineHeight();
      var wymod = (Imported.YEP_CoreEngine) ? Yanfly.Param.GaugeHeight : 6;
      var wymod = Math.max(16, wymod);
      this.drawActorHp(actor, rect.x, wy - wymod, rect.width);
      if (this.getGaugesDrawn(actor) <= 2) {
        this.drawActorMp(actor, rect.x, wy, rect.width);
      } else {
        var ww = rect.width / 2;
        if (actor.displayMP() && actor.displayTP()) {
          this.drawActorMp(actor, rect.x, wy, ww);
          this.drawActorTp(actor, rect.x + ww, wy, ww);
        } else if (actor.displayMP()) {
          this.drawActorTp(actor, rect.x, wy, rect.width);
        } else if (actor.displayTP()) {
          this.drawActorMp(actor, rect.x, wy, rect.width);
        }
      };
      this._enableYBuffer = false;
  };

} else if (Yanfly.ATB) {

  //-----------------------------------------------------------------------------
  // Window_BattleStatus
  //
  // The window for displaying the status of party members on the battle screen.

  Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
    if (this.isATBGaugeStyle(2)) {
      var totalArea = this.gaugeAreaWidth();
      var gw = totalArea / 3 - 15;
      this.drawActorHp(actor, rect.x + 0, rect.y, gw);
      if (actor.displayMP() && actor.displayTP()) {
        this.drawActorMp(actor, rect.x + gw * 1 + 15, rect.y, gw / 2);
        this.drawActorTp(actor, rect.x + gw * 1.5 + 15, rect.y, gw / 2);
      } else if (actor.displayMP()) {
        this.drawGaugeAreaWithoutTp(rect, actor);
      } else if (actor.displayTP()) {
        this.drawGaugeAreaWithoutMp(rect, actor);
      } else {
        this.drawGaugeAreaWithHp(rect, actor);
      };
      this.drawActorAtbGauge(actor, rect.x + gw * 2 + 30, rect.y, gw);
    } else {
      Yanfly.ATB.Window_BattleStatus_drawGaugeAreaWithTp.call(this, rect, actor);
    }
  };

};
