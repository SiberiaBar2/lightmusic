import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  ForwardedRef,
} from "react";
import { Divider, Drawer as AntDrawer } from "antd";
import styled from "@emotion/styled";
import { DrawProps, DrawRefType } from "./Dynamic";
import { Common } from "./Common";
import { IsSame } from "./IsSame";
import { useSongs } from "./useSongs";
import { CardList } from "components";
import { stringAdds } from "utils/utils";
import "./index.css";

const Drawer = (props: DrawProps, ref: ForwardedRef<DrawRefType>) => {
  const { lyric, time, picUrl, songId } = props;

  // console.log("time ---->", time);

  const [visiable, setVisiable] = useState(false);

  /**
   *
   *  item. content:string 评论内容 commentId:number ，评论id ， timeStr:string 时间字符， time:number 时间戳，
   *  item. user 用户信息 ，avatarUrl: string 头像地址，nickname:string 昵称， userId:number 用户id， userType:number 用户类型
   *  console.log("hotComments", hotComments);
   *  data name：string 歌曲名，id： number 歌曲id， artists:[] 0.name 作者， picUrl ： 歌曲图片
   */

  const changeVisiable = () => {
    songId && setVisiable(!visiable);
  };
  const onClose = () => {
    setVisiable(false);
  };
  useImperativeHandle(ref, () => ({
    changeVisiable,
  }));

  const LryicConfig = {
    lyric,
    time,
  };

  return (
    <AntDrawer
      getContainer={false}
      keyboard
      placement="bottom"
      height={"100vh"}
      open={visiable}
      onClose={onClose}
      mask={false}
      closeIcon={null}
      style={{ background: "rgb(227, 180, 184)", color: "rgb(43, 51, 62)" }}
    >
      <Wrap>
        <Container>
          <RoundWrap picUrl={stringAdds(picUrl)} />
          <LyricWrap {...LryicConfig} />
        </Container>
        <CommonWrap songId={songId} />
      </Wrap>
    </AntDrawer>
  );
};

const RoundWrap: React.FC<Pick<DrawProps, "picUrl">> = React.memo(
  ({ picUrl }) => {
    return (
      <Round>
        <div>
          <img src={stringAdds(picUrl)} alt="" />
        </div>
        <div></div>
      </Round>
    );
  }
);

// 抽离组件，将频繁渲染的状态单独提出， 自身状态变化 不影响其他组件重复渲染
const LyricWrap: React.FC<Pick<DrawProps, "lyric" | "time">> = ({
  lyric,
  time,
}) => {
  const [lrc, setLrc] = useState<string[]>([""]);

  const div = document.getElementById("lyricdiv") as HTMLElement;

  // console.log("div", div);

  // const containerHeight = document.querySelector("#container")
  //   ?.clientHeight as number;
  // const liHeight = div?.children[0].clientHeight as number;

  // console.log("liHeight", liHeight);

  // const maxOffset = (div?.clientHeight as number) - containerHeight;

  useMemo(() => {
    // const lines = lyric.split("\n");
    // console.log("lines", lines);

    const timeArr: string[] = [];
    const lrcArr: string[] = [];
    const regex = /\[(\d{2}:\d{2})\.\d{2,3}\](.+)/g;
    // console.log("regex.exec(lyric)", regex.exec(lyric));
    let tmp = regex.exec(lyric);
    // console.log("tmp", tmp);

    // console.log("time", time);

    while (tmp) {
      timeArr.push(tmp[1]);
      lrcArr.push(tmp[2]);
      tmp = regex.exec(lyric); // 不写页面崩溃
    }
    // console.log("timeArr", timeArr);

    setLrc(lrcArr);
    const index = timeArr.findIndex((item: any) => {
      // console.log("time", time);
      // console.log("tim--->item-", item);
      // console.log("item === time", item === time);

      return item === time;
    });

    // console.log("index", index);

    // console.log("time---->", time);
    // console.log("divdivdiv", div);

    // let offset = liHeight * index + liHeight / 2 - containerHeight / 2;
    // // 处理边界问题

    // if (offset < 0) {
    //   offset = 0;
    // }
    // if (offset > maxOffset) {
    //   offset = maxOffset;
    // }
    // if (div) {
    //   div.style.transform = `translateY(-${offset})rem`;
    //   // 去除之前的active
    //   let li = div.querySelector(".active");
    //   if (li) {
    //     li.classList.remove("active");
    //   }

    //   li = div.children[index];
    //   if (li) {
    //     li.classList.add("active");
    //   }
    // }

    if (index !== -1 && div) {
      div.style.top = -index * 3 + 12.5 + "rem";
      [...div.children].forEach((item) => {
        if (item) {
          item.classList.remove("active");
        }
      });
      if (div.children[index]) {
        div.children[index].classList.add("active");
      }
    }
    // console.log("index----->", index);
  }, [lyric, time]);
  return (
    <Lyric id="container">
      <ul id="lyricdiv">
        {lrc.map((item: any, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </Lyric>
  );
};

const CommonWrap: React.FC<Pick<DrawProps, "songId">> = React.memo(
  ({ songId }) => {
    const { hotComments, comments, userId, topComments, songs } =
      useSongs(songId);

    return (
      <Comment>
        <CommentList>
          <Divider orientation="left">热评</Divider>
          {Array.isArray(hotComments) &&
            hotComments.map((ele: any) => (
              <Common key={ele.commentId} {...ele} />
            ))}
          <Divider orientation="left">最新评论</Divider>
          {Array.isArray(comments) &&
            comments.map((ele: any) => <Common key={ele.commentId} {...ele} />)}
        </CommentList>
        <Revelant>
          <Divider orientation="left">相关</Divider>
          <CardList grid={{ column: 1, gutter: 1 }} dataSource={songs}>
            <IsSame />
          </CardList>
        </Revelant>
      </Comment>
    );
  }
);

export default forwardRef(Drawer);

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Container = styled.div`
  width: 90rem;
  height: 30rem;
  display: flex;
  margin-top: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid salmon; */
  /* justify-content: space-between; */
`;

const Round = styled.div`
  width: 40rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-left: 1rem;
  /* margin-right: 15rem; */

  div:nth-of-type(1) {
    width: 25rem;
    height: 25rem;

    img:nth-of-type(1) {
      width: 100%;
      height: 100%;
    }
  }

  div:nth-of-type(2) {
    width: 100%;
    height: 3rem;
  }
`;

const Lyric = styled.div`
  /* flex: 1; */
  /* width: 100%; */
  width: 50rem;
  /* width: 40rem; */
  overflow: hidden;
  /* padding: 2rem; */
  position: relative;
  font-size: 1.4rem;
  /* text-align: center; */
  height: 25rem;
  overflow-y: auto;

  /* > div {
    position: absolute;
    top: 15rem; */
  ul {
    width: 100%;
    position: absolute;
    /* top: 15rem; */
    left: 0;
    padding: 0;

    li {
      margin-bottom: 1rem;
      min-height: 2rem;
      list-style: none;
      width: 100%;
      line-height: 2rem;
      /* transition: 0.6s; */
      /* text-overflow: ; */
      /* text-align: center; */
    }
  }
  /* } */
`;

const Comment = styled.div`
  display: flex;
  width: 90rem;
`;

const CommentList = styled.div`
  width: 60%;
`;

const Revelant = styled.div`
  flex: 1;
  margin: 2rem;
`;

Drawer.whyDidYouRender = true;
