import styled from "@emotion/styled";
import { Carousel } from "antd";
import { useBanner, useRecommend, useRecommendSongs } from "./utils";
import { AntCard } from "components/AntCard";
import { CardList } from "components";

export const Recommend = () => {
  const { data: recommend } = useRecommend();
  const { data: banners } = useBanner();
  const { data: { data: { dailySongs = [] } = {} } = {} } = useRecommendSongs();
  console.log("recommendSongs", dailySongs);
  console.log("recommend", recommend);

  // const getNewList = recommend?.result.unshit()
  const onChange = (event: any) => {
    console.log(event);
  };

  return (
    <>
      <AntCarousel afterChange={(event) => onChange(event)} autoplay={true}>
        {banners?.banners.map((item: any) => (
          <ImgContainer key={item.encodeId}>
            <Bannerimg src={item.imageUrl} alt="" />
          </ImgContainer>
        ))}
      </AntCarousel>
      <CardList
        grid={{ column: 4, lg: 4, xs: 2, xxl: 5 }}
        dataSource={recommend?.result}
      >
        <AntCard />
      </CardList>
    </>
  );
};

const AntCarousel = styled(Carousel)`
  width: 90%;
  height: 25rem;
  cursor: pointer;
  margin: 2rem;
`;

const ImgContainer = styled.div`
  width: 100%;
  height: 25rem;
`;

const Bannerimg = styled.img`
  width: 100%;
  height: 25rem;
`;
