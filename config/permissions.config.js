'use strict';

module.exports = {
  Answer: {
    user: ['create'],
    admin: ['find', 'create', 'destroy', 'update', 'list'],
  },
  Chapter: {
    user: ['find','list'],
    admin: ['find', 'create', 'destroy', 'update', 'list'],
  },
  Participation: {
    user: ['find','list'],
    admin: ['find', 'create', 'destroy', 'update', 'list'],
  },
  Profile: {
    user: ['find'],
    admin: ['find', 'create', 'destroy', 'update', 'list'],
  },
  Statement: {
    user: ['find','list'],
    admin: ['find', 'create', 'destroy', 'update', 'list'],
  },
  Weight: {
    user: [],
    admin: ['find', 'create', 'destroy', 'update', 'list'],
  }
}