/**
 *  Adblock Plus detection - we load this script exactly twice. If the user has ABP installed and the domain is whitelisted (which we are),
 *  then this will toggle Tumblr.ABP to true when ABP allows this script to load only the first time but not subsequent times.
 *  If the user does *not* have ABP, then the second load will run and toggle it back to false.
 */
(function(exports) {
    exports.ABP = !exports.ABP;
})(window.Tumblr);
