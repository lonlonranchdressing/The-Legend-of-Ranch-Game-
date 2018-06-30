//=============================================================================
// Neo Crystal Engine - GF Junction
// NCE_X_GFJunction.js
// Version 1.00
//=============================================================================

var Imported = Imported || {};
var Crystal = Crystal || {};

//=============================================================================
/*:
 * @plugindesc Recreates the Junctions System from Final Fantasy VIII.
 * @author Crystal Noel
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin allows for the player to Junction their GFs to his/her party
 * members allowing the actors to learn skills and the GFs to gain EXP.
 *
 * ============================================================================
 * Version History
 * ============================================================================
 *
 * - 1.00 (8/14/16): Initial Release
 *
 * ============================================================================
 * Usage
 * ============================================================================
 *
 * By using this plugin, the Junction command is automatically, added to the
 * menu unless you are using a custom menu plugin. The junctioned GFs gains
 * equal to the amount gained by the actor divided by the number of GFs
 * junctioned to that actor. The party also gains AP which is used to learn
 * skills for the GF, which then become usable by the actor. When one skill is
 * learned the next one is automatically reasigned. There is no way to change
 * the skills you are learning with just this plugin.
 *
 * Class Learning Notetags
 *   <ap required: x>
 *   Designates that the skill requires x AP to be learned. Note that the actor
 *   must also meet all of the level requirements as well.
 *
 * Skill Notetags
 *   <no share>
 *   Designates that GFs will not share this skill with the junctioned actor.
 *
 * Enemy Notetags
 *   <ap: x>
 *   Sets the amount of AP that is rewarded for defeating the enemy. Ommiting
 *   this notetag means that the enemy will not give out any AP.
 *
 * ============================================================================
 * End of Help
 * ============================================================================
 *
 * @param AP Gain Message
 * @desc The message displayed when you gain AP.
 * @default Gained %1 %2!
 *
 * @param AP Term
 * @desc The term used by the game for AP.
 * @default AP
 *
 * @param Junction Term
 * @desc The term used by the game for Junctioning.
 * @default Junction
 *
 * @param Exclusive Skill Types
 * @desc An array of skill types only usable by GFs.
 * (Separated by spaces.)
 * @default 2
 *
 * @param Summon Skill Type
 * @desc Designates the skill type for summons, so that is doesn't appear on the
 * skill list for the GF itself.
 * @default 3
 *
 */
//=============================================================================

//=============================================================================
// Plugin Registry
//=============================================================================

Crystal.Registry = Crystal.Registry || {};
Crystal.Registry.ScriptNames = Crystal.Registry.ScriptNames || {};
Crystal.Registry.ScriptNames.NCE_BasicModule = "Neo Crystal Engine - Basic Module";
Crystal.Registry.ScriptNames.NCE_GuardianForces = "Neo Crystal Engine - Guardian Forces";
Crystal.Registry.ScriptNames.NCE_X_GFJunction = "Neo Crystal Engine - GF Junction";

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

Crystal.Registry.NCE_X_GFJunction = Crystal.Registry.NCE_X_GFJunction || {};

Crystal.Registry.NCE_X_GFJunction.loadDatabase = DataManager.loadDatabase;
DataManager.loadDatabase = function() {
  Crystal.Registry.NCE_X_GFJunction.loadDatabase.call(this);
  Crystal.Registry.checkScripts("NCE_X_GFJunction", "NCE_BasicModule", 1.02);
  Crystal.Registry.checkScripts("NCE_X_GFJunction", "NCE_GuardianForces", 1.00);
}

Imported.NCE_X_GFJunction = 1.00;

//=============================================================================
// Parameter Variables
//=============================================================================

Crystal.GFJunctionParameters = PluginManager.parameters('NCE_X_GFJunction');
Crystal.GuardianForces = Crystal.GuardianForces || {};

Crystal.GuardianForces.APGainMessage = String(Crystal.GFJunctionParameters["AP Gain Message"]);
Crystal.GuardianForces.APTerm        = String(Crystal.GFJunctionParameters["AP Term"]);
Crystal.GuardianForces.JunctionTerm  = String(Crystal.GFJunctionParameters["Junction Term"]);
Crystal.GuardianForces.GFExclusives  = [];
var set = String(Crystal.GFJunctionParameters["Exclusive Skill Types"]).split(" ");
set.forEach(function(num) {
  Crystal.GuardianForces.GFExclusives.push(Number(num));
}, this);
Crystal.GuardianForces.SummonSkillType = Number(Crystal.GFJunctionParameters["Summon Skill Type"]);

//-----------------------------------------------------------------------------
// BattleManager
//
// The static class that manages battle progress.

Crystal.Registry.NCE_X_GFJunction.BattleManager_makeRewards = BattleManager.makeRewards;
BattleManager.makeRewards = function() {
  Crystal.Registry.NCE_X_GFJunction.BattleManager_makeRewards.call(this);
  this._rewards.ap = $gameTroop.apTotal();
};

Crystal.Registry.NCE_X_GFJunction.BattleManager_displayExp = BattleManager.displayExp;
BattleManager.displayExp = function() {
  if (this._rewards.ap > 0) {
    var text = Crystal.GuardianForces.APGainMessage.format(this._rewards.ap, Crystal.GuardianForces.APTerm);
    $gameMessage.add('\\.' + text);
  };
};

Crystal.Registry.NCE_X_GFJunction.BattleManager_gainExp = BattleManager.gainExp;
BattleManager.gainExp = function() {
  Crystal.Registry.NCE_X_GFJunction.BattleManager_gainExp.call(this);
  var ap = this._rewards.ap;
  $gameParty.allMembers().forEach(function(actor) {
    actor.junctionedActors().forEach(function(gf) {
      gf.gainAp(ap, true);
    }, this);
  }, this);
};

//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

Crystal.Registry.NCE_X_GFJunction.Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
  Crystal.Registry.NCE_X_GFJunction.Game_Actor_setup.call(this, actorId);
  this._junctionedGFs = [];
  this._junctionedTo = null;
  this._learningSkills = {};
  this.currentClass().learnings.forEach(function(learning) {
    var list = checkNotes(learning.note, "ap required", "num")
    if (list && this._level >= learning.level) {
      this._learningSkills[learning.skillId] = this._learningSkills[learning.skillId] || [0, Number(list[0][1])]
    };
  }, this);
  this._learningSkill = Object.keys(this._learningSkills)[0];
};

Game_Actor.prototype.junctioned = function() {
  return this.isGF() && this._junctionedTo;
};

Game_Actor.prototype.setJunction = function(actorId) {
  this._junctionedTo = actorId;
  this.refresh();
};

Game_Actor.prototype.changeLearningSkill = function(skillId) {
  this._learningSkill = skillId;
  this.refresh();
};

Game_Actor.prototype.addJunction = function(actorId) {
  if (!this._junctionedGFs.contains(actorId)) {
    this._junctionedGFs.push(actorId);
  };
};

Game_Actor.prototype.removeJunction = function(actorId) {
  var index = this._junctionedGFs.indexOf(actorId);
  this._junctionedGFs.splice(index, 1);
};

Game_Actor.prototype.junctionedActors = function() {
  return this._junctionedGFs.map(function(actorId) {
    return $gameActors.actor(actorId);
  }, this);
};

Game_Actor.prototype.junctionedTo = function() {
  return $gameActors.actor(this._junctionedTo);
};

Game_Actor.prototype.learningSkills = function() {
  return this._learningSkills;
};

Game_Actor.prototype.learningSkill = function() {
  return this._learningSkill;
};

Crystal.Registry.NCE_X_GFJunction.Game_Actor_addedSkillTypes = Game_Actor.prototype.addedSkillTypes;
Game_Actor.prototype.addedSkillTypes = function() {
  var set = Crystal.Registry.NCE_X_GFJunction.Game_Actor_addedSkillTypes.call(this);
  this.junctionedActors().forEach(function(actor) {
    actor.addedSkillTypes().forEach(function(skillType) {
      if (!set.contains(skillType) && !Crystal.GuardianForces.GFExclusives.contains(skillType)) {
        set.push(skillType);
      };
    }, this);
  }, this);
  return set;
};

Crystal.Registry.NCE_X_GFJunction.Game_Actor_changeExp = Game_Actor.prototype.changeExp;
Game_Actor.prototype.changeExp = function(exp, show) {
  var newExp = exp - this.currentExp();
  this.junctionedActors().forEach(function(actor) {
    actor.changeExp(actor.currentExp() + (newExp / this._junctionedGFs.length), show);
  }, this);
  Crystal.Registry.NCE_X_GFJunction.Game_Actor_changeExp.call(this, exp, show);
};

Crystal.Registry.NCE_X_GFJunction.Game_Actor_levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
  Crystal.Registry.NCE_X_GFJunction.Game_Actor_levelUp.call(this);
  this.currentClass().learnings.forEach(function(learning) {
    var list = checkNotes(learning.note, "ap required", "num")
    if (list && this._level === learning.level) {
      this._learningSkills[learning.skillId] = this._learningSkills[learning.skillId] || [0, Number(list[0][1])]
    };
  }, this);
};

Crystal.Registry.NCE_X_GFJunction.Game_Actor_changeClass = Game_Actor.prototype.changeClass;
Game_Actor.prototype.changeClass = function(classId, keepExp) {
  Crystal.Registry.NCE_X_GFJunction.Game_Actor_changeClass.call(this, classId, keepExp);
  this.currentClass().learnings.forEach(function(learning) {
    var list = checkNotes(learning.note, "ap required", "num")
    if (list && this._level >= learning.level) {
      this._learningSkills[learning.skillId] = this._learningSkills[learning.skillId] || [0, Number(list[0][1])]
    };
  }, this);
};

Crystal.Registry.NCE_X_GFJunction.Game_Actor_skills = Game_Actor.prototype.skills;
Game_Actor.prototype.skills = function() {
  var list = Crystal.Registry.NCE_X_GFJunction.Game_Actor_skills.call(this);
  for (id in this._learningSkills) {
    if (this._learningSkills[id][0] < this._learningSkills[id][1]) {
      var index = list.indexOf($dataSkills[id]);
      list.splice(index, 1);
    };
  };
  this.junctionedActors().forEach(function(actor) {
    actor.skills().forEach(function(skill) {
      if (!list.contains(skill) && !checkNotes(skill.note, "no share", null)) {
        list.push(skill);
      }
    }, this);
  }, this);
  return list;
};

Game_Actor.prototype.hasSkill = function(id) {
  if (this._learningSkills[id] != undefined) {
    return this._learningSkills[id][0] == this._learningSkills[id][1];
  } else if (this.isLearnedSkill(id)) {
    return true;
  };
  return false;
};

Game_Actor.prototype.gainAp = function(ap, show) {
  var change = this._learningSkills[this._learningSkill][0] + ap;
  this._learningSkills[this._learningSkill][0] = change.clamp(0, this._learningSkills[this._learningSkill][1]);
  if (show && this._learningSkills[this._learningSkill][0] == this._learningSkills[this._learningSkill][1]) {
    var text = TextManager.obtainSkill.format($dataSkills[this._learningSkill].name);
    $gameMessage.add('\\.' + text);
  };
  this.refresh();
};

Crystal.Registry.NCE_X_GFJunction.Game_Actor_refresh = Game_Actor.prototype.refresh;
Game_Actor.prototype.refresh = function() {
  Crystal.Registry.NCE_X_GFJunction.Game_Actor_refresh.call(this);
  if (this._learningSkill != undefined && this._learningSkill > 0) {
    if (this._learningSkills[this._learningSkill][0] >= this._learningSkills[this._learningSkill][1]) {
      this._learningSkills[this._learningSkill][0] == this._learningSkills[this._learningSkill][1]
      var skills = Object.keys(this._learningSkills);
      var index = skills.indexOf(this._learningSkill);
      this._learningSkill = skills[index + 1];
      if (this._learningSkill == undefined) {
        for (key in this._learningSkills) {
          var ap = this._learningSkills[key];
          if (ap[0] < ap[1]) {
            this._learningSkill = key;
            return;
          };
        };
        this._learningSkill = skills[index];
      };
    };
  };
};

//-----------------------------------------------------------------------------
// Game_Enemy
//
// The game object class for an enemy.

Game_Enemy.prototype.ap = function() {
  var ap = checkNotes(this.baseNote(), "ap", "num")
  if (ap) {
    return Number(ap[0][1]);
  } else {
    return 0;
  };
}

//-----------------------------------------------------------------------------
// Game_Troop
//
// The game object class for a troop and the battle-related data.

Game_Troop.prototype.apTotal = function() {
  return this.deadMembers().reduce(function(r, enemy) {
    return r += enemy.ap();
  }, 0)
};

//-----------------------------------------------------------------------------
// Game_Interpreter
//
// The interpreter for running event commands.

Crystal.Registry.NCE_X_GFJunction.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  Crystal.Registry.NCE_X_GFJunction.Game_Interpreter_pluginCommand.call(this, command, args);
  if (command === 'GainAP') {
    var id = Number(args[0]);
    var value = Number(args[1]);
    $gameActors.actor(id).gainAp(value);
  };
  if (command === 'LooseAP') {
    var id = Number(args[0]);
    var value = Number(args[1]);
    $gameActors.actor(id).gainAp(-value);
  };
};

//-----------------------------------------------------------------------------
// Window_MenuCommand
//
// The window for selecting a command on the menu screen.

Crystal.Registry.NCE_X_GFJunction.Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
  Crystal.Registry.NCE_X_GFJunction.Window_MenuCommand_addOriginalCommands.call(this);
  var enabled = this.areMainCommandsEnabled();
  this.addCommand(Crystal.GuardianForces.JunctionTerm, 'junction', enabled);
};

//-----------------------------------------------------------------------------
// Window_SkillType
//
// The window for selecting a skill type on the skill screen.

Window_SkillType.prototype.makeCommandList = function() {
  if (this._actor) {
    var skillTypes = this._actor.addedSkillTypes();
    skillTypes.sort(function(a, b) {
      return a - b;
    });
    if (this._actor.isGF()) {
      var index = skillTypes.indexOf(Crystal.SummonSkillType);
      skillTypes.splice(index, 1);
    };
    skillTypes.forEach(function(stypeId) {
      var name = $dataSystem.skillTypes[stypeId];
      this.addCommand(name, 'skill', true, stypeId);
    }, this);
  }
};

//-----------------------------------------------------------------------------
// Window_ActorCommand
//
// The window for selecting an actor's action on the battle screen.

Window_ActorCommand.prototype.addSkillCommands = function() {
  var skillTypes = this._actor.addedSkillTypes();
  skillTypes.sort(function(a, b) {
    return a - b;
  });
  if (this._actor.isGF()) {
    var index = skillTypes.indexOf(Crystal.SummonSkillType);
    skillTypes.splice(index, 1);
  };
  skillTypes.forEach(function(stypeId) {
    var name = $dataSystem.skillTypes[stypeId];
    this.addCommand(name, 'skill', true, stypeId);
  }, this);
};

//-----------------------------------------------------------------------------
// Window_GFList
//
// The command window list all the GFs you own.

function Window_GFList() {
  this.initialize.apply(this, arguments);
}

Window_GFList.prototype = Object.create(Window_Command.prototype);
Window_GFList.prototype.constructor = Window_GFList;

Window_GFList.prototype.initialize = function(x, y) {
  Window_Command.prototype.initialize.call(this, x, y);
  this._skillWindow = null;
  this._actor = null;
};

Window_GFList.prototype.windowWidth = function() {
  return 240;
};

Window_GFList.prototype.setActor = function(actor) {
  if (this._actor == actor) {
    return;
  };
  this._actor = actor;
  this.refresh();
  this.Last;
};

Window_GFList.prototype.setSkillWindow = function(skillWindow) {
  if (this._skillWindow == skillWindow) {
    return;
  };
  this._skillWindow = skillWindow;
  this.refresh();
};

Window_GFList.prototype.numVisibleRows = function() {
  return 2;
};

Window_GFList.prototype.makeCommandList = function() {
  $gameParty.guardianForces().forEach(function(gf) {
    this.addCommand(gf.name(), 'junction', true, gf.actorId())
  }, this);
};

Window_GFList.prototype.drawItem = function(index) {
  var actor = $gameParty.guardianForces()[index];
  var rect = this.itemRectForText(index);
  var align = this.itemTextAlign();
  this.resetTextColor();
  this.changePaintOpacity(!actor.junctioned());
  this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_GFList.prototype.refresh = function() {
  Window_Command.prototype.refresh.call(this);
  if (this._skillWindow) {
    this._skillWindow.setActor(this._actor);
  };
};

Window_GFList.prototype.updateHelp = function() {
  this._helpWindow.setText($gameActors.actor(this.currentExt()).profile());
};

//-----------------------------------------------------------------------------
// Window_JunctionActor
//
// This window lists the actor junctioned to the currently ed GF.

function Window_JunctionActor() {
  this.initialize.apply(this, arguments);
}

Window_JunctionActor.prototype = Object.create(Window_Command.prototype);
Window_JunctionActor.prototype.constructor = Window_JunctionActor;

Window_JunctionActor.prototype.initialize = function(x, y, commandWindow) {
  this._commandWindow = commandWindow;
  Window_Command.prototype.initialize.call(this, x, y);
};

Window_JunctionActor.prototype.numVisibleRows = function() {
  return 1;
};

Window_JunctionActor.prototype.makeCommandList = function() {
  var actor = $gameParty.guardianForces()[this._commandWindow.index()];
  if (actor.junctioned()) {
    this.addCommand(actor.junctionedTo().name(), 'actor');
  };
};

//-----------------------------------------------------------------------------
// Window_SkillListJunction
//
// This window is for displaying a list of available skills on the skill window.

function Window_SkillListJunction() {
  this.initialize.apply(this, arguments);
}

Window_SkillListJunction.prototype = Object.create(Window_SkillList.prototype);
Window_SkillListJunction.prototype.constructor = Window_SkillListJunction;

Window_SkillListJunction.prototype.includes = function(item) {
  return Window_SkillList.prototype.includes.call(this, item) || this._sTypeId == 0;
};

Window_SkillListJunction.prototype.isEnabled = function(item) {
  return item && this._actor.hasSkill(item.id);
};

//-----------------------------------------------------------------------------
// Scene_Menu
//
// The scene class of the menu screen.

Crystal.Registry.NCE_X_GFJunction.Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
  Crystal.Registry.NCE_X_GFJunction.Scene_Menu_createCommandWindow.call(this);
  this._commandWindow.setHandler('junction', this.commandPersonal.bind(this));
};

Crystal.Registry.NCE_X_GFJunction.Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
Scene_Menu.prototype.onPersonalOk = function() {
  Crystal.Registry.NCE_X_GFJunction.Scene_Menu_onPersonalOk.call(this);
  switch (this._commandWindow.currentSymbol()) {
  case 'junction':
    SceneManager.push(Scene_Junction);
    break;
  };
};

//-----------------------------------------------------------------------------
// Scene_Junction
//
// The scene class of the junction screen.

function Scene_Junction() {
  this.initialize.apply(this, arguments);
}

Scene_Junction.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Junction.prototype.constructor = Scene_Junction;

Scene_Junction.prototype.initialize = function() {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Junction.prototype.create = function() {
  Scene_MenuBase.prototype.create.call(this);
  this.createHelpWindow();
  this.createcommandWindow();
  this.createActorWindow();
  this.createStatusWindow();
  this.createItemWindow();
  this.refreshActor();
};

Scene_Junction.prototype.createcommandWindow = function() {
  this._commandWindow = new Window_GFList();
  this._commandWindow.setHelpWindow(this._helpWindow);
  this._commandWindow.y = this._helpWindow.height;
  this._commandWindow.setHandler('junction', this.commandJunction.bind(this));
  this._commandWindow.setHandler('cancel',   this.popScene.bind(this));
  this._commandWindow.setHandler('pagedown', this.nextActor.bind(this));
  this._commandWindow.setHandler('pageup',   this.previousActor.bind(this));
  this.addWindow(this._commandWindow);
};

Scene_Junction.prototype.createStatusWindow = function() {
  var wx = this._commandWindow.width;
  var wy = this._helpWindow.height;
  var ww = Graphics.boxWidth - wx;
  var wh = this._commandWindow.height + this._actorNameWindow.height;
  this._statusWindow = new Window_SkillStatus(wx, wy, ww, wh);
  this.addWindow(this._statusWindow);
};

Scene_Junction.prototype.createActorWindow = function() {
  this._actorNameWindow = new Window_JunctionActor(0, this._helpWindow.height + this._commandWindow.height, this._commandWindow);
  this._actorNameWindow.deselect();
  this.addWindow(this._actorNameWindow);
};

Scene_Junction.prototype.createItemWindow = function() {
  var wx = 0;
  var wy = this._statusWindow.y + this._statusWindow.height;
  var ww = Graphics.boxWidth;
  var wh = Graphics.boxHeight - wy;
  this._itemWindow = new Window_SkillListJunction(wx, wy, ww, wh);
  this._commandWindow.setSkillWindow(this._itemWindow);
  this.addWindow(this._itemWindow);
};

Scene_Junction.prototype.onActorChange = function() {
  this._commandWindow.setActor(this._actor);
  this._statusWindow.setActor(this._actor);
  this._commandWindow.activate();
  this._itemWindow.refresh();
};

Scene_Junction.prototype.commandJunction = function() {
  if ($gameParty.guardianForces()[this._commandWindow.index()].junctioned()) {
    gf = $gameActors.actor(this._commandWindow.currentExt());
    actor = gf.junctionedTo();
    actor.removeJunction(this._commandWindow.currentExt());
    gf.setJunction(null);
  } else {
    this._actor.addJunction(this._commandWindow.currentExt());
    $gameActors.actor(this._commandWindow.currentExt()).setJunction(this._actor.actorId());
  };
  this._commandWindow.refresh();
  this._commandWindow.activate();
};

Scene_Junction.prototype.refreshActor = function() {
  var actor = this.actor();
  this._statusWindow.setActor(actor);
};

Scene_Junction.prototype.update = function() {
  Scene_MenuBase.prototype.update.call(this);
  this._itemWindow.setActor($gameParty.guardianForces()[this._commandWindow.index()])
  this._actorNameWindow.refresh();
  this._actorNameWindow.deselect();
};
