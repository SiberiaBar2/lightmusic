import styled from "@emotion/styled";
import { Skeleton, Image } from "antd";
import { useParams } from "react-router-dom";
import { CardList } from "components";
import SongsItem from "components/SongsItem";
import { config } from "utils/customRender";
import { useBackTop } from "hooks";
import numeral from "numeral";
import { useRankingSongs } from "components/CardSongs/utils";

export const SongList: React.FC = () => {
  useBackTop();

  const { id } = useParams();
  const { data: songList, isLoading } = useRankingSongs(id!);
  const formatNumber = (num: number) => {
    if (num < 10000) {
      return num.toString(); // 小于一万直接显示
    } else {
      return numeral(num / 10000).format("0.0") + "万"; // 大于一万显示“万”单位，保留一位小数
    }
  };
  const renderInfoList = () => (
    <>
      <Info>
        <Span>歌曲数：{songList?.playlist?.tracks?.length}</Span>
      </Info>
      <Info>
        <Span>
          播放数：
          {formatNumber(songList?.playlist?.playCount)}
        </Span>
      </Info>
      <Info>
        <Span>标签: </Span>
        {songList?.playlist?.tags.map((item: any, index: number) => {
          if (index !== 2) return <Span key={item}>{item}、</Span>;
          if (index === 2) return <Span key={item}>{item}</Span>;
        })}
      </Info>
      <Info>
        <Span>简介:</Span>
        <Span> {songList?.playlist?.name}</Span>
      </Info>
    </>
  );

  return (
    <Skeleton loading={isLoading} active={true}>
      <ImageContainer>
        <Image
          style={{ width: "15rem", height: "15rem" }}
          src={songList?.playlist?.coverImgUrl}
        />
        <Describtion>
          <DescribtionContent>{renderInfoList()}</DescribtionContent>
        </Describtion>
      </ImageContainer>
      <CardList
        many={config}
        size="large"
        dataSource={songList?.playlist?.tracks}
      >
        <SongsItem />
      </CardList>
    </Skeleton>
  );
};

const ImageContainer = styled.div`
  display: flex;
  margin: 2rem;
`;

const Describtion = styled.div`
  position: relative;
  margin-left: 3rem;
  width: 100%;
`;

const DescribtionContent = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  bottom: 0;
`;

const Info = styled.div`
  margin-bottom: 0.5rem;
`;

const Span = styled.span`
  margin-right: 0.5rem;
`;
