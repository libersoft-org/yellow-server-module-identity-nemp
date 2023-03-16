const Data = require('./data.js');
const path = require('path');

class Protocol {
 constructor(data) {
  this.data = new Data();
//   this.protocolHandler(data);
 }

 async protocolHandler(data) {
   try {
    var req = JSON.parse(data);
    var res = {}
    if (req.command) {
    if (req.command.startsWith('admin_')) res = await this.processAdminCommand(req);
    else if (req.command.startsWith('user_')) res = await this.processUserCommand(req);
    else res = { error: 'command_unknown', message: 'Command is unknown' }
    } else res = { error: 'command_missing', message: 'Command was not specified' }
    return JSON.stringify(res);
   } catch (error) {
      console.log(error);
      return JSON.stringify({ error: 'invalid_command', message: 'expected valid json', /*"error": error.message*/ });
   }
 }

 async processAdminCommand(req) {
    if (req.command === 'admin_get_domains') return { command: req.command, data: await this.data.adminGetDomains() };
    else if (req.command === 'admin_add_domain') return { command: req.command, data: await this.data.adminAddDomain(req.name) };
      else if (req.command === 'admin_set_domain') return { command: req.command, data: await this.data.adminSetDomain(req.id, req.name) };
      else if (req.command === 'admin_del_domain') return { command: req.command, data: await this.data.adminDelDomains(req.id) };
      else if (req.command === 'admin_get_users') return { command: req.command, data: await this.data.adminGetUsers(req.domain_id) };
      else if (req.command === 'admin_add_user') return { command: req.command, data: await this.data.adminAddUser(req.domain_id, req.name, req.visible_name, req.password) };
      else if (req.command === 'admin_set_user') return { command: req.command, data: await this.data.adminSetUser(req.id, req.domain_id, req.name, req.visible_name, req.photo, req.password) };
      else if (req.command === 'admin_del_user') return { command: req.command, data: await this.data.adminDelUser(req.id) };
      else if (req.command === 'admin_get_aliases') return { command: req.command, data: await this.data.adminGetAliases(req.domain_id) };
      else if (req.command === 'admin_add_aliases') return { command: req.command, data: await this.data.adminAddAlias(req.domain_id, req.alias, req.mail) };
      else if (req.command === 'admin_set_aliases') return { command: req.command, data: await this.data.adminSetAlias(req.id, req.alias, req.mail) };
      else if (req.command === 'admin_del_aliases') return { command: req.command, data: await this.data.adminDelAlias(req.id) };
      else return { error: 'command_unknown', message: 'Command is unknown' }
 }
 async processUserCommand(req, res) {
  if (req.command === 'user_login') {
   if (req.user && req.pass) return await this.data.userGetLogin(req.user, req.pass);
   else return { command: req.command, logged: false, message: 'Missing user or password parameter' }
  } else if (req.command === 'user_logout') {
   if (await this.data.userGetTokenExists(req.token)) return { command: req.command, logged: false, message: 'Logged out' }
   else {
    if (await this.data.userIsTokenValid(req.user_token)) {
     // TODO: check if token is accessed from the same device
     // TODO: token expiration?
     if (req.command === 'user_get_contacts') return await this.data.userGetContacts();
     else if (req.command === 'user_add_contact') return await this.data.userAddContact(req.user_info);
     else if (req.command === 'user_set_contact') return await this.data.userSetContact(req.user_info);
     else if (req.command === 'user_del_contact') return await this.data.userDelContact(req.address);
     else if (req.command === 'user_del_contact') return await this.data.userDelContact(req.address);
     return { error: 'command_unknown', message: 'Command is unknown' } 
    } else return { error: 'user_token_invalid', message: 'Command is unknown' }
   }
  }
 }
}

module.exports = Protocol;
