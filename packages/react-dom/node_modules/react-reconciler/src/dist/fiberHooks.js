"use strict";
// // import internals from "shared/internals";
// // import { FiberNode } from "./fiber";
// // import { Dispatch, Dispatcher } from "react/src/currentDispather";
// // import { processUpdateQueue } from "./updateQueue";
exports.__esModule = true;
exports.renderWithHooks = void 0;
var internals_1 = require("shared/internals");
var updateQueue_1 = require("./updateQueue");
var workLoop_1 = require("./workLoop");
var fiberLanes_1 = require("./fiberLanes");
var currentlyRenderingFiber = null;
var workInProgressHook = null;
var currentHook = null;
var renderLane = fiberLanes_1.NoLane;
var currentDispatcher = internals_1["default"].currentDispatcher;
function renderWithHooks(wip, lane) {
    // 赋值操作
    currentlyRenderingFiber = wip;
    // 重置 hooks链表
    wip.memoizedState = null;
    renderLane = lane;
    var current = wip.alternate;
    if (current !== null) {
        // update
        currentDispatcher.current = HooksDispatcherOnUpdate;
    }
    else {
        // mount
        currentDispatcher.current = HooksDispatcherOnMount;
    }
    var Component = wip.type;
    var props = wip.pendingProps;
    // FC render
    var children = Component(props);
    // 重置操作
    currentlyRenderingFiber = null;
    workInProgressHook = null;
    currentHook = null;
    renderLane = fiberLanes_1.NoLane;
    return children;
}
exports.renderWithHooks = renderWithHooks;
var HooksDispatcherOnMount = {
    useState: mountState
};
var HooksDispatcherOnUpdate = {
    useState: updateState
};
function updateState() {
    // 找到当前useState对应的hook数据
    var hook = updateWorkInProgresHook();
    // 计算新state的逻辑
    var queue = hook.updateQueue;
    var pending = queue.shared.pending;
    queue.shared.pending = null;
    if (pending !== null) {
        var memoizedState = updateQueue_1.processUpdateQueue(hook.memoizedState, pending, renderLane).memoizedState;
        hook.memoizedState = memoizedState;
    }
    return [hook.memoizedState, queue.dispatch];
}
function updateWorkInProgresHook() {
    // TODO render阶段触发的更新
    var nextCurrentHook;
    if (currentHook === null) {
        // 这是这个FC update时的第一个hook
        var current = currentlyRenderingFiber === null || currentlyRenderingFiber === void 0 ? void 0 : currentlyRenderingFiber.alternate;
        if (current !== null) {
            nextCurrentHook = current === null || current === void 0 ? void 0 : current.memoizedState;
        }
        else {
            // mount
            nextCurrentHook = null;
        }
    }
    else {
        // 这个FC update时 后续的hook
        nextCurrentHook = currentHook.next;
    }
    if (nextCurrentHook === null) {
        // mount/update u1 u2 u3
        // update       u1 u2 u3 u4
        throw new Error("\u7EC4\u4EF6" + (currentlyRenderingFiber === null || currentlyRenderingFiber === void 0 ? void 0 : currentlyRenderingFiber.type) + "\u672C\u6B21\u6267\u884C\u65F6\u7684Hook\u6BD4\u4E0A\u6B21\u6267\u884C\u65F6\u591A");
    }
    currentHook = nextCurrentHook;
    var newHook = {
        memoizedState: currentHook.memoizedState,
        updateQueue: currentHook.updateQueue,
        next: null
    };
    if (workInProgressHook === null) {
        // mount时 第一个hook
        if (currentlyRenderingFiber === null) {
            throw new Error('请在函数组件内调用hook');
        }
        else {
            workInProgressHook = newHook;
            currentlyRenderingFiber.memoizedState = workInProgressHook;
        }
    }
    else {
        // mount时 后续的hook
        workInProgressHook.next = newHook;
        workInProgressHook = newHook;
    }
    return workInProgressHook;
}
function mountState(initialState) {
    // 找到当前useState对应的hook数据
    var hook = mountWorkInProgresHook();
    var memoizedState;
    if (initialState instanceof Function) {
        memoizedState = initialState();
    }
    else {
        memoizedState = initialState;
    }
    var queue = updateQueue_1.createUpdateQueue();
    hook.updateQueue = queue;
    hook.memoizedState = memoizedState;
    // @ts-ignore
    var dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
    queue.dispatch = dispatch;
    return [memoizedState, dispatch];
}
function dispatchSetState(fiber, updateQueue, action) {
    var lane = fiberLanes_1.requestUpdateLane();
    var update = updateQueue_1.createUpdate(action, lane);
    updateQueue_1.enqueueUpdate(updateQueue, update);
    workLoop_1.scheduleUpdateOnFiber(fiber, lane);
}
function mountWorkInProgresHook() {
    var hook = {
        memoizedState: null,
        updateQueue: null,
        next: null
    };
    if (workInProgressHook === null) {
        // mount时 第一个hook
        if (currentlyRenderingFiber === null) {
            throw new Error('请在函数组件内调用hook');
        }
        else {
            workInProgressHook = hook;
            currentlyRenderingFiber.memoizedState = workInProgressHook;
        }
    }
    else {
        // mount时 后续的hook
        workInProgressHook.next = hook;
        workInProgressHook = hook;
    }
    return workInProgressHook;
}
