import Wrapper from "../assets/wrappers/StatItem";

const StatsItem = ({ count, title, icon, color, bcg, total }) => {
  let displayNumber = count;
  if (total) displayNumber = count / total; //average

  return (
    <Wrapper color={color} bcg={bcg}>
      <header>
        <span className="count">€ {Number(displayNumber).toFixed(2)}</span>
        <span className="icon">{icon}</span>
      </header>
      <h5 className="title">{title}</h5>
    </Wrapper>
  );
};;

export default StatsItem;
