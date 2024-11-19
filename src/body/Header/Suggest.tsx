import styled from "@emotion/styled";
import { useSuggest } from "./utils";

export const Suggest: React.FC = (props: any) => {
  const { param } = props;
  const { data: { result } = { result: {} } } = useSuggest(param);

  return (
    <Container>
      {result?.albums &&
        Array.isArray(result.albums) &&
        result.albums.map((item: any) => (
          <Item key={item.id}>
            <span>{item?.name}-</span>
            <span>{item?.artist?.name}</span>
          </Item>
        ))}
    </Container>
  );
};

const Container = styled.div`
  padding: 1rem;
`;

const Item = styled.div`
  padding: 0.2rem;
  background: rgb(240, 201, 207);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  height: 2rem;
  cursor: pointer;
`;
