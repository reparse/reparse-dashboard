/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import { abortableGet, put, post, del } from 'lib/AJAX';
import { unescape }                     from 'lib/StringEscaping';
import AdminApp                         from 'dashboard/AdminApp';

let currentUser = null;
;let xhrMap = {};

let AccountManager = {
  init() {
    currentUser = Promise.all([
        AdminApp.apiRequest('GET', 'users/me'),
        AdminApp.apiRequest('GET', 'account/keys')
      ])
      .then(function([ me, keys ]) {
        const user = {
          email: me.email,
          has_password: true, // TODO: change after social login support
          name: me.username,
          account_keys: keys
        };
        console.log(user);
        return user;
      });
  },

  currentUser() {
    if (!currentUser) {
      AccountManager.init();
    }
    return currentUser || {};
  },

  resetPasswordAndEmailAndName(currentPassword, newPassword, newEmail, newName) {
    let path = '/account';
    return put(path, {
      confirm_password: currentPassword,
      'user[password]':newPassword,
      'user[email]': newEmail,
      'user[name]': newName,
    });
  },

  createAccountKey(keyName) {
    let path = '/account/keys';
    let promise = post(path, {name: keyName});
    promise.then(newKey => {
      let hiddenKey = {...newKey, token: '\u2022\u2022' + newKey.token.substr(newKey.token.length - 4)};
      //TODO: save the account key better. This currently only works because everywhere that uses
      // the account keys happens to rerender after the account keys change anyway.
      currentUser.account_keys.unshift(hiddenKey);
    });
    return promise;
  },

  deleteAccountKeyById(id) {
    let path = '/account/keys/' + id.toString();
    let promise = del(path);
    promise.then(() => {

      //TODO: delete the account key better. This currently only works because everywhere that uses
      // the account keys happens to rerender after the account keys change anyway.
      currentUser.account_keys = currentUser.account_keys.filter(key => key.id != id);
    });
    return promise;
  },

  fetchLinkedAccounts(xhrKey) {
    let path = '/account/linked_accounts';
    let {xhr, promise} = abortableGet(path);
    xhrMap[xhrKey] = xhr;
    promise.then((result) => {
      this.linkedAccounts = result;
    });
    return promise;
  },

  abortFetch(xhrKey) {
    if (xhrMap[xhrKey]) {
      xhrMap[xhrKey].abort();
    }
  },
};

module.exports = AccountManager;
