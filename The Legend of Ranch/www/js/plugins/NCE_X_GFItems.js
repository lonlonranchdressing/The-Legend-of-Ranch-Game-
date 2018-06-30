//=============================================================================
// Neo Crystal Engine - GF Items
// NCE_X_GFItems.js
// Version 1.00
//=============================================================================

var Imported = Imported || {};
var Crystal = Crystal || {};

//=============================================================================
/*:
 * @plugindesc Allows for you to creates items to be used on GFs.
 * @author Crystal Noel
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin allows for the creation of items specifically made for usage on
 * GFs in the party. This allows for the user to creates items to heal GFs
 * should anything happen to them.
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
 * When using this plugin, note that items can only be used on the main party or
 * on GFs. They cannot under any circumstances be used on both for any one item.
 * An item designated can only be used on GFs, and one not designated can only
 * be used on the main party.
 *
 * Skill and Item Notetags
 *   <guardian force item>
 *   Desginates that this item is to used on GFs.
 *
 * ============================================================================
 * End of Help
 * ============================================================================
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
Crystal.Registry.ScriptNames.NCE_X_GFItems = "New Crystal Engine - GF Items";

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

Crystal.Registry.NCE_X_GFItems = Crystal.Registry.NCE_X_GFItems || {};

Crystal.Registry.NCE_X_GFItems.loadDatabase = DataManager.loadDatabase;
DataManager.loadDatabase = function() {
  Crystal.Registry.NCE_X_GFItems.loadDatabase.call(this);
  Crystal.Registry.checkScripts("NCE_X_GFItems", "NCE_BasicModule", 1.02);
  Crystal.Registry.checkScripts("NCE_X_GFItems", "NCE_GuardianForces", 1.00);
}

Imported.NCE_X_GFItems = 1.00;

//-----------------------------------------------------------------------------
// Window_MenuGFHeal
//
// The window for selecting a target GF on the item and skill screens.

function Window_MenuGFHeal() {
    this.initialize.apply(this, arguments);
}

Window_MenuGFHeal.prototype = Object.create(Window_MenuGF.prototype);
Window_MenuGFHeal.prototype.constructor = Window_MenuGFHeal;

Window_MenuGFHeal.prototype.initialize = function() {
  Window_MenuGF.prototype.initialize.call(this, 0, 0);
  this.hide();
};

Window_MenuGFHeal.prototype.processOk = function() {
  if (!this.cursorAll()) {
    $gameParty.setTargetActor($gameParty.guardianForces()[this.index()]);
  }
  this.callOkHandler();
};

Window_MenuGFHeal.prototype.selectLast = function() {
  this.select($gameParty.targetActor().index() || 0);
};

Window_MenuGFHeal.prototype.selectForItem = function(item) {
  var actor = $gameParty.menuActor();
  var action = new Game_Action(actor);
  action.setItemObject(item);
  this.setCursorFixed(false);
  this.setCursorAll(false);
  if (action.isForUser()) {
    if (DataManager.isSkill(item)) {
      this.setCursorFixed(true);
      this.select(actor.index());
    } else {
      this.selectLast();
    }
  } else if (action.isForAll()) {
    this.setCursorAll(true);
    this.select(0);
  } else {
    this.selectLast();
  }
};

//-----------------------------------------------------------------------------
// Scene_ItemBase
//
// The superclass of Scene_Item and Scene_Skill.

Crystal.Registry.NCE_X_GFItems.Scene_ItemBase_createActorWindow = Scene_ItemBase.prototype.createActorWindow;
Scene_ItemBase.prototype.createActorWindow = function() {
  Crystal.Registry.NCE_X_GFItems.Scene_ItemBase_createActorWindow.call(this);
  this._gfWindow = new Window_MenuGFHeal();
  this._gfWindow.setHandler('ok',     this.onGFOk.bind(this));
  this._gfWindow.setHandler('cancel', this.onGFCancel.bind(this));
  this.addWindow(this._gfWindow);
};

Crystal.Registry.NCE_X_GFItems.Scene_ItemBase_determineItem = Scene_ItemBase.prototype.determineItem;
Scene_ItemBase.prototype.determineItem = function() {
  var action = new Game_Action(this.user());
  var item = this.item();
  action.setItemObject(item);
  if (action.isForFriend() && checkNotes(item.note, "guardian force item", null)) {
    this.showSubWindow(this._gfWindow);
    this._gfWindow.selectForItem(this.item());
  } else {
    Crystal.Registry.NCE_X_GFItems.Scene_ItemBase_determineItem
  }
};

Scene_ItemBase.prototype.onGFOk = function() {
  if (this.canUse()) {
    this.useItem();
  } else {
    SoundManager.playBuzzer();
  };
};

Scene_ItemBase.prototype.onGFCancel = function() {
  this.hideSubWindow(this._gfWindow);
};

Crystal.Registry.NCE_X_GFItems.Scene_ItemBase_useItem = Scene_ItemBase.prototype.useItem;
Scene_ItemBase.prototype.useItem = function() {
  Crystal.Registry.NCE_X_GFItems.Scene_ItemBase_useItem.call(this);
  this._gfWindow.refresh();
};

Crystal.Registry.NCE_X_GFItems.Scene_ItemBase_itemTargetActors = Scene_ItemBase.prototype.itemTargetActors;
Scene_ItemBase.prototype.itemTargetActors = function() {
  var action = new Game_Action(this.user());
  if (action.isForFriend() && action.isForAll() && checkNotes(item.note, "guardian force item", null)) {
    return $gameParty.members();
  } else if (action.isForFriend() && checkNotes(item.note, "guardian force item", null)) {
    return [$gameParty.members()[this._actorWindow.index()]];
  } else {
    Crystal.Registry.NCE_X_GFItems.Scene_ItemBase_itemTargetActors.call(this);
  };
};
