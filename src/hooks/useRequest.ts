import { useCallback, useEffect, useRef, useState } from "react";
import { message } from "antd";
import _ from "lodash";

import { useBoolean, useFuncDebounce, useThrottle } from ".";
import { cleanObject } from "utils/utils";

/**
 * https://ahooks.js.org/zh-CN/hooks/use-request/index
 *
 * loop?: number 轮询间隔;
 *
 * debounceWait?: number 防抖时间 若 也设置了节流择只触发防抖;
 *
 * throttleWait?: number 节流时间;
 *
 * cacheKey?: string 缓存key;
 *
 * ready?: boolean 为false请求永远不会发出;
 *
 * loadingDelay?: number 延迟请求时间;
 *
 * refreshOnWindowFocus?: boolean 屏幕聚焦时重新请求;
 *
 * refreshDeps?: unknown[] 依赖项变化时重新请求;
 *
 * retryNum?: number 错误重试次数;
 *
 * manual?: boolean 手动触发请求;
 *
 * responsePath?: string 返回数据路径;
 *
 */

interface OptionsConfig {
  loop?: number;
  debounceWait?: number;
  throttleWait?: number;
  cacheKey?: string;
  ready?: boolean;
  loadingDelay?: number;
  refreshOnWindowFocus?: boolean;
  refreshDeps?: unknown[];
  retryNum?: number;
  manual?: boolean;
  responsePath?: string;
}

interface EndConfig {
  success?: (res: any) => void;
  error?: (error: Error) => void;
}

const RESPONSRCODE = 200;
const CODEPATH = "code";
const FAILEDMESSAGE = "获取数据失败";

const ENDCONFIG = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  success: (res: unknown) => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  error: (error: Error) => {},
};

export const useRequest = <T = any>(
  syncFunc: (config?: any) => Promise<unknown>,
  options: OptionsConfig = {},
  end: EndConfig = ENDCONFIG
) => {
  const {
    loop = 0,
    ready = true,
    retryNum = 0,
    cacheKey = "",
    manual = false,
    refreshDeps = [],
    debounceWait = 0,
    throttleWait = 0,
    loadingDelay = 0,
    responsePath = "",
    refreshOnWindowFocus = false,
  } = options;
  const throttleCallback = useThrottle();
  const debouncedCallback = useFuncDebounce();
  const [loading, { on: loadingOn, off: loadingOff }] = useBoolean();

  //   const data = useRef<T>({} as T);
  const [data, setData] = useState();
  const retryNumRef = useRef<number>(0);
  const requestConfig = useRef<unknown>();

  /**
   * refreshDeps
   */
  //   refreshDeps.forEach((ele) => {
  //     watch(
  //       () => ele,
  //       () => {
  //         console.warn("useRequest refreshDeps element is change!", ele);
  //         getSyncDataWrap(requestConfig.current);
  //       },
  //       {
  //         deep: true,
  //       }
  //     );
  //   });

  useEffect(() => {
    // console.warn("useRequest refreshDeps element is change!", ele);
    // getSyncDataWrap(requestConfig.current);
    if (!_.isEmpty(refreshDeps)) {
      debouncedCallback(getSyncDataWrap, 1000)(requestConfig.current);
    }
  }, [...refreshDeps]);

  /**
   *
   * request func
   */
  const retry = useCallback(
    (config?: any) => {
      if (retryNum) {
        if (retryNumRef.current < retryNum) {
          retryNumRef.current += 1;
          getSyncData(config);
        }
      }
    },
    [retryNumRef.current, retryNum]
  );

  const run = (config?: unknown) => {
    getSyncDataWrap(config);
  };

  const saveData = useCallback(
    (res: any) => {
      if (responsePath) {
        setData(_.get(res, responsePath, {}) || {});
        //   data.current = _.get(res, responsePath, {}) || {};
      } else {
        setData(res);
        //   data.current = res;
      }
    },
    [responsePath]
  );

  const getParams = useCallback((config?: unknown) => {
    if (Object.prototype.toString.call(config) === "[object Object]") {
      return !_.isEmpty(cleanObject(config as { [key: string]: unknown }))
        ? cleanObject(config as { [key: string]: unknown })
        : undefined;
    }
    return config;
  }, []);

  const getSyncData = useCallback(
    (config?: unknown) => {
      console.warn("useRequest getSyncData config", config);
      try {
        loadingOn();
        if (ready) {
          if (cacheKey) {
            const locationCacheData = JSON.parse(
              localStorage.getItem(cacheKey) || "{}"
            );
            if (!_.isEmpty(locationCacheData)) {
              // data.current = locationCacheData;

              saveData(locationCacheData);
              end.success && end.success(locationCacheData);
              loadingOff();
            }
          } else {
            const params = getParams(config);
            if (!_.isEmpty(config)) {
              requestConfig.current = config;
            }

            syncFunc(params)
              .then((res) => {
                console.log("res", res);

                if (_.get(res, CODEPATH) === RESPONSRCODE) {
                  saveData(res);
                  end.success && end.success(res);
                  cacheKey &&
                    localStorage.setItem(cacheKey, JSON.stringify(res));
                  loadingOff();
                } else {
                  message.error(FAILEDMESSAGE);
                  loadingOff();
                  Promise.reject(new Error(FAILEDMESSAGE));
                }
              })
              .catch((error) => {
                loadingOff();
                end.error && end.error(error);
                console.log("useRequest error catch!", error);

                // retry(config);
                if (retryNum) {
                  if (retryNumRef.current < retryNum) {
                    retryNumRef.current += 1;
                    getSyncData(config);
                  }
                }
              });
          }
        }
      } catch (error) {
        console.log(error);
        loadingOff();
      }
    },
    [
      ready,
      cacheKey,
      syncFunc,
      getParams,
      saveData,
      end,
      retryNum,
      retryNumRef.current,
    ]
  );

  const getSyncDataWrap = useCallback(
    (config?: unknown) => {
      if (debounceWait) {
        console.log("11111");

        return debouncedCallback(getSyncData, debounceWait)(config);
      }
      if (throttleWait) {
        console.log("22222");
        return throttleCallback(getSyncData, throttleWait)(config);
      }
      console.log(333333, "config", config);

      return getSyncData(config);
    },
    [debounceWait, getSyncData]
  );

  /**
   * is loadingDelay
   */
  const loadingDelatyTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  //   onMounted(() => {
  //     if (manual) {
  //       return;
  //     }
  //     if (loadingDelay) {
  //       loadingDelatyTimer.current = setTimeout(() => {
  //         getSyncDataWrap(requestConfig.current);
  //       }, loadingDelay);
  //       return;
  //     }
  //     getSyncDataWrap(requestConfig.current);
  //   });
  //   onUnmounted(() => {
  //     if (loadingDelatyTimer.current) {
  //       clearTimeout(loadingDelatyTimer.current);
  //     }
  //   });

  useEffect(() => {
    // console.log("manual", manual);

    if (manual) {
      return;
    }
    if (loadingDelay) {
      console.log("loadingDelay");

      loadingDelatyTimer.current = setTimeout(() => {
        getSyncDataWrap(requestConfig.current);
      }, loadingDelay);
      return;
    }

    // console.log("dasdasdasdsas");

    getSyncDataWrap(requestConfig.current);

    return () => {
      if (loadingDelatyTimer.current) {
        clearTimeout(loadingDelatyTimer.current);
      }
    };
  }, []);

  /**
   * loop
   */
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);
  const loopFunc = useCallback(() => {
    console.warn("useRequest loop is start!", loop);
    timer.current = setTimeout(() => {
      loopFunc();
      getSyncDataWrap(requestConfig.current);
    }, loop);
  }, [timer.current, getSyncDataWrap, requestConfig.current]);
  //   watchEffect(() => {
  //     if (loop) {
  //       loopFunc();
  //     }
  //     if (!loop && timer.current) {
  //       clearTimeout(timer.current);
  //     }
  //   });
  //   onUnmounted(() => {
  //     if (timer.current) clearTimeout(timer.current);
  //   });

  useEffect(() => {
    if (loop) {
      loopFunc();
    }
    if (!loop && timer.current) {
      clearTimeout(timer.current);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [loop, timer.current, loopFunc]);

  /**
   * refreshOnWindowFocus
   */
  const windowFocusFunc = () => {
    if (document.visibilityState === "visible" && refreshOnWindowFocus) {
      debouncedCallback(run, 5000)(requestConfig.current);
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", windowFocusFunc);
    return () => {
      document.removeEventListener("visibilitychange", windowFocusFunc);
    };
  }, []);

  return {
    data,
    loading,
    run,
  };
};
