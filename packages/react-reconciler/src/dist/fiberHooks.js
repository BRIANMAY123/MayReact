"use strict";
exports.__esModule = true;
exports.renderWithHooks = void 0;
var currentBatchConfig_1 = require("react/src/currentBatchConfig");
var internals_1 = require("shared/internals");
var updateQueue_1 = require("./updateQueue");
var workLoop_1 = require("./workLoop");
var fiberLanes_1 = require("./fiberLanes");
var fiberFlags_1 = require("./fiberFlags");
var hookEffectTags_1 = require("./hookEffectTags");
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
    //重置effect链表,很重要
    wip.updateQueue = null;
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
    useState: mountState,
    useEffect: mountEffect,
    useTransition: mountTransition
};
var HooksDispatcherOnUpdate = {
    useState: updateState,
    useEffect: updateEffect,
    useTransition: updateTransition
};
function updateState() {
    // 找到当前useState对应的hook数据
    var hook = updateWorkInProgresHook();
    // 计算新state的逻辑
    var queue = hook.updateQueue;
    var baseState = hook.baseState;
    var pending = queue.shared.pending;
    var current = currentHook;
    var baseQueue = current.baseQueue;
    if (pending !== null) {
        // pending baseQueue update保存在current中
        if (baseQueue !== null) {
            // baseQueue b2 -> b0 -> b1 -> b2
            // pendingQueue p2 -> p0 -> p1 -> p2
            // b0
            var baseFirst = baseQueue.next;
            // p0
            var pendingFirst = pending.next;
            // b2 -> p0
            baseQueue.next = pendingFirst;
            // p2 -> b0
            pending.next = baseFirst;
            // p2 -> b0 -> b1 -> b2 -> p0 -> p1 -> p2
        }
        baseQueue = pending;
        // 保存在current中
        current.baseQueue = pending;
        queue.shared.pending = null;
    }
    if (baseQueue !== null) {
        var _a = updateQueue_1.processUpdateQueue(baseState, baseQueue, renderLane), memoizedState = _a.memoizedState, newBaseQueue = _a.baseQueue, newBaseState = _a.baseState;
        hook.memoizedState = memoizedState;
        hook.baseState = newBaseState;
        hook.baseQueue = newBaseQueue;
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
        next: null,
        baseQueue: currentHook.baseQueue,
        baseState: currentHook.baseState
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
    hook.baseState = memoizedState;
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
        next: null,
        baseQueue: null,
        baseState: null
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
function mountEffect(create, deps) {
    var hook = mountWorkInProgresHook();
    var nextDeps = deps === undefined ? null : deps;
    currentlyRenderingFiber.flags |= fiberFlags_1.PassiveEffect;
    hook.memoizedState = pushEffect(hookEffectTags_1.Passive | hookEffectTags_1.HookHasEffect, create, undefined, nextDeps);
}
function updateEffect(create, deps) {
    var hook = updateWorkInProgresHook();
    var nextDeps = deps === undefined ? null : deps;
    var destroy;
    if (currentHook !== null) {
        var prevEffect = currentHook.memoizedState;
        destroy = prevEffect.destroy;
        if (nextDeps !== null) {
            // 浅比较依赖
            var prevDeps = prevEffect.deps;
            if (areHookInputsEqual(nextDeps, prevDeps)) {
                hook.memoizedState = pushEffect(hookEffectTags_1.Passive, create, destroy, nextDeps);
                return;
            }
        }
        currentlyRenderingFiber.flags |= fiberFlags_1.PassiveEffect;
        hook.memoizedState = pushEffect(hookEffectTags_1.Passive | hookEffectTags_1.HookHasEffect, create, destroy, nextDeps);
    }
}
function pushEffect(hookFlags, create, destroy, deps) {
    var effect = {
        tag: hookFlags,
        create: create,
        destroy: destroy,
        deps: deps,
        next: null
    };
    var fiber = currentlyRenderingFiber;
    var updateQueue = fiber.updateQueue;
    if (updateQueue === null) {
        var updateQueue_2 = createFCUpdateQueue();
        fiber.updateQueue = updateQueue_2;
        //effect自己单人成环，与updatequeue中类似
        effect.next = effect;
        updateQueue_2.lastEffect = effect;
    }
    else {
        // 插入effect
        var lastEffect = updateQueue.lastEffect;
        if (lastEffect === null) {
            effect.next = effect;
            updateQueue.lastEffect = effect;
        }
        else {
            var firstEffect = lastEffect.next;
            lastEffect.next = effect;
            effect.next = firstEffect;
            updateQueue.lastEffect = effect;
        }
    }
    return effect;
}
function createFCUpdateQueue() {
    var updateQueue = updateQueue_1.createUpdateQueue();
    updateQueue.lastEffect = null;
    return updateQueue;
}
function areHookInputsEqual(nextDeps, prevDeps) {
    if (prevDeps === null || nextDeps === null) {
        return false;
    }
    for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
        if (Object.is(prevDeps[i], nextDeps[i])) {
            continue;
        }
        return false;
    }
    return true;
}
function mountTransition() {
    var _a = mountState(false), isPending = _a[0], setPending = _a[1];
    var hook = mountWorkInProgresHook();
    var start = startTransition.bind(null, setPending);
    hook.memoizedState = start;
    return [isPending, start];
}
function updateTransition() {
    var isPending = updateState()[0];
    var hook = updateWorkInProgresHook();
    var start = hook.memoizedState;
    return [isPending, start];
}
function startTransition(setPending, callback) {
    setPending(true);
    var prevTransition = currentBatchConfig_1["default"].transition;
    currentBatchConfig_1["default"].transition = 1;
    callback();
    setPending(false);
    currentBatchConfig_1["default"].transition = prevTransition;
}
