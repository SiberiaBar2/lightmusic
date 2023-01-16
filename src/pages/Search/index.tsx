import styled from "@emotion/styled";
import { useCloudsearch } from "body/Header/utils";
import { useSongIdSearchParam } from "body/PlayFooter/comutils";
import { CardList } from "components";
import SongsItem from "components/SongsItem";
import dayjs from "dayjs";
import { useMount } from "hooks";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
const DATEFORMAT = "YYYY-MM-DD HH:mm:ss";

export const Search = () => {
  const { searchparam } = useParams();
  console.log("parparpar", searchparam);

  // const [param, setParam] = useSongIdSearchParam();
  const { data } = useCloudsearch({
    keywords: searchparam as string,
    limit: 100,
    offset: 1,
  });

  //   const { mutate: enterSearch, data } = useCloudsearch();

  //   const { result: { songs, songCount } = { songs: [], songCount: 0 } } = data;
  //   console.log("songs", songs, "songCount", songCount);

  //   useMemo(() => {
  //     enterSearch({ keywords: param.searchparam });
  //   }, [param.searchparam]);
  // console.log("param", param);
  console.log("搜索歌曲", data);

  const renderFunc = (value: any) => {
    const { ar } = value;
    const authAndtime = ar.map((ele: any, index: number) => {
      if (index === 0) {
        return ele.name + "  ";
      }
      return "/" + "  " + ele.name;
    });

    // const formatTime = dayjs(publishTime).format(DATEFORMAT);

    // authAndtime.push(<span>{formatTime}</span>);
    return <Container>{authAndtime}</Container>;
  };

  const config = {
    renderFunc,
    color: ["rgb(167, 83, 90)", "rgb(167, 83, 90)"],
    background: ["rgb(240, 161, 168)", "rgb(241, 147, 156)"],
  };

  return (
    <div>
      <CardList many={config} dataSource={data?.result?.songs}>
        <SongsItem />
      </CardList>
    </div>
  );
};

const Container = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-between;
`;
