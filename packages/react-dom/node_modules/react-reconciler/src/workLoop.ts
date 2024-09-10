import { scheduleMicroTask } from 'hostConfig';
import { beginWork } from './beginWork';
import { commitHookEffectListCreate, commitHookEffectListDestroy, commitHookEffectListUnmount, commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, PendingPassiveEffects, createWorkInProgress } from './fiber';
import { MutationMask, NoFlags, PassiveMask } from './fiberFlags';
import {
	getHighestPriorityLane,
	Lane,
	markRootFinished,
	mergeLanes,
	NoLane,
	SyncLane
} from './fiberLanes';
import { flushSyncCallbacks, scheduleSyncCallback } from './syncTaskQueue';
import { HostRoot } from './workTags';
import {
	unstable_scheduleCallback as scheduleCallback,
	unstable_NormalPriority as NormalPriority
} from 'scheduler';
import { HookHasEffect, Passive } from './hookEffectTags';

//当前正在工作的FiberNode
let workInprogress: FiberNode | null;
//当前在工作的优先级lane
let wipRootRenderLane: Lane = NoLane;

//初始化 Fiber 渲染,根
function prepareFreshStack(root: FiberRootNode, lane: Lane) {
	workInprogress = createWorkInProgress(root.current, {});
	wipRootRenderLane = lane;
}

//启动同步渲染过程
//renderRoot
function performSyncWorkOnRoot(root: FiberRootNode, lane: Lane) {
	const nextLane = getHighestPriorityLane(root.pendingLanes);

	if (nextLane !== SyncLane) {
		// 其他比SyncLane低的优先级
		// NoLane
		ensureRootIsScheduled(root);
		return;
	}
	if (__DEV__) {
		console.warn('render阶段开始');
	}
	// 初始化
	prepareFreshStack(root, lane);
	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workLoop error', e);
				workInprogress = null;
			}
		}
	} while (true);

	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;
	root.finishedLane = lane;
	wipRootRenderLane = NoLane;
	commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork; //指针指向完成树的开始

	if (finishedWork === null) {
		return;
	}
	if (__DEV__) {
		console.warn('commit阶段开始', finishedWork);
	}
	const lane = root.finishedLane;
	if (lane === NoLane && __DEV__) {
		console.error('commit阶段finishedLane不应该是NoLane');
	}
	// 重置
	root.finishedWork = null;
	root.finishedLane = NoLane;

	//移除lane
	markRootFinished(root, lane);

	//effect
	let rootDoesHasPassiveEffects: Boolean = false;
	if(
		(finishedWork.flags&PassiveMask)!==NoFlags||
		(finishedWork.subtreeFlags & PassiveMask) !== NoFlags
	){
        if(!rootDoesHasPassiveEffects){
			rootDoesHasPassiveEffects = true;
			// 调度副作用
			scheduleCallback(NormalPriority, () => {
				// 执行副作用
				flushPassiveEffects(root.pendingPassiveEffects);
				return;
			});

		}
	}

	const subtreeHasEffect =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

	if (subtreeHasEffect || rootHasEffect) {
		commitMutationEffects(finishedWork,root);
		root.current = finishedWork; //两棵树的交换
	} else {
		root.current = finishedWork;
	}
}

//循环处理所有待完成的 Fiber 节点,递归
function workLoop() {
	while (workInprogress != null) {
		performUnitOfWork(workInprogress);
	}
}

///向下遍历
function performUnitOfWork(fiber: FiberNode) {
	const next = beginWork(fiber, wipRootRenderLane);
	fiber.memoizedProps = fiber.pendingProps;
	if (next === null) {
		completeUnitOfWork(fiber);
	} else {
		workInprogress = next;
	}
}

//向上遍历
function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);

		const sibling = node.sibling;

		if (sibling !== null) {
			workInprogress = sibling;
			return;
		}
		node = node.return;
		workInprogress = node;
	} while (node !== null);
}

export function scheduleUpdateOnFiber(fiber: FiberNode, lane: Lane) {
	const root = markUpdateFromFiberToRoot(fiber);
	markRootUpdated(root, lane);
	ensureRootIsScheduled(root);
	//renderRoot(root);
}

//在根节点记录lane
function markRootUpdated(root: FiberRootNode, lane: Lane) {
	root.pendingLanes = mergeLanes(root.pendingLanes, lane);
}

// schedule阶段入口
function ensureRootIsScheduled(root: FiberRootNode) {
	//去优先级最高的lane
	const updateLane = getHighestPriorityLane(root.pendingLanes);
	if (updateLane === NoLane) {
		return;
	}
	if (updateLane === SyncLane) {
		// 同步优先级 用微任务调度
		if (__DEV__) {
			console.log('在微任务中调度，优先级：', updateLane);
		}
		scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root, updateLane));
		scheduleMicroTask(flushSyncCallbacks);
	}
}

//向上遍历到根节点
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

function flushPassiveEffects(pendingPassiveEffects: PendingPassiveEffects){
	pendingPassiveEffects.unmount.forEach((effect)=>{
		commitHookEffectListUnmount(Passive, effect);
	})
	pendingPassiveEffects.unmount = [];

	pendingPassiveEffects.update.forEach((effect) => {
		commitHookEffectListDestroy(Passive | HookHasEffect, effect);
	});
	pendingPassiveEffects.update.forEach((effect) => {
		commitHookEffectListCreate(Passive | HookHasEffect, effect);
	});
	pendingPassiveEffects.update = [];
	flushSyncCallbacks();
}
