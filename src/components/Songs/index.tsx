import { songIdSlice } from "store/play";
import { useDispatch } from "react-redux";
export const Songs = (item: any) => {
  const dispatch = useDispatch();
  const { getSongId } = songIdSlice.actions;

  return (
    <span style={{}} onClick={() => dispatch(getSongId(item.id))}>
      {item.name}
    </span>
  );
};
