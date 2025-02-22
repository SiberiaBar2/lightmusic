import { useParams } from "react-router-dom";

import { useCloudsearch } from "body/Header/utils";
import { CardList } from "components";
import SongsItem from "components/SongsItem";
import { config } from "utils/customRender";

export const Search: React.FC = () => {
  const { searchparam } = useParams();

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
