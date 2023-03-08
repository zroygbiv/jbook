import './cell-list.css';
import { Fragment, useEffect } from "react";
import { useTypedSelector } from "../hooks/use-typed-selector";
import AddCell from "./add-cell";
import CellListItem from "./cell-list-item";
import { useActions } from '../hooks/useActions';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id) => data[id]);
  });

  const { fetchCells } = useActions();

  useEffect(() => {
    fetchCells();
  }, []);

  const renderedCells = cells.map(cell => 
    <Fragment key={cell.id}>
      <CellListItem key={cell.id} cell={cell}/>
      <AddCell previousCellId={cell.id} />
    </Fragment> 
  );
  
  return (
    <div className="cell-list">
      <AddCell forceVisibility={cells.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;