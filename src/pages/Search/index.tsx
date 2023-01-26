import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useCloudsearch } from "body/Header/utils";
import { CardList } from "components";
import SongsItem from "components/SongsItem";
import { config } from "utils/customRender";
const DATEFORMAT = "YYYY-MM-DD HH:mm:ss";

export const Search = () => {
  const { searchparam } = useParams();
  // console.log("parparpar", searchparam);

  // const [param, setParam] = useSongIdSearchParam();
  const { data } = useCloudsearch({
    keywords: searchparam as string,
    limit: 100,
    offset: 1,
  });

  return (
    <div>
      <CardList many={config} dataSource={data?.result?.songs}>
        <SongsItem />
      </CardList>
    </div>
  );
};
