import { CSSProperties } from "react";
import styled from "@emotion/styled";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import { AntCard } from "components/AntCard";
import { CardList } from "components";
import { arrAdds } from "utils/utils";
import {
  cookie,
  useBanner,
  useRecommend,
  useRecommendResource,
  useRecommendSongs,
} from "./utils";

import "swiper/css/bundle";
import { Divider } from "antd";
import { useBackTop } from "hooks";

export const RecommendSongSheet: React.FC = () => {
  useBackTop();
  const { data: recommend } = useRecommend();
  const { data: banners } = useBanner();
  const { data: { data: { dailySongs = [] } = {} } = {} } = useRecommendSongs();
  const { data: { recommend: recommends = [] } = {} } = useRecommendResource();

  const renderSwiper = () => (
    <Swiper
      style={
        {
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
          zIndex: 0,
        } as CSSProperties
      }
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      autoHeight={true}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
    >
      {arrAdds(banners?.banners, "imageUrl")?.map(
        (item: any, index: number) => (
          <SwiperSlide
            style={{ width: "100%" }}
            key={item.encodeId}
            virtualIndex={index}
          >
            <ImgContainer>
              <Bannerimg src={item.imageUrl} alt="" />
            </ImgContainer>
          </SwiperSlide>
        )
      )}
    </Swiper>
  );

  const renderCardList = () => (
    <>
      {cookie && (
        <CardList
          grid={{ column: 4, lg: 4, xs: 2, xxl: 5 }}
          dataSource={arrAdds(recommends, "picUrl")}
        >
          <AntCard />
        </CardList>
      )}
      <CardList
        grid={{ column: 4, lg: 4, xs: 2, xxl: 5 }}
        dataSource={arrAdds(recommend?.result, "picUrl")}
      >
        <AntCard />
      </CardList>
    </>
  );

  return (
    <>
      {renderSwiper()}
      {renderCardList()}
    </>
  );
};

const ImgContainer = styled.div`
  height: 33rem;
`;

const Bannerimg = styled.img`
  width: 100%;
  height: 100%;
`;
