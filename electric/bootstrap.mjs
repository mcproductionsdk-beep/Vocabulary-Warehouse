import {attachWarehouseSession} from './session.mjs';
const buildId = '629374a28333dbe4c09c623f1252edf4cb44b6c0';

let shellOrigin;
try { shellOrigin = new URL(document.referrer).origin; } catch {}
if (parent !== window && (
    /^https:\/\/(?:[a-z0-9-]+\.)?bt-vocabulary-platform-staging\.pages\.dev$/.test(shellOrigin))) {
  attachWarehouseSession({engine:window.BTWarehouse, policy:{shellOrigin,engineOrigin:location.origin,buildId}});
}
