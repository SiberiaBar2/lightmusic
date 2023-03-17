import { useCallback, useMemo, memo } from "react";
import { Like as ParkLike } from "@icon-park/react";

import { useLike } from "./utils";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import { RootState } from "store";
import { likeState, changelike } from "store/ilike";
import { useIlike } from "users";
import { LoginState } from "store/login";

type SongIdType = string | number | undefined;
const cookie = localStorage.getItem("cookie");

export const Like: React.FC<{ songId: SongIdType }> = memo((props) => {
  const { songId } = props;

  const dispatch = useDispatch();

  const loginState = useSelector<RootState, Pick<LoginState, "data">>(
    (state) => state.login
  );
  const { data: { data: { profile: { userId = 0 } = {} } = {} } = {} } =
    loginState;
  const { data: { ids = [] } = {} } = useIlike(userId);

  const likeState = useSelector<RootState, Pick<likeState, "likes">>((state) =>
    _.pick(state.ilike, ["likes"])
  );

  const { likes } = likeState;

  // 只添加一次的我喜欢
  // 这里容易出问题
  // 后面可能要修改

  useMemo(() => {
    if (likes.length <= 0 && ids.length > 0) {
      dispatch(
        changelike({
          likes: ids,
        })
      );
    }
  }, [dispatch, changelike, ids, likes]);

  // console.log("likes", likes);

  // const islike = useMemo(
  //   () => likes.find((item) => item === Number(songId)),
  //   [likes, songId]
  // );

  const islike = likes.find((item) => item === Number(songId));

  console.log("islike", islike);

  const { mutate: tolike } = useLike();

  const likeMusci = useCallback(() => {
    // 不再喜欢
    if (islike && cookie) {
      // 更新接口
      setTimeout(
        () =>
          tolike({
            id: songId,
            like: false,
            cookie: cookie,
            timerstamp: Date.now(),
          }),
        1000
      );
      // 更新redux
      const like = likes.filter((item) => item !== songId);

      dispatch(
        changelike({
          likes: like,
        })
      );
      message.success("已从我喜欢移除");
      return;
    }
    // 喜欢歌曲
    if (!islike && cookie) {
      // console.log("likes", likes);
      setTimeout(
        () =>
          tolike({
            id: songId,
            like: true,
            cookie: cookie,
            timerstamp: Date.now(),
          }),
        1000
      );

      const like = _.cloneDeep(likes);
      // unshift 方法会影响原数组！
      like.unshift(songId as number);

      console.log("songId", songId, "likelist", like);

      // const like = [songId, ...likes];
      dispatch(
        changelike({
          likes: like,
        })
      );
      message.success("已添加到我喜欢");
      return;
    }
    message.warning("请先登录");
  }, [cookie, tolike, islike, songId, dispatch, changelike]);

  return (
    <ParkLike
      onClick={() => likeMusci()}
      theme={islike ? "filled" : "outline"}
      size="24"
      fill={islike ? "rgb(192, 44, 56)" : "rgb(237, 195, 194)"}
      style={{ cursor: "pointer" }}
    />
  );
});
