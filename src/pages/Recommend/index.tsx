import styled from "@emotion/styled";
import { Card, Carousel, List } from "antd";
import { useBanner, useRecommend } from "./utils";
import { useNavigate } from "react-router-dom";
export const Recommend = () => {
  const { data: recommend } = useRecommend();
  const { data: banners } = useBanner();

  const navigate = useNavigate();
  // console.log("data", data?.result);
  console.log("banner", banners);

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
      <AntList
        grid={{ gutter: 10, column: 4 }}
        dataSource={recommend?.result}
        renderItem={(item: any) => (
          <List.Item>
            <AntCard onClick={() => navigate(`/songlist/${item.id}`)}>
              <Img src={item.picUrl} alt="" />
              <p style={{ fontSize: 14 }} title={item.name}>
                {item.name}
              </p>
            </AntCard>
          </List.Item>
        )}
      />
    </>
  );
};

const AntCard = styled(Card)`
  width: 14rem;
  height: 18rem;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
`;

const AntList = styled(List)`
  cursor: pointer;
`;

const AntCarousel = styled(Carousel)`
  width: 90%;
  height: 20rem;
  cursor: pointer;
  margin: 2rem;
`;

const ImgContainer = styled.div`
  width: 100%;
  height: 20rem;
`;

const Bannerimg = styled.img`
  width: 100%;
  height: 20rem;
`;
