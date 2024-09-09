import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { HostRoot } from './workTags';

//当前正在工作的FiberNode
let workInprogress: FiberNode | null;

//初始化 Fiber 渲染,根
function prepareFreshStack(root: FiberRootNode) {
	workInprogress = createWorkInProgress(root.current, {});
}

//启动渲染过程
function renderRoot(root: FiberRootNode) {
	prepareFreshStack(root);
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
	// 重置
	root.finishedWork = null;
	const subtreeHasEffect =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

	if (subtreeHasEffect || rootHasEffect) {
		commitMutationEffects(finishedWork);
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
	const next = beginWork(fiber);
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

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
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
