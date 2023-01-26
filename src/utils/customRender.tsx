import styled from "@emotion/styled";

const renderFunc = (value: any) => {
  const { ar } = value;
  const authAndtime = ar.map((ele: any, index: number) => {
    if (index === 0) {
      return ele.name + "  ";
    }
    return "/" + "  " + ele.name;
  });
  // const formatTime = dayjs(publishTime).format(DATEFORMAT);

  // authAndtime.push(<span>{formatTime}</span>);
  return <Container>{authAndtime}</Container>;
};

export const config = {
  renderFunc,
  // color: ["rgb(167, 83, 90)", "rgb(167, 83, 90)"],
  // background: ["rgb(240, 161, 168)", "rgb(241, 147, 156)"],
};

const Container = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-between;
`;
