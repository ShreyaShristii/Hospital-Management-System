const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 100);

module.exports = escapeRegex;
