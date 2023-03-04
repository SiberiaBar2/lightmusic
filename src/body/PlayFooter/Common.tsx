import styled from "@emotion/styled";
import {
  AlignTextCenterOne,
  ShareThree,
  ThumbsUp as ThumbsUpPark,
} from "@icon-park/react";
import { Tooltip } from "antd";
import { stringAdds } from "utils/utils";

export const Common = (props: any) => {
  const { content, timeStr, user, likedCount } = props;
  const { avatarUrl, nickname } = user;
  return (
    <Container>
      <div>
        <img src={stringAdds(avatarUrl)} alt="" />
      </div>
      <div>
        <p>
          <span>{nickname}</span>
          <Tooltip title={content}>
            <span>{content}</span>
          </Tooltip>
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
  height: 5rem;
  display: flex;
  align-items: center;

  div:nth-of-type(1) {
    width: 4rem;
    height: 4rem;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  div:nth-of-type(2) {
    width: calc(100% - 4rem);
    padding: 0.2rem;
    height: 5.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-bottom: 1px solid rgb(192, 142, 175);
    box-sizing: border-box;

    p {
      margin: 0;
    }

    span {
      font-size: 1.2rem;
    }

    p:nth-of-type(1) {
      span:nth-of-type(1) {
        margin-right: 0.5rem;
      }

      span:nth-of-type(2) {
        display: inline-block;
        width: 70%;
        /* height: 1rem; */
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        white-space: nowrap;
      }
      display: flex;
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
