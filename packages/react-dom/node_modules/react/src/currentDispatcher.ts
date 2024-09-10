import { Action } from 'shared/ReactTypes';

export type Dispatch<State> = (action: Action<State>) => void;

//Dispatcher为当前使用hooks的集合
export interface Dispatcher {
	useState: <T>(initalState: () => T | T) => [T, Dispatch<T>];
	useEffect:(callback:()=>void|void,deps:any[]|void)=>void
}

const currentDispatcher: { current: null | Dispatcher } = {
	current: null
};

export const resolveDispatcher = (): Dispatcher => {
	const dispatcher = currentDispatcher.current;

	if (dispatcher === null) {
		throw new Error('hook只能在函数式组件中执行');
	}

	return dispatcher;
};

export default currentDispatcher;
