//=============================================================================
// Neo Crystal Engine - GF Summon
// NCE_X_GFSummon.js
// Version 1.00
//=============================================================================

var Imported = Imported || {};
var Crystal = Crystal || {};

//=============================================================================
/*:
 * @plugindesc Allows for the player to summon their GFs into battle.
 * @author Crystal Noel
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin adds the ability for the player to use skills to summon his/her
 * GFs into battle to help his/her party out in battle. For the duration of the
 * summon, the GF is treated as a fully functioning party member and can take
 * damage just like any other party member.
 *
 * ============================================================================
 * Version History
 * ============================================================================
 *
 * - 1.00 (8/14/16): Initial Release
 *
 * ============================================================================
 * Summoning
 * ============================================================================
 *
 * When the player summons a GF there are different ways that it can be done.
 * These are determined by the skill and change how often and when the player
 * chooses to summon. Summon skills can call multiple GFs to the field so GFs
 * similar to the Magnus Sisters in Final Fantasy X or the Shiva Sisters in
 * Final Fantasy XIII can be created.
 *
 * The differnt summon types are:
 *   0 - GF(s) replace the entire party.
 *   1 - GF(s) join the user and the rest of the party is removed
 *   2 - GF(s) replaces the summoner. The rest of the party is untouched.
 *   3 - Adds the GF(s) to the party, even if the party is full.
 *
 * Skill and Item Notetags
 *   <summon: x, x>
 *   Summons the GFs designated by the specified actor ids.
 *
 *   <summon style: x>
 *   Changes the summon style to the specifed style. You can see what each one
 *   does above.
 *
 *  <dismiss summon>
 *  Causes the skill/item to dismiss the party's summons after use, reguardless
 *  of which side used it and who it targeted.
 *
 * ============================================================================
 * End of Help
 * ============================================================================
 *
 * @param Default Summon Style
 * @desc Sets the summon style of all skills and items.
 * Check the help section for each of the summon styles.
 * @default 0
 */
//=============================================================================

//=============================================================================
// Plugin Registry
//=============================================================================

Crystal.Registry = Crystal.Registry || {};
Crystal.Registry.ScriptNames = Crystal.Registry.ScriptNames || {};
Crystal.Registry.ScriptNames.NCE_BasicModule = "Neo Crystal Engine - Basic Module";
Crystal.Registry.ScriptNames.NCE_GuardianForces = "Neo Crystal Engine - Guardian Forces";
Crystal.Registry.ScriptNames.NCE_X_GFSummon = "New Crystal Engine - GF Summon";

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

Crystal.Registry.NCE_X_GFSummon = Crystal.Registry.NCE_X_GFSummon || {};

Crystal.Registry.NCE_X_GFSummon.loadDatabase = DataManager.loadDatabase;
DataManager.loadDatabase = function() {
  Crystal.Registry.NCE_X_GFSummon.loadDatabase.call(this);
  Crystal.Registry.checkScripts("NCE_X_GFSummon", "NCE_BasicModule", 1.02);
  Crystal.Registry.checkScripts("NCE_X_GFSummon", "NCE_GuardianForces", 1.00);
}

Imported.NCE_X_GFSummon = 1.00;

//=============================================================================
// Parameter Variables
//=============================================================================

Crystal.GFSummonParameters = PluginManager.parameters('NCE_X_GFSummon');
Crystal.GuardianForces = Crystal.GuardianForces || {};

Crystal.GuardianForces.DefaultSummonStyle = Number(Crystal.GFSummonParameters["Default Summon Style"]);

//-----------------------------------------------------------------------------
// BattleManager
//
// The static class that manages battle progress.

Crystal.Registry.NCE_X_GFSummon.BattleManager_checkBattleEnd = BattleManager.checkBattleEnd;
BattleManager.checkBattleEnd = function() {
  if ($gameParty.isAllDead() && $gameParty.summoned()) {
    $gameParty.clearSummons();
  };
  return Crystal.Registry.NCE_X_GFSummon.BattleManager_checkBattleEnd.call(this);
};

//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

Crystal.Registry.NCE_X_GFSummon.Game_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
  Crystal.Registry.NCE_X_GFSummon.Game_Action_apply.call(this, target);
  var aeons      = checkNotes(this.item().note, "summon", "numArray");
  var summonType = checkNotes(this.item().note, "summon type", "num");
  if (!summonType) {
    var summonType = Crystal.GuardianForces.DefaultSummonStyle;
  };
  var summons = [];
  if (aeons && !$gameParty.summoned()) {
    if (summonType == 0) {
      aeons.forEach(function(arr) {
        summons.push(Number(arr[1]));
      }, this);
    } else if (summonType == 1) {
      summons.push(this.subject().actorId())
      aeons.forEach(function(arr) {
        summons.push(Number(arr[1]));
      }, this);
    } else if (summonType == 2) {
      $gameParty.members().forEach(function(actor) {
        if (actor.actorId() != this.subject().actorId()) {
          summons.push(actor.actorId());
        } else {
          aeons.forEach(function(arr) {
            summons.push(Number(arr[1]));
          }, this);
        };
      }, this);
    } else if (summonType == 3) {
      $gameParty.members().forEach(function(actor) {
        summons.push(actor.actorId());
      }, this);
      aeons.forEach(function(arr) {
        summons.push(Number(arr[1]));
      }, this);
    } else {
      var msg = "The summon type " + String(summonType) + " is not a valid summon type.\n";
      msg  += "Please refer to the help file for a list of valid options.";
      throw {
        name:          "Pluggin Error",
        level:         "Invalid Summon Type",
        message:       msg,
        htmlMessage:    mdg,
        toString:      function(){return this.name + ": " + this.message}
      };
    };
    $gameParty.setSummons(summons);
    this.makeSuccess(target);
  };
  if ($gameParty.summoned() && checkNotes(this.item().note, "dismiss summon", null)) {
    $gameParty.clearSummons();
    this.makeSuccess(target);
  };
};

//-----------------------------------------------------------------------------
// Game_Party
//
// The game object class for the party. Information such as gold and items is
// included.

Crystal.Registry.NCE_X_GFSummon.Game_Party_initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function() {
  Crystal.Registry.NCE_X_GFSummon.Game_Party_initialize.call(this);
  this._summons = [];
};

Game_Party.prototype.summoned = function() {
  return this._summons.length > 0;
};

Game_Party.prototype.setSummons = function(summons) {
  this._summons = summons;
};

Game_Party.prototype.clearSummons = function() {
  this._summons = [];
};

Crystal.Registry.NCE_X_GFSummon.Game_Party_battleMembers = Game_Party.prototype.battleMembers;
Game_Party.prototype.battleMembers = function() {
  if (!this.summoned()) {
    return Crystal.Registry.NCE_X_GFSummon.Game_Party_battleMembers.call(this);
  } else {
    return this._summons.map(function(id) {
      return $gameActors.actor(id);
    });
  };
};

Crystal.Registry.NCE_X_GFSummon.Game_Party_onBattleEnd = Game_Party.prototype.onBattleEnd;
Game_Party.prototype.onBattleEnd = function() {
  Crystal.Registry.NCE_X_GFSummon.Game_Party_onBattleEnd.call(this);
  this._summons = [];
};
