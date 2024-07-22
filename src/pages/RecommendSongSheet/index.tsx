import { CSSProperties } from "react";
import { useLocation } from "react-router-dom";
import { Spin } from "antd";
import styled from "@emotion/styled";
import { Swiper, SwiperSlide } from "swiper/react";
import { useQuery } from "@karlfranz/reacthooks";
import { Navigation, Pagination, Autoplay } from "swiper";

import { AntCard } from "components/AntCard";
import { CardList } from "components";
import { arrAdds } from "utils/utils";
import {
  cookie,
  useBanner,
  useRecommend,
  // useRecommendResource,
  // useRecommendSongs,
} from "./utils";

import "swiper/css/bundle";
import { useHttp } from "utils";
import { useLogin } from "body/Header/utils";

interface Recommends {
  recommend: {
    alg: string;
    copywriter: string;
    createTime: number;
    creator: {
      remarkName: null;
      mutual: boolean;
      followed: boolean;
      avatarImgId: number;
      backgroundImgId: number;
      avatarImgIdStr: string;
      backgroundImgIdStr: string;
      signature: string;
      userType: number;
      lv: number;
      detailDescription: string;
      description: string;
      nickname: string;
      experts: {
        expertTags: string[];
        expertTagsName: string;
        expertId: number;
        name: string;
        expertType: number;
        expertTagsId: number;
        expertTagsIdStr: string;
      }[];
      id: number;
      name: string;
      picUrl: string;
      playcount: number;
      trackCount: number;
      type: number;
      userId: number;
    };
  }[];
}

export const RecommendSongSheet: React.FC = () => {
  const { data: recommend, loading: recommendLoaing } = useRecommend();
  const { data: banners, loading: bannersLoading } = useBanner();

  const client = useHttp();
  const query = useLocation();
  const { state } = query;
  const loginStatus = useLogin();
  const { data: recommends, loading: recommendsLoaing } = useQuery<
    Recommends[],
    null
  >(
    () =>
      client(loginStatus ? "recommend/resource" : "personalized", {
        data: { cookie: state?.userCookie },
      }),
    {
      responsePath: loginStatus ? "recommend" : "result",
    }
  );

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
      {arrAdds(banners?.banners, "imageUrl")?.map((item, index: number) => (
        <SwiperSlide
          style={{ width: "100%" }}
          key={item.encodeId}
          virtualIndex={index}
        >
          <ImgContainer>
            <Bannerimg src={item.imageUrl} alt="" />
          </ImgContainer>
        </SwiperSlide>
      ))}
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

  const loading = !recommendLoaing && !bannersLoading && !recommendsLoaing;

  return (
    <>
      {loading ? (
        <>
          {renderSwiper()}
          {renderCardList()}
        </>
      ) : (
        <SpinContainer>
          <Spin size="large" />
        </SpinContainer>
      )}
    </>
  );
};

const SpinContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImgContainer = styled.div`
  height: 33rem;
`;

const Bannerimg = styled.img`
  width: 100%;
  height: 100%;
`;
