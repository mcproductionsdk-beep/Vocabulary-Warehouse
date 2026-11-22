import {attachWarehouseSession} from './session.mjs';
const buildId = '13f93094489f79639f7f6affb95f089933d4c57d';

let shellOrigin;
try { shellOrigin = new URL(document.referrer).origin; } catch {}
if (parent !== window && (
    /^https:\/\/(?:[a-z0-9-]+\.)?bt-vocabulary-platform-staging\.pages\.dev$/.test(shellOrigin))) {
  attachWarehouseSession({engine:window.BTWarehouse, policy:{shellOrigin,engineOrigin:location.origin,buildId}});
}
