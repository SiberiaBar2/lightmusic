import React, { useCallback, useReducer } from "react";
import { LoopOnce, PlayCycle, PlayOnce, ShuffleOne } from "@icon-park/react";

export enum PlayType {
  dan = 1,
  shun,
  liexun,
  sui,
}

type StateActionType = { type: PlayType };

type ReducerType = (
  state: StateActionType,
  action: StateActionType
) => {
  type: PlayType;
};

const reducer = (_: StateActionType, action: StateActionType) => {
  switch (action.type) {
    case PlayType.dan:
      return { type: PlayType.shun };
    case PlayType.shun:
      return { type: PlayType.liexun };
    case PlayType.liexun:
      return { type: PlayType.sui };
    case PlayType.sui:
      return { type: PlayType.dan };
    default:
      return { type: PlayType.liexun };
  }
};

export const PlayTypeIcon = () => {
  // 持久化存储播放类型
  const [type, dispatch] = useReducer<ReducerType>(reducer, {
    type: Number(localStorage.getItem("playtype")) || PlayType.liexun,
  });

  // 函数 提入组件内部与 useReducer的 reducer 区分开来，
  // 避免 reducer 纯函数受到副作用污染
  const storge = useCallback((type: number) => {
    localStorage.setItem("playtype", String(type));
  }, []);

  const saveStorge = useCallback((type: number) => {
    switch (type) {
      case PlayType.dan:
        return storge(PlayType.shun);
      case PlayType.shun:
        return storge(PlayType.liexun);
      case PlayType.liexun:
        return storge(PlayType.sui);
      case PlayType.sui:
        return storge(PlayType.dan);
      default:
        return storge(PlayType.liexun);
    }
  }, []);
  const handeChangeType = useCallback((type: number) => {
    dispatch({ type });
    saveStorge(type);
  }, []);

  const getElement = (type: number) => {
    switch (type) {
      case PlayType.dan:
        return (
          <PlayOnce
            title="单曲播放"
            onClick={() => handeChangeType(PlayType.dan)}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
          />
        );
      case PlayType.shun:
        return (
          <LoopOnce
            title="顺序播放"
            onClick={() => handeChangeType(PlayType.shun)}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
          />
        );
      case PlayType.liexun:
        return (
          <PlayCycle
            title="列表循环"
            onClick={() => handeChangeType(PlayType.liexun)}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
          />
        );
      case PlayType.sui:
        return (
          <ShuffleOne
            title="随机播放"
            onClick={() => handeChangeType(PlayType.sui)}
            theme="outline"
            size="24"
            fill="rgb(251, 236, 222)"
          />
        );

      default:
        break;
    }
  };
  return <div>{getElement(type.type)}</div>;
};
