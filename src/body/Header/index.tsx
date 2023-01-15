import { Avatar, Button, Dropdown, Input } from "antd";
import styled from "@emotion/styled";
import { Left, Right } from "@icon-park/react";
import { KeyboardEventHandler, useState } from "react";
import { HotList } from "./HotList";
import { useDebounce } from "hooks";
import { useCloudsearch, useSuggest } from "./utils";
import { Suggest } from "./Suggest";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const debouncedParam = useDebounce(search, 500);
  const { mutate: enterSearch, data } = useCloudsearch();

  console.log("结果", data);

  console.log("debouncedParam", debouncedParam);

  const handelBlue = () => {
    setOpen(!open);
  };

  const handelEnter = (e: any) => {
    console.log(
      "debouncedParam ---- enter",
      debouncedParam,
      typeof debouncedParam
    );

    if (e.key === "Enter") {
      enterSearch({ keywords: debouncedParam });
    }
  };
  const items = [
    {
      label: <Button type={"link"}>登出</Button>,
      key: "logout",
    },
  ];

  return (
    <Container>
      <H4>you-musci</H4>
      <RightContent>
        <div>
          <Left theme="outline" size="24" fill="#333" />
          <Right theme="outline" size="24" fill="#333" />
        </div>
        <User>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "50%" }}
            onBlur={handelBlue}
            onFocus={handelBlue}
            onPressEnter={(e) => handelEnter(e)}
          />
          <Dropdown menu={{ items }}>
            <div>
              <Avatar
                style={{ backgroundColor: "pink", verticalAlign: "middle" }}
                size="large"
              />
              <span style={{ margin: "0 0.5rem", display: "inline-block" }}>
                hi {123}
              </span>
            </div>
          </Dropdown>
        </User>
      </RightContent>
      <SearchContent style={{ display: open ? "" : "none" }}>
        {!search ? <HotList /> : <Suggest param={debouncedParam} />}
      </SearchContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

const H4 = styled.h4`
  margin: 0;
  width: 19%;
  background: yellowgreen;
  height: 100%;
  line-height: 3.75rem;
  text-align: center;
  position: relative;
`;

const RightContent = styled.div`
  width: calc(100% - 19%);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const User = styled.div`
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 2.5rem;
`;

const SearchContent = styled.div`
  width: 18rem;
  height: 35rem;
  background: rgb(230, 210, 213);
  position: absolute;
  top: 3.75rem;
  right: 8rem;
  z-index: 20;
  overflow-y: auto;
`;
