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
  /* height: 5rem; */
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
    /* height: 5.5rem; */
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    /* align-items: center; */
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    font-size: 1.4rem;

    p {
      margin: 0;
      /* font-size: 1.2rem; */
    }
    /* 
    span {
      font-size: 1.2rem;
    } */

    p:nth-of-type(1) {
      span:nth-of-type(1) {
        margin-right: 1rem;
        /* color: rgb(100, 88, 34); */
        /* width: ; */
      }

      span:nth-of-type(2) {
        display: inline-block;
        /* width: 70%; */
        /* height: 1rem; */
        /* overflow: hidden; */
        /* text-overflow: ellipsis; */
        cursor: pointer;
        /* white-space: nowrap; */
      }
      /* display: flex; */
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
