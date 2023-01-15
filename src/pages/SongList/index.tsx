import styled from "@emotion/styled";
import { Skeleton, Image } from "antd";
import { useParams } from "react-router-dom";
import { useSongList } from "./utils";
import { CardList } from "components";
import SongsItem from "components/SongsItem";

export const SongList = () => {
  const { id } = useParams();
  const { data: songList, isLoading } = useSongList({ data: { id } });
  return (
    <Skeleton loading={isLoading} active={true}>
      <ImageContainer>
        <Image
          style={{ width: "15rem", height: "15rem" }}
          src={songList?.playlist?.coverImgUrl}
        />
        <Describtion>
          <DescribtionContent>
            <div>
              <span>标签: </span>
              {songList?.playlist?.tags.map((item: any, index: number) => {
                if (index !== 2) return <span key={item}>{item}、</span>;
                if (index === 2) return <span key={item}>{item}</span>;
              })}
            </div>
            <Span>
              歌曲数：{songList?.playlist?.tracks?.length}播放数：{" "}
              {songList?.playlist?.playCount}
            </Span>
            <Span>简介: {songList?.playlist?.name}</Span>
          </DescribtionContent>
        </Describtion>
      </ImageContainer>
      <CardList size="large" dataSource={songList?.playlist?.tracks}>
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

const Span = styled.span`
  margin: 0.2rem;
`;
