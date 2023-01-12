import styled from "@emotion/styled";
import { List, Skeleton, Image } from "antd";
import { useParams } from "react-router-dom";
import { useSongList } from "./utils";
import { songIdSlice } from "store/play";
import { useDispatch } from "react-redux";

export const SongList = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { getSongId } = songIdSlice.actions;
  console.log("mmm", id);

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
              歌曲数：{songList?.playlist?.tracks.length}播放数：{" "}
              {songList?.playlist?.playCount}
            </Span>
            <Span>简介: {songList?.playlist?.name}</Span>
          </DescribtionContent>
        </Describtion>
      </ImageContainer>
      <List
        size="large"
        dataSource={songList?.playlist?.tracks}
        renderItem={(item: any) => (
          <List.Item
            onClick={() => {
              console.log("item -a--->", item);
              dispatch(getSongId(item.id));
            }}
            //   actions={[<RightCircleOutlined style={{ fontSize: 24 }} />]}
          >
            {item.name}
          </List.Item>
        )}
      />
    </Skeleton>
  );
};

const ImageContainer = styled.div`
  display: flex;
  margin: 2rem;
`;

const Describtion = styled.div`
  /* display: flex; */
  /* flex-direction: column; */
  /* justify-content: r; */
  position: relative;
  /* margin: 0.5rem; */
  margin-left: 3rem;
  width: 100%;
  /* align-items: center; */
  /* span {
    display: block;
  } */
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
