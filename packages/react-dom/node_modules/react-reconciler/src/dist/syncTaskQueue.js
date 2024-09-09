"use strict";
exports.__esModule = true;
exports.flushSyncCallbacks = exports.scheduleSyncCallback = void 0;
var syncQueue = null;
var isFlushingSyncQueue = false;
//调度同步回调函数进行更新
function scheduleSyncCallback(callback) {
    if (syncQueue === null) {
        syncQueue = [callback];
    }
    else {
        syncQueue.push(callback);
    }
}
exports.scheduleSyncCallback = scheduleSyncCallback;
function flushSyncCallbacks() {
    if (!isFlushingSyncQueue && syncQueue) {
        isFlushingSyncQueue = true;
        try {
            syncQueue.forEach(function (callback) { return callback(); });
        }
        catch (e) {
            if (__DEV__) {
                console.error('flushSyncCallbacks报错', e);
            }
        }
        finally {
            isFlushingSyncQueue = false;
            syncQueue = null;
        }
    }
}
exports.flushSyncCallbacks = flushSyncCallbacks;
