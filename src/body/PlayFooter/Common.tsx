import styled from "@emotion/styled";
import {
  AlignTextCenterOne,
  ShareThree,
  ThumbsUp as ThumbsUpPark,
} from "@icon-park/react";
import { stringAdds } from "utils/utils";

export const Common: React.FC = (props: any) => {
  const { content, timeStr, user, likedCount } = props;
  const { avatarUrl, nickname } = user;
  return (
    <Container>
      <div>
        <img src={stringAdds(avatarUrl)} alt="" />
      </div>
      <div>
        <p>
          <span style={{ color: "rgb(54, 41, 47)" }}>{nickname}:</span>
          {content}
        </p>
        <p>
          <span>{timeStr}</span>
          <IconWrap>
            <ThumbsUp>
              <ThumbsUpPark theme="filled" size="16" fill="rgb(155, 30, 100)" />
              <span>{likedCount}</span>
            </ThumbsUp>
            {/* <ShareThreeAdd theme="filled" size="16" fill="rgb(155, 30, 100)" />
            <AlignTextCenterOne
              theme="outline"
              size="16"
              fill="rgb(155, 30, 100)"
            /> */}
          </IconWrap>
        </p>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;

  div:nth-of-type(1) {
    width: 4rem;
    height: 4rem;
    margin-right: 1rem;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  div:nth-of-type(2) {
    width: calc(100% - 4rem);
    padding: 0.2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);
    box-sizing: border-box;
    font-size: 1.4rem;

    p {
      margin: 0;
    }
    p:nth-of-type(1) {
      span:nth-of-type(1) {
        margin-right: 1rem;
      }

      span:nth-of-type(2) {
        display: inline-block;
        cursor: pointer;
      }
      margin-bottom: 0.5rem;
    }

    p:nth-of-type(2) {
      display: flex;
      justify-content: space-between;

      span:nth-of-type(1) {
        scale: calc(0.9);
      }
    }
  }
`;

const IconWrap = styled.p`
  display: flex;
`;

const ShareThreeAdd = styled(ShareThree)`
  margin-right: 1rem;
`;

const ThumbsUp = styled.span`
  display: flex;
`;
