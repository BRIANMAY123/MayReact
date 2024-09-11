"use strict";
exports.__esModule = true;
exports.schedulerPriorityToLane = exports.lanesToSchedulerPriority = exports.isSubsetOfLanes = exports.markRootFinished = exports.getHighestPriorityLane = exports.requestUpdateLane = exports.mergeLanes = exports.IdleLane = exports.TransitionLane = exports.DefaultLane = exports.InputContinuousLane = exports.NoLanes = exports.NoLane = exports.SyncLane = void 0;
var scheduler_1 = require("scheduler");
var currentBatchConfig_1 = require("react/src/currentBatchConfig");
exports.SyncLane = 1;
exports.NoLane = 0;
exports.NoLanes = 0;
exports.InputContinuousLane = 2;
exports.DefaultLane = 4;
exports.TransitionLane = 8;
exports.IdleLane = 16;
//lane集合
function mergeLanes(laneA, laneB) {
    return laneA | laneB;
}
exports.mergeLanes = mergeLanes;
function requestUpdateLane() {
    var isTransition = currentBatchConfig_1["default"].transition !== null;
    if (isTransition) {
        return exports.TransitionLane;
    }
    // 从上下文环境中获取Scheduler优先级
    var currentSchedulerPriority = scheduler_1.unstable_getCurrentPriorityLevel();
    var lane = schedulerPriorityToLane(currentSchedulerPriority);
    return lane;
}
exports.requestUpdateLane = requestUpdateLane;
//LANE的数字越小等级越高，这个函数是取最右边的数字，代表现在存的最高的优先级
function getHighestPriorityLane(lanes) {
    return lanes & -lanes;
}
exports.getHighestPriorityLane = getHighestPriorityLane;
function markRootFinished(root, lane) {
    root.pendingLanes &= ~lane;
}
exports.markRootFinished = markRootFinished;
//在 React 的调度系统中，这种操作用来判断某些“计划中的任务”是否在当前的“任务集合”中
function isSubsetOfLanes(set, subset) {
    return (set & subset) === subset;
}
exports.isSubsetOfLanes = isSubsetOfLanes;
//lane的flag转为scheduler的flag
function lanesToSchedulerPriority(lanes) {
    var lane = getHighestPriorityLane(lanes);
    if (lane === exports.SyncLane) {
        return scheduler_1.unstable_ImmediatePriority;
    }
    if (lane === exports.InputContinuousLane) {
        return scheduler_1.unstable_UserBlockingPriority;
    }
    if (lane === exports.DefaultLane) {
        return scheduler_1.unstable_NormalPriority;
    }
    return scheduler_1.unstable_IdlePriority;
}
exports.lanesToSchedulerPriority = lanesToSchedulerPriority;
//scheduler的flag转为lane的flag
function schedulerPriorityToLane(schedulerPriority) {
    if (schedulerPriority === scheduler_1.unstable_ImmediatePriority) {
        return exports.SyncLane;
    }
    if (schedulerPriority === scheduler_1.unstable_UserBlockingPriority) {
        return exports.InputContinuousLane;
    }
    if (schedulerPriority === scheduler_1.unstable_NormalPriority) {
        return exports.DefaultLane;
    }
    return exports.NoLane;
}
exports.schedulerPriorityToLane = schedulerPriorityToLane;
