import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { Dynamic } from "./Dynamic";
import { StaticFooter } from "./StaticFooter";
import { songsState } from "store/songs";
import { loginSlice, LoginState } from "store/login";

export const PlayFooter: React.FC = () => {
  const dispatch = useDispatch();
  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  const loginState = useSelector<
    RootState,
    Pick<LoginState, "data" | "islogin">
  >((state) => state.login);
  const { data: { data: { profile = {} } = {} } = {}, islogin } = loginState;
  const { songId } = songsState;
  console.log("index songId", songId);

  return (
    <>
      {songId ? (
        <Dynamic param={songsState} setParam={dispatch} />
      ) : (
        <StaticFooter />
      )}
    </>
  );
};
