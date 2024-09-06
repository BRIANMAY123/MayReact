import { Dispatch } from 'react/src/currentDispatcher';
import { Action } from '../../shared/ReactTypes';
export interface Update<State> {
	action: Action<State>;
	next: null | Update<any>;
}
export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
	dispatch: Dispatch<State> | null;
}

//创建单个跟新
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action,
		next: null
	};
};

//创建更新池子
export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		},
		dispatch: null
	} as UpdateQueue<State>;
};

//将更新插入
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	const pedding = updateQueue.shared.pending;
	//当有新更新插入时，它会被插入到队列的末尾。由于队列是环状的，新更新的 next 指向队列的第一个更新，而队列中最后一个更新的 next 更新为新插入的更新，形成一个闭环。这样，队列的循环结构得以维持。
	if (pedding === null) {
		update.next = update;
	} else {
		update.next = pedding.next;
		pedding.next = update;
	}
	updateQueue.shared.pending = update;
};

///尚未完成，写了个大概，消费update的
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			result.memoizedState = action(baseState);
		} else {
			result.memoizedState = action;
		}
	}
	return result;
};
