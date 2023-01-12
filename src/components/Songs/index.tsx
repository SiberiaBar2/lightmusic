import { useSongIdSearchParam } from "body/PlayFooter/comutils";
export const Songs = (item: any) => {
  const [param, setParam] = useSongIdSearchParam();

  return (
    <span
      onClick={() =>
        setParam({
          ...param,
          songId: item.id,
        })
      }
    >
      {item.name}
    </span>
  );
};
