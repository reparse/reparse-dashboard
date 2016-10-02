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
    return AdminApp.apiRequest('GET', '/users/me')
      .then(function(me) {
        return Promise.all([
          AdminApp.apiRequest(
            'PUT',
            '/users/' + me.objectId,
            {
              email: newEmail,
              username: newName,
            }),
          AdminApp.apiRequest(
            'POST',
            '/users/changePassword',
            {
              password: newPassword,
              oldPassword: currentPassword })
        ]);
      });
  },

  createAccountKey(keyName) {
    return AdminApp.apiRequest(
      'POST',
      '/account/keys',
      {
        name: keyName
      })
      .then(function(newKey) {
        //TODO: save the account key better. This currently only works because everywhere that uses
        // the account keys happens to rerender after the account keys change anyway.
        currentUser = null; // The data in promise is old
	return newKey;
      });
  },

  deleteAccountKeyById(id) {
    return AdminApp.apiRequest('DELETE', '/account/keys/' + id)
      .then(() => {
        //TODO: delete the account key better. This currently only works because everywhere that uses
        // the account keys happens to rerender after the account keys change anyway.
        currentUser = null; // The data in promise is old
      });
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
