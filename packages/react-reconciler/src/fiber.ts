import { Key, Props, ReactElementType, Ref } from 'shared/ReactTypes';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	//组件的类型。对于函数组件，它是一个函数；对于类组件，它是一个类；
	//对于 DOM 元素，它是一个字符串（如 'div' 或 'span'）
	type: any;

	// 表示 Fiber 节点的类型标记。它指示 Fiber 是表示什么类型的组件
	//（例如，FunctionComponent、ClassComponent、HostComponent 等）
	tag: WorkTag;

	//该 Fiber 节点即将接收到的 props。这些是还没有应用到 DOM 或组件实例上的 props
	pendingProps: Props;

	// Fiber 节点在其兄弟节点中的唯一标识符
	key: Key;
	//对应于真实的 DOM 节点（对于 HostComponent 类型的 Fiber），或者组件实例（对于类组件类型的 Fiber）
	stateNode: any;

	//fiber父节点
	return: FiberNode | null;
	//兄弟
	sibling: FiberNode | null;
	//孩子
	child: FiberNode | null;
	//对应于该 Fiber 节点的 ref。用于访问组件或 DOM 节点的引用
	ref: Ref | null;
	// 在当前 Fiber 的子节点中的索引位置。用于跟踪当前节点在兄弟节点中的位置
	index: number;

	//上一次渲染中已经应用的 props。用于比较当前 props 是否发生变化，从而决定是否需要重新渲染
	memoizedProps: Props | null;
	//上一次渲染中已经应用的状态。用于比较当前状态是否发生变化
	memoizedState: any;
	//切换两棵树
	alternate: FiberNode | null;

	//这个 Fiber 节点的标志位，用于表示 Fiber 节点的状态和需要执行的操作。例如，它可以表示是否需要更新、插入或删除节点。
	flags: Flags;

	//子冒泡上来的flags，用于性能优化看是否需要更新
	subtreeFlags: Flags;

	//与 Fiber 节点相关的更新队列。用于存储需要应用到 Fiber 的更新，例如 state 更新。这通常是一个待处理的更新集合。
	updateQueue: unknown;

	deletions:FiberNode[] | null;
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		//实例属性
		this.tag = tag;
		this.key = key || null;
		//其对应的DOM
		this.stateNode = null;
		//FiberNode类型
		this.type = null;

		//父级FiberNode
		this.return = null;
		//右边的兄弟FiberNode
		this.sibling = null;
		//子FiberNode
		this.child = null;
		//当前同级的位置索引
		this.index = 0;

		this.ref = null;

		//工作单元
		this.pendingProps = pendingProps; //begin
		this.memoizedProps = null; //end
		this.updateQueue = null;

		this.alternate = null;
		//副作用
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;
		this.deletions = null;
	}
}

//表示一个 Fiber 树的根节点
export class FiberRootNode {
	//表示实际的 DOM 容器，如一个 HTML 元素，React 将组件渲染到这个容器中
	container: Container;
	//hostRootFiber 是根 Fiber 节点，它将被设置为 current 属性
	current: FiberNode;
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

//创建workInProgress
export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;
	if (wip === null) {
		//mount
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;

		
		wip.alternate = current;
		current.alternate = wip;
	} else {
		//update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
		wip.subtreeFlags = NoFlags;
		wip.deletions = null;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedState = current.memoizedState;
	wip.memoizedProps = current.memoizedProps;
	wip.ref = current.ref;

	return wip;
};

export function createFiberFromElement(element: ReactElementType): FiberNode {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;
	if (typeof type === 'string') {
		// <div/> type: 'div'
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('为定义的type类型', element);
	}
	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
