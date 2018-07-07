//=============================================================================
// Neo Crystal Engine - Guardian Forces
// NCE_GuardianForces.js
// Version 1.00
//=============================================================================

var Imported = Imported || {};
var Crystal = Crystal || {};

//=============================================================================
/*:
 * @plugindesc Basic functions for Neo Crystal Engine Guardian Force plugins.
 * @author Crystal Noel
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin allows for the user to designate certain actors as a Guardian
 * Force (GF) that can be used effectily as a kind of summon system for the
 * game. This plugin lays down the fondation and has ver limited functionality.
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
 * Yo use this plugin all you have to do is put the appropriate notetag in the
 * notebox of the actor(s) you want to make GFs. By doing so, the actor will not
 * appear in your main party, as it is added to a separate party for GFs.
 *
 * Actor Notetags
 *   <guardian force>
 *   Desginates the actor as a Guardian Force.
 *
 * ============================================================================
 * End of Help
 * ============================================================================
 */
//=============================================================================

//=============================================================================
// Plugin Registry
//=============================================================================

Crystal.Registry = Crystal.Registry || {};
Crystal.Registry.ScriptNames = Crystal.Registry.ScriptNames || {};
Crystal.Registry.ScriptNames.NCE_BasicModule = "Neo Crystal Engine - Basic Module";
Crystal.Registry.ScriptNames.NCE_GuardianForces = "Neo Crystal Engine - Guardian Forces";

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

Crystal.Registry.NCE_GuardianForces = Crystal.Registry.NCE_GuardianForces || {};

Crystal.Registry.NCE_GuardianForces.loadDatabase = DataManager.loadDatabase;
DataManager.loadDatabase = function() {
  Crystal.Registry.NCE_GuardianForces.loadDatabase.call(this);
  Crystal.Registry.checkScripts("NCE_GuardianForces", "NCE_BasicModule", 1.02);
}

Imported.NCE_GuardianForces = 1.00;

//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

Game_Actor.prototype.isGF = function() {
  return checkNotes(this.actor().note, "guardian force", null);
};

//-----------------------------------------------------------------------------
// Game_Party
//
// The game object class for the party. Information such as gold and items is
// included.

Crystal.Registry.NCE_GuardianForces.Game_Party_intialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function() {
  Crystal.Registry.NCE_GuardianForces.Game_Party_intialize.call(this);
  this._gfs = [];
};

Game_Party.prototype.guardianForces = function() {
  return this._gfs.map(function(actorId) {
    return $gameActors.actor(actorId);
  }, this);
};

Game_Party.prototype.setupStartingMembers = function() {
  this._actors = [];
  $dataSystem.partyMembers.forEach(function(actorId) {
    if ($gameActors.actor(actorId)) {
      if ($gameActors.actor(actorId).isGF()) {
        this._gfs.push(actorId);
      } else {
        this._actors.push(actorId);
      };
    }
  }, this);
};

Crystal.Registry.NCE_GuardianForces.Game_Party_addActor = Game_Party.prototype.addActor;
Game_Party.prototype.addActor = function(actorId) {
  if ($gameActors.actor(actorId).isGF()) {
    if (!this._gfs.includes(actorId)) {
      this._gfs.push(actorId);
    };
  } else {
    Crystal.Registry.NCE_GuardianForces.Game_Party_addActor.call(this, actorId);
  };
};

Crystal.Registry.NCE_GuardianForces.Game_Party_removeActor = Game_Party.prototype.removeActor;
Game_Party.prototype.removeActor = function(actorId) {
  if ($gameActors.actor(actorId).isGF()) {
    if (this._gfs.includes(actorId)) {
      var index = this._gfs.indexOf(actorId);
      this._gfs.splice(index, 1);
    };
  } else {
    Crystal.Registry.NCE_GuardianForces.Game_Party_removeActor.call(this, actorId);
  };
};

//-----------------------------------------------------------------------------
// Game_Interpreter
//
// The interpreter for running event commands.

Game_Interpreter.prototype.iterateActorId = function(param, callback) {
  if (param === 0) {
    var members = $gameParty.members().concat($gameParty.guardianForces());
    members.forEach(callback);
  } else {
    var actor = $gameActors.actor(param);
    if (actor) {
      callback(actor);
    }
  }
};
