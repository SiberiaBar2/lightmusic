import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Drawer as AntDrawer } from "antd";
import styled from "@emotion/styled";
import "./index.css";

const Drawer = (props: any, ref: any) => {
  const { lyric, musicRef, time, picUrl } = props;
  console.log("lyric", lyric);
  // audioTimeUpdate();
  const [visiable, setVisiable] = useState(false);
  const [lrc, setLrc] = useState<string[]>([""]);
  const lrcRef: React.MutableRefObject<any> = useRef();

  const changeVisiable = () => {
    setVisiable(!visiable);
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
      [...div.children].forEach((item) => (item.className = ""));
      div.children[index].className = "active";
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
    >
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
        <CommentList></CommentList>
        <Revelant></Revelant>
      </Comment>
    </AntDrawer>
  );
};

export default forwardRef(Drawer);

const Container = styled.div`
  margin: 0 20rem;
  height: 75%;
  display: flex;
`;

const Round = styled.div`
  border: 1px solid violet;
  box-sizing: border-box;
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
    background: darkorange;
  }
`;

const Lyric = styled.div`
  border: 1px solid rebeccapurple;
  box-sizing: border-box;
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
  margin: 0 20rem;
  /* border: 1px solid salmon;
  box-sizing: border-box; */
  height: 100%;
`;

const CommentList = styled.div`
  width: 60%;
  border: 1px solid navy;
  box-sizing: border-box;
`;

const Revelant = styled.div`
  flex: 1;
  border: 1px solid magenta;
  box-sizing: border-box;
`;

Drawer.whyDidYouRender = true;
