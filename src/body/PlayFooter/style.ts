import styled from "@emotion/styled";

export const Container = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4.3rem;
  background: rgb(249, 241, 219);
  position: relative;
  color: rgb(93, 101, 95);

  .ant-drawer {
    margin-bottom: 4.3rem;
    border: none;
    z-index: -1;
  }

  .ant-drawer-body {
    padding: 0;
  }
`;
export const DivOne = styled.div`
  width: 20rem;
  height: 100%;
  display: flex;
  align-items: center;

  > div:nth-of-type(1) {
    width: 3rem;
    height: 3rem;
    margin-left: 0.9rem;
    border: 1px solid darkblue;
    text-align: center;
    cursor: pointer;
    position: relative;

    &:hover {
      > div:nth-of-type(1) {
        display: block;
      }
    }

    > div:nth-of-type(1) {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.4);
      text-align: center;
      line-height: 300px;
      font-size: 30px;
      color: white;
      display: none;
      line-height: 3rem;
      text-align: center;
    }

    > img:nth-of-type(1) {
      width: 100%;
      height: 100%;
    }
  }

  > div:nth-of-type(2) {
    margin-left: 1rem;

    > div:nth-of-type(1) {
      margin-bottom: 0.3rem;
    }
  }
`;

export const DivTwo = styled.div`
  width: 20rem;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const DivThree = styled.div`
  width: 20rem;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const VolumeWrap = styled.div`
  position: relative;
  &:hover {
    > div:nth-of-type(1) {
      display: block;
    }
  }

  > div:nth-of-type(1) {
    width: 2rem;
    position: absolute;
    height: 4.5rem;
    background: rgb(237, 195, 194);
    top: -4.5rem;
    border-radius: 0.8rem;
    display: none;
    z-index: 999;

    &:hover {
      display: block;
    }
  }
`;

export const Progress = styled.div`
  height: 0.25rem;
  background: rgb(167, 83, 90);
  position: absolute;
  top: -0.1rem;
  left: 0;
  width: 100%;
  z-index: 99;

  .ant-slider {
    margin: 0;
    padding-block: 0;

    &:hover {
      .ant-slider-handle {
        display: block;
      }
    }

    .ant-slider-handle {
      top: -2px;
      display: none;
    }
  }
`;
