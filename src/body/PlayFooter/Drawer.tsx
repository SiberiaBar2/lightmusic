import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Divider, Drawer as AntDrawer } from "antd";
import styled from "@emotion/styled";
import { DrawProps } from "./Dynamic";
import "./index.css";
import { Common } from "./Common";
import { IsSame } from "./IsSame";
import { useSongs } from "./useSongs";

const Drawer = (props: DrawProps, ref: any) => {
  const { lyric, musicRef, time, picUrl, songId } = props;
  // console.log("lyric", lyric);
  // audioTimeUpdate();
  const [visiable, setVisiable] = useState(false);
  const [lrc, setLrc] = useState<string[]>([""]);
  const lrcRef: React.MutableRefObject<any> = useRef();

  const { hotComments, comments, userId, topComments, songs } =
    useSongs(songId);

  // const { data: check } = useCheckMusic(songId);
  // console.log("check", check);

  // item. content:string 评论内容 commentId:number ，评论id ， timeStr:string 时间字符， time:number 时间戳，
  // item. user 用户信息 ，avatarUrl: string 头像地址，nickname:string 昵称， userId:number 用户id， userType:number 用户类型
  // console.log("hotComments", hotComments);

  // data name：string 歌曲名，id： number 歌曲id， artists:[] 0.name 作者， picUrl ： 歌曲图片

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
    while (tmp) {
      timeArr.push(tmp[1]);
      lrcArr.push(tmp[2]);
      tmp = regex.exec(lyric);
    }
    setLrc(lrcArr);
    const index = timeArr.findIndex((item: any) => item === time);
    // console.log("time---->", time);
    const div = document.getElementById("lyricdiv");
    // console.log("divdivdiv", div);

    if (index !== -1 && div) {
      div.style.top = -index * 2 + 11 + "rem";
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
      height={"98vh"}
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
            <div id="lyricdiv" ref={lrcRef}>
              {lrc.map((item: any, index: number) => (
                <p key={index}>{item}</p>
              ))}
            </div>
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
            {Array.isArray(songs) &&
              songs.map((ele) => <IsSame key={ele.id} {...ele} />)}
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
  width: 55rem;
  height: 75%;
  display: flex;
  margin-top: 7rem;
`;

const Round = styled.div`
  width: 20rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  div:nth-of-type(1) {
    width: 15rem;
    height: 15rem;

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
  overflow: auto;
  padding: 2rem;
  position: relative;

  > div {
    position: absolute;
  }
`;

const Comment = styled.div`
  display: flex;
  width: 55rem;
`;

const CommentList = styled.div`
  width: 60%;
`;

const Revelant = styled.div`
  flex: 1;
  margin: 2rem;
  /* background: aliceblue; */
`;

Drawer.whyDidYouRender = true;
