import { useState } from "react";
import { Like as ParkLike } from "@icon-park/react";

import { useLike } from "./utils";

export const Like = (props: any) => {
  const { songId } = props;
  const [like, setLike] = useState(false);

  const { mutate: tolike } = useLike();
  const likeMusci = () => {
    setLike(!like);
    if (like) {
      tolike({ id: songId });
    }
  };

  return (
    <ParkLike
      theme={like ? "filled" : "outline"}
      size="24"
      fill={like ? "rgb(192, 44, 56)" : "rgb(237, 195, 194)"}
      style={{ cursor: "pointer" }}
    />
  );
};
