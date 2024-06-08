import { String } from "lodash";
import {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  MutableRefObject,
  useState,
  RefObject,
} from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { cleanObject, stringAdds } from "utils/utils";

export const useMount = (callBack: () => void) => {
  useEffect(() => {
    callBack();
  }, []);
};

export const useInterVal = (callback: () => void, delaty: number | null) => {
  const savedCallback: MutableRefObject<any> = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    // 暂停
    if (delaty !== null) {
      const id = setInterval(tick, delaty);
      return () => clearInterval(id);
    }
  }, [delaty]);
};

export const useQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParam();

  return [
    // useMemo (解决新创建对象 和 usedebounce) 引发的无限循环问题
    useMemo(
      () =>
        keys.reduce((prev, key) => {
          return { ...prev, [key]: searchParams.get(key) || "" };
        }, {} as { [key in K]: string }),
      [keys, searchParams]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      return setSearchParams(params);
    },
  ] as const;
};

// 清空对应的url
export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  return (params: { [key in string]: unknown }) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParams(o);
  };
};

// 清空所有url参数
export const useClearAllSearchParam = () => {
  const [searchParams] = useSearchParams();
  const clearSearchParams = useSetUrlSearchParam();

  return useCallback(() => {
    const clearParams = Object.keys(Object.fromEntries(searchParams)).reduce(
      (prev, key) => {
        return {
          ...prev,
          [key]: "",
        };
      },
      {} as { [x: string]: unknown }
    );

    clearSearchParams(clearParams);
  }, [clearSearchParams, searchParams]);
};

export const useDocumentTitle = (title: string, keepOnUnmount = true) => {
  const oldTitle = useRef(document.title).current;

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};

export const useDebounce = <V>(value: V, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<V>(value);

  useEffect(() => {
    // 每次在value变化以后设置一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);

    // 每次在上一个的effect执行完后执行
    return () => clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
};

export const useBackTop = () => {
  useMount(() => {
    const backTopInstance = document.querySelector(
      ".ant-float-btn"
    ) as HTMLButtonElement;
    backTopInstance?.click();
  });
};

// 预加载图片
export const useReLoadImage = (
  imgRef: RefObject<HTMLImageElement> | null,
  picUrl: string,
  alt?: string,
  customFunc?: () => any
) => {
  const [isLoading, setIsLoading] = useState(false);
  const prevText = useRef("");

  const text = useMemo(() => {
    if (isLoading && customFunc?.()) {
      prevText.current = customFunc?.();
      return prevText.current;
    }
    return prevText.current;
  }, [isLoading, ...customFunc?.()]);
  useEffect(() => {
    if (imgRef?.current && picUrl) {
      const img = new Image();
      img.src = picUrl;
      img.onload = function () {
        if (imgRef?.current) {
          imgRef.current.src = stringAdds(picUrl);
          imgRef.current.alt = alt || "";
        }
        setIsLoading(true);
      };
    }

    return () => {
      setIsLoading(false);
    };
  }, [imgRef?.current, picUrl]);

  return {
    isLoading,
    text,
  } as const;
};
