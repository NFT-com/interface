import { SearchContent } from 'components/modules/Search/SearchContent';

interface SearchBarProps {
  leaderBoardSearch?: boolean;
}

export const SearchBar = (props: SearchBarProps) => {
  return (
    <SearchContent leaderBoardSearch={props.leaderBoardSearch} isHeader />);
};
