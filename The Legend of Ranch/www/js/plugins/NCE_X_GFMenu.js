//=============================================================================
// Neo Crystal Engine - GF Menu
// NCE_X_GFMenu.js
// Version 1.00
//=============================================================================

var Imported = Imported || {};
var Crystal = Crystal || {};

//=============================================================================
/*:
 * @plugindesc A menu to view GFs and change the skill they are learning.
 * @author Crystal Noel
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin allows for the player to go to a menu that allows him/her to
 * change the skills that the GFs are currently learning and also allows the
 * player to view the status and change equipment, provided that is an option
 * from the game.
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
 * By using this plugin, the GFs command is automatically, added to the
 * menu unless you are using a custom menu plugin. This menu has the option to
 * change the skill that the GF is learning by AP. In addition the user has the
 * option to enable or diable the Equipment menu for GFs.
 *
 * ============================================================================
 * End of Help
 * ============================================================================
 *
 * @param Equipable
 * @desc Can GFs use equipment?
 * NO - false     YES - true
 * @default false
 *
 * @param Learning Icon
 * @desc The icon placed next to the skill currently being learned by the GF.
 * @default 92
 *
 * @param GF Term
 * @desc The term used to refer to GFs in the menu.
 * @default GF
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
Crystal.Registry.ScriptNames.NCE_X_GFMenu = "Neo Crystal Engine - GF Menu"

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

Crystal.Registry.NCE_X_GFMenu = Crystal.Registry.NCE_X_GFMenu || {};

Crystal.Registry.NCE_X_GFMenu.loadDatabase = DataManager.loadDatabase;
DataManager.loadDatabase = function() {
  Crystal.Registry.NCE_X_GFMenu.loadDatabase.call(this);
  Crystal.Registry.checkScripts("NCE_X_GFMenu", "NCE_BasicModule", 1.02);
  Crystal.Registry.checkScripts("NCE_X_GFMenu", "NCE_GuardianForces", 1.00);
  Crystal.Registry.checkScripts("NCE_X_GFMenu", "NCE_X_GFJunction", 1.00);
}

Imported.NCE_X_GFMenu = 1.00;

//=============================================================================
// Parameter Variables
//=============================================================================

Crystal.GFMenuParameters = PluginManager.parameters('NCE_X_GFMenu');
Crystal.GuardianForces = Crystal.GuardianForces || {};

Crystal.GuardianForces.Equipable    = eval(String(Crystal.GFMenuParameters["Equipable"]));
Crystal.GuardianForces.LearningIcon = Number(Crystal.GFMenuParameters["Learning Icon"]);
Crystal.GuardianForces.GFTerm       = String(Crystal.GFMenuParameters["GF Term"]);

//-----------------------------------------------------------------------------
// Game_Party
//
// The game object class for the party. Information such as gold and items is
// included.

Game_Party.prototype.menuActor = function() {
  var actor = $gameActors.actor(this._menuActorId);
  if (!this.members().contains(actor) && !this.guardianForces().contains(actor)) {
    actor = this.members()[0];
  }
  return actor;
};

Game_Party.prototype.makeMenuGFNext = function() {
  var index = this.guardianForces().indexOf(this.menuActor());
  if (index >= 0) {
    index = (index + 1) % this.guardianForces().length;
    this.setMenuActor(this.guardianForces()[index]);
  } else {
    this.setMenuActor(this.guardianForces()[0]);
  }
};

Game_Party.prototype.makeMenuGFPrevious = function() {
  var index = this.guardianForces().indexOf(this.menuActor());
  if (index >= 0) {
    index = (index + this.guardianForces().length - 1) % this.guardianForces().length;
    this.setMenuActor(this.guardianForces()[index]);
  } else {
    this.setMenuActor(this.guardianForces()[0]);
  }
};

//-----------------------------------------------------------------------------
// Window_MenuCommand
//
// The window for selecting a command on the menu screen.

Crystal.Registry.NCE_X_GFMenu.Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
  Crystal.Registry.NCE_X_GFMenu.Window_MenuCommand_addOriginalCommands.call(this);
  var enabled = this.areMainCommandsEnabled();
  this.addCommand(Crystal.GuardianForces.GFTerm, 'gf', enabled);
};

//-----------------------------------------------------------------------------
// Window_MenuStatus
//
// The window for displaying party member status on the menu screen.

Window_MenuStatus.prototype.selectLast = function() {
  this.select($gameParty.menuActor().index().clamp(0, this.maxItems() - 1) || 0);
};

//-----------------------------------------------------------------------------
// Window_MenuGF
//
// The window for displaying GF status on the menu screen.

function Window_MenuGF() {
  this.initialize.apply(this, arguments);
}

Window_MenuGF.prototype = Object.create(Window_MenuStatus.prototype);
Window_MenuGF.prototype.constructor = Window_MenuStatus;

Window_MenuGF.prototype.initialize = function(x, y) {
  Window_MenuStatus.prototype.initialize.call(this, x, y);
};

Window_MenuGF.prototype.maxItems = function() {
  return $gameParty.guardianForces().length;
};

Window_MenuGF.prototype.loadImages = function() {
  $gameParty.guardianForces().forEach(function(actor) {
    ImageManager.loadFace(actor.faceName());
  }, this);
};

Window_MenuGF.prototype.drawItemImage = function(index) {
  var actor = $gameParty.guardianForces()[index];
  if (Crystal.Basic.CustomMenuDisplay) {
    var rect = this.itemRectForText(index);
    var w = Math.min(rect.width, 144);
    var h = Math.min(rect.height, 144);
    var lineHeight = this.lineHeight();
    this.drawActorFace(actor, rect.x, rect.y + lineHeight * 2.5, w, h);
  } else {
    var rect = this.itemRect(index);
    this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth, Window_Base._faceHeight);
  };
};

Window_MenuGF.prototype.drawItemStatus = function(index) {
  var actor = $gameParty.guardianForces()[index];
  if (Crystal.Basic.CustomMenuDisplay) {
    var rect = this.itemRectForText(index);
    var x = rect.x;
    var y = rect.y;
    var width = rect.width;
    var bottom = y + rect.height;
    var lineHeight = this.lineHeight();
    this.drawActorName(actor, x, y + lineHeight * 0, width);
    this.drawActorLevel(actor, x, y + lineHeight * 1, width);
    this.drawActorClass(actor, x, bottom - lineHeight * 4, width);
    this.drawActorHp(actor, x, bottom - lineHeight * 3, width);
    this.drawActorMp(actor, x, bottom - lineHeight * 2, width);
    this.drawActorIcons(actor, x, bottom - lineHeight * 1, width);
  } else {
    var rect = this.itemRect(index);
    var x = rect.x + 162;
    var y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
    var width = rect.width - x - this.textPadding();
    this.drawActorSimpleStatus(actor, x, y, width);
  };
};

Window_MenuGF.prototype.processOk = function() {
    Window_Selectable.prototype.processOk.call(this);
    $gameParty.setMenuActor($gameParty.guardianForces()[this.index()]);
};

Window_MenuGF.prototype.isCurrentItemEnabled = function() {
  return true;
};

Window_MenuGF.prototype.selectLast = function() {
  this.select($gameParty.menuActor().index().clamp(0, this.maxItems() - 1) || 0);
};

//-----------------------------------------------------------------------------
// Window_GFCommand
//
// The command window for GF Menu

function Window_GFCommand() {
  this.initialize.apply(this, arguments);
}

Window_GFCommand.prototype = Object.create(Window_Command.prototype);
Window_GFCommand.prototype.constructor = Window_GFCommand;

Window_GFCommand.prototype.initialize = function(x, y) {
  Window_Command.prototype.initialize.call(this, x, y);
};

Window_GFCommand.prototype.numVisibleRows = function() {
  return 4;
};

Window_GFCommand.prototype.makeCommandList = function() {
  this.addCommand("Learn", 'learn');
  this.addCommand(TextManager.status, 'status');
  if (Crystal.GuardianForces.Equipable) {
    this.addCommand(TextManager.equip, 'equip');
  };
};

//-----------------------------------------------------------------------------
// Window_SkillListLearn
//
// The window for displaying all learnable skills for an actor.

function Window_SkillListLearn() {
  this.initialize.apply(this, arguments);
}

Window_SkillListLearn.prototype = Object.create(Window_SkillList.prototype);
Window_SkillListLearn.prototype.constructor = Window_SkillListLearn;

Window_SkillListLearn.prototype.initialize = function(x, y, width, height) {
  Window_SkillList.prototype.initialize.call(this, x, y, width, height);
};

Window_SkillListLearn.prototype.includes = function(item) {
  return Object.keys(this._actor.learningSkills()).contains(item.id);
};

Window_SkillListLearn.prototype.isEnabled = function(item) {
  return item && this._actor.hasSkill(item.id);
};

Window_SkillListLearn.prototype.isCurrentItemEnabled = function() {
  return true;
};

Window_SkillListLearn.prototype.drawItemName = function(item, x, y, width) {
  width = width || 312;
  if (item) {
    var iconBoxWidth = Window_Base._iconWidth + 4;
    this.resetTextColor();
    if (this._actor.learningSkill() == item.id && item.id > 0) {
      this.changePaintOpacity(true);
      this.drawIcon(Crystal.GuardianForces.LearningIcon, x + 2, y + 2);
      this.changePaintOpacity(this.isEnabled(item));
    };
    this.drawIcon(item.iconIndex, x + iconBoxWidth + 4, y + 2);
    this.drawText(item.name, x + iconBoxWidth * 2, y, width - iconBoxWidth);
  }
};

Window_SkillListLearn.prototype.costWidth = function() {
  return this.textWidth('Complete!');

};

Window_SkillListLearn.prototype.makeItemList = function() {
  if (this._actor) {
    this._data = Object.keys(this._actor.learningSkills()).map(function(skillId) {
      return $dataSkills[skillId];
    }, this);
  } else {
    this._data = [];
  }
};

Window_SkillListLearn.prototype.drawSkillCost = function(skill, x, y, width) {
  this.resetTextColor();
  if (this._actor.hasSkill(skill.id)) {
    this.drawText("Complete!", x, y, width, 'right');
  } else {
    a = String(this._actor.learningSkills()[skill.id][0]);
    b = String(this._actor.learningSkills()[skill.id][1]);
    this.drawText(a + "/" + b, x, y, width, 'right');
  };
};

//-----------------------------------------------------------------------------
// Scene_MenuBase
//
// The superclass of all the menu-type scenes.

Crystal.Registry.NCE_X_GFMenu.Scene_MenuBase_nextActor = Scene_MenuBase.prototype.nextActor;
Scene_MenuBase.prototype.nextActor = function() {
  if (this._actor.isGF()) {
    this.updateActor();
    this.onActorChange();
  } else {
    Crystal.Registry.NCE_X_GFMenu.Scene_MenuBase_nextActor.call(this);
  };
};

Crystal.Registry.NCE_X_GFMenu.Scene_MenuBase_previousActor = Scene_MenuBase.prototype.previousActor;
Scene_MenuBase.prototype.previousActor = function() {
  if (this._actor.isGF()) {
    this.updateActor();
    this.onActorChange();
  } else {
    Crystal.Registry.NCE_X_GFMenu.Scene_MenuBase_previousActor.call(this);
  };
};

//-----------------------------------------------------------------------------
// Scene_Menu
//
// The scene class of the menu screen.

Crystal.Registry.NCE_X_GFMenu.Scene_Menu_start = Scene_Menu.prototype.start;
Scene_Menu.prototype.start = function() {
  Crystal.Registry.NCE_X_GFMenu.Scene_Menu_start.call(this);
  this._gfWindow.refresh();
};

Crystal.Registry.NCE_X_GFMenu.Scene_Menu_createStatusWindow = Scene_Menu.prototype.createStatusWindow;
Scene_Menu.prototype.createStatusWindow = function() {
  Crystal.Registry.NCE_X_GFMenu.Scene_Menu_createStatusWindow.call(this);
  this._gfWindow = new Window_MenuGF(this._commandWindow.width, 0);
  this._gfWindow.openness = 0;
  this._gfWindow.setHandler('ok',     this.onGFOk.bind(this));
  this._gfWindow.setHandler('cancel', this.onGFCancel.bind(this));
  this.addWindow(this._gfWindow);
  if (Crystal.Basic.CustomMenuDisplay) {
    this._gfWindow.x = 0;
    this._gfWindow.y = this._commandWindow.height;
  };
};

Crystal.Registry.NCE_X_GFMenu.Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
  Crystal.Registry.NCE_X_GFMenu.Scene_Menu_createCommandWindow.call(this);
  this._commandWindow.setHandler('gf', this.commandGF.bind(this));
};

Scene_Menu.prototype.commandGF = function() {
  this._statusWindow.close();
  this._gfWindow.open();
  this._gfWindow.selectLast();
  this._gfWindow.activate();
};

Scene_Menu.prototype.onGFOk = function() {
  SceneManager.push(Scene_GFMenu);
};

Scene_Menu.prototype.onGFCancel = function() {
  this._gfWindow.deselect();
  this._gfWindow.close();
  this._statusWindow.open();
  this._commandWindow.activate();
};

//-----------------------------------------------------------------------------
// Scene_GFMenu
//
// The scene class of the GF menu screen.

function Scene_GFMenu() {
  this.initialize.apply(this, arguments);
}

Scene_GFMenu.prototype = Object.create(Scene_MenuBase.prototype);
Scene_GFMenu.prototype.constructor = Scene_GFMenu;

Scene_GFMenu.prototype.initialize = function() {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_GFMenu.prototype.create = function() {
  Scene_MenuBase.prototype.create.call(this);
  this.createHelpWindow();
  this.createCommandWindow();
  this.createStatusWindow();
  this.createItemWindow();
};

Scene_GFMenu.prototype.start = function() {
  Scene_MenuBase.prototype.start.call(this);
};

Scene_GFMenu.prototype.createCommandWindow = function() {
  var wy = this._helpWindow.height;
  this._commandWindow = new Window_GFCommand(0, wy);
  this._commandWindow.setHelpWindow(this._helpWindow);
  this._commandWindow.setHandler('learn',     this.commandLearn.bind(this));
  this._commandWindow.setHandler('status',     this.commandStatus.bind(this));
  this._commandWindow.setHandler('equip',     this.commandEquip.bind(this));
  this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
  this._commandWindow.setHandler('pagedown', this.nextActor.bind(this));
  this._commandWindow.setHandler('pageup',   this.previousActor.bind(this));
  this.addWindow(this._commandWindow);
};

Scene_GFMenu.prototype.createStatusWindow = function() {
  var wx = this._commandWindow.width;
  var wy = this._helpWindow.height;
  var ww = Graphics.boxWidth - wx;
  var wh = this._commandWindow.height;
  this._statusWindow = new Window_SkillStatus(wx, wy, ww, wh);
  this._statusWindow.setActor(this._actor);
  this.addWindow(this._statusWindow);
};

Scene_GFMenu.prototype.createItemWindow = function() {
  var wx = 0;
  var wy = this._statusWindow.y + this._statusWindow.height;
  var ww = Graphics.boxWidth;
  var wh = Graphics.boxHeight - wy;
  this._itemWindow = new Window_SkillListLearn(wx, wy, ww, wh);
  this._itemWindow.setHelpWindow(this._helpWindow);
  this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
  this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
  this._itemWindow.setActor(this._actor);
  this.addWindow(this._itemWindow);
};

Scene_GFMenu.prototype.commandLearn = function() {
  this._itemWindow.select(0);
  this._itemWindow.activate();
};

Scene_GFMenu.prototype.commandStatus = function() {
  SceneManager.push(Scene_Status);
};

Scene_GFMenu.prototype.commandEquip = function() {
  SceneManager.push(Scene_Equip);
};

Scene_GFMenu.prototype.onItemOk = function() {
  this._actor.changeLearningSkill(Object.keys(this._actor.learningSkills())[this._itemWindow.index()]);
  this._itemWindow.refresh();
  this._itemWindow.activate();
};

Scene_GFMenu.prototype.onItemCancel = function() {
  this._commandWindow.activate();
  this._itemWindow.deselect();
};

Scene_GFMenu.prototype.nextActor = function() {
  $gameParty.makeMenuGFNext();
  this.updateActor();
  this.onActorChange();
};

Scene_GFMenu.prototype.previousActor = function() {
  $gameParty.makeMenuGFPrevious();
  this.updateActor();
  this.onActorChange();
};

Scene_GFMenu.prototype.onActorChange = function() {
  this._statusWindow.setActor(this._actor);
  this._statusWindow.refresh();
  this._commandWindow.activate();
  this._itemWindow.setActor(this._actor);
  this._itemWindow.refresh();
};
