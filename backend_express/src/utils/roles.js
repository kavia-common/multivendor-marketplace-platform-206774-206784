'use strict';

const ROLES = Object.freeze({
  ADMIN: 'admin',
  VENDOR: 'vendor',
  CUSTOMER: 'customer',
});

// PUBLIC_INTERFACE
function isValidRole(role) {
  /** Returns true if the provided role is a supported role string. */
  return Object.values(ROLES).includes(role);
}

module.exports = {
  ROLES,
  isValidRole,
};
