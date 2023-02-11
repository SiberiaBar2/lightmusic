import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Divider, Drawer as AntDrawer } from "antd";
import styled from "@emotion/styled";
import { DrawProps } from "./Dynamic";
import "./index.css";
import { Common } from "./Common";
import { IsSame } from "./IsSame";
import { useSongs } from "./useSongs";
import { CardList } from "components";

const Drawer = (props: DrawProps, ref: any) => {
  const { lyric, time, picUrl, songId } = props;

  const [visiable, setVisiable] = useState(false);
  const [lrc, setLrc] = useState<string[]>([""]);

  const { hotComments, comments, userId, topComments, songs } =
    useSongs(songId);

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

  useMemo(() => {
    const timeArr: any = [];
    const lrcArr: any = [];
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
    // console.log("time---->", time);
    const div = document.getElementById("lyricdiv");
    // console.log("divdivdiv", div);

    if (index !== -1 && div) {
      div.style.top = -index * 2.5 + 15 + "rem";
      [...div.children].forEach((item) => {
        if (item) {
          item.className = "";
        }
      });
      if (div.children[index]) {
        div.children[index].className = "active";
      }
    }
    // console.log("index----->", index);
  }, [lyric, time]);

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
          <Round>
            <div>
              <img src={picUrl} alt="" />
            </div>
            <div></div>
          </Round>
          <Lyric>
            {/* <div> */}
            <ul id="lyricdiv">
              {lrc.map((item: any, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            {/* </div> */}
          </Lyric>
        </Container>
        <Comment>
          <CommentList>
            <Divider orientation="left">热评</Divider>
            {Array.isArray(hotComments) &&
              hotComments.map((ele: any) => (
                <Common key={ele.commentId} {...ele} />
              ))}
            <Divider orientation="left">最新评论</Divider>
            {Array.isArray(comments) &&
              comments.map((ele: any) => (
                <Common key={ele.commentId} {...ele} />
              ))}
          </CommentList>
          <Revelant>
            <Divider orientation="left">相关</Divider>
            <CardList grid={{ column: 1, gutter: 1 }} dataSource={songs}>
              <IsSame />
            </CardList>
          </Revelant>
        </Comment>
      </Wrap>
    </AntDrawer>
  );
};

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
  /* border: 1px solid salmon; */
  /* justify-content: space-between; */
`;

const Round = styled.div`
  width: 20rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-right: 15rem;

  div:nth-of-type(1) {
    width: 18rem;
    height: 18rem;

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
  flex: 1;
  /* width: 40rem; */
  overflow: auto;
  /* padding: 2rem; */
  position: relative;
  font-size: 1.4rem;

  /* > div {
    position: absolute;
    top: 15rem; */
  ul {
    width: 100%;
    position: absolute;
    top: 15rem;

    li {
      margin-bottom: 1.5rem;
      height: 1rem;
      list-style: none;
      width: 100%;
      line-height: 1rem;
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
